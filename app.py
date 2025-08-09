import os
import io
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import json
import re
from dotenv import load_dotenv

# OCR libraries
try:
    from pypdf import PdfReader
except Exception:
    PdfReader = None

try:
    import pytesseract
except Exception:
    pytesseract = None

from pyngrok import ngrok, conf

# Load environment from .env (for local dev)
load_dotenv()

conf.get_default().auth_token = "2vuIkaBHuxB8IsBgWa1DfgFvSsO_5ninjhmiKtmfsn4xWADxL"

app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React frontend

# Configure Gemini API using the latest SDK
client = None
try:
    # Prefer GEMINI_API_KEY, fallback to GOOGLE_API_KEY for compatibility
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if GEMINI_API_KEY:
        client = genai.Client(api_key=GEMINI_API_KEY)
        print("✅ Gemini API configured successfully with new SDK.")
    else:
        print("⚠️ GEMINI_API_KEY not set; /get_health_info will use fallback responses.")
except Exception as e:
    print(f"❌ Error configuring Gemini API: {e}")
    client = None

# Load the pretrained ViT model
def load_model():
    # Load pre-trained ViT model
    # Use ViT-B/16 architecture
    model = models.vit_b_16(weights='IMAGENET1K_V1')
    
    # Modify the classifier to predict 3 classes (pizza, steak, sushi)
    model.heads = torch.nn.Linear(in_features=768, out_features=3)
    
    # Load saved model weights if they exist (replace with your saved model path)
    model_path = 'models/pretrained_vit_food_model.pth'
    if os.path.exists(model_path):
        try:
            model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
            print("Loaded saved model weights")
        except Exception as e:
            print(f"Error loading model weights: {e}")
            print("Using default pretrained model")
    else:
        print("No saved model found, using default pretrained model")
    
    model.eval()  # Set model to evaluation mode
    return model

# Load the model at startup
model = load_model()

# Define class names
class_names = ['pizza', 'steak', 'sushi']

# Define transforms for the input images
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    # Get the image file from the request
    image_file = request.files['image']
    img = Image.open(image_file.stream).convert('RGB')
    
    # Apply transformations to the image
    img_tensor = transform(img).unsqueeze(0)  # Add batch dimension
    
    # Make prediction
    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
    
    # Get top predictions
    top_probs, top_indices = torch.topk(probabilities, len(class_names))
    
    # Create list of class predictions with confidence scores
    top_classes = [
        {'class': class_names[idx], 'confidence': prob.item()}
        for idx, prob in zip(top_indices, top_probs)
    ]
    
    # Return prediction result
    result = {
        'class': class_names[top_indices[0]],  # Top predicted class
        'confidence': top_probs[0].item(),     # Confidence score for top prediction
        'top_classes': top_classes             # All class predictions with scores
    }
    
    return jsonify(result)

@app.route('/get_health_info', methods=['POST'])
def get_health_info():
    if not client:
        return jsonify({'error': 'Gemini API not configured'}), 500

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    food_name = data.get('food_name')
    height = data.get('height')
    weight = data.get('weight')
    bmi = data.get('bmi')
    conditions = data.get('conditions')

    if not all([food_name, height, weight, bmi]): # Conditions can be empty
        return jsonify({'error': 'Missing required health data (food_name, height, weight, bmi)'}), 400

    prompt = f"""
Analyze the food '{food_name}'. 
Provide its key health benefits. 
Based on the following user profile:
- Height: {height} cm
- Weight: {weight} kg
- BMI: {bmi}
- Pre-existing conditions: {conditions if conditions else 'None specified'}

Should this user eat this food? Provide a brief recommendation (e.g., 'Recommended', 'Eat in moderation', 'Avoid') and a short explanation for the recommendation.

Format the response strictly as a JSON object with two keys:
1.  "health_benefits": A string containing the health benefits.
2.  "recommendation": A string containing the recommendation and explanation.

Example JSON output:
{{
  "health_benefits": "Rich in protein and iron, supports muscle growth.",
  "recommendation": "Recommended: Good source of nutrients, but consider portion size due to fat content."
}}
"""

    try:
        print(f"🔄 Sending request to Gemini API for food: {food_name}")
        
        # Use a simpler approach without JSON constraint initially
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        
        print(f"📥 Raw response received: {type(response)}")
        
        # Check if response exists
        if not response:
            print("❌ No response object received")
            return jsonify({'error': 'No response from Gemini API'}), 500
        
        # Debug: Print response structure
        print(f"🔍 Response attributes: {[attr for attr in dir(response) if not attr.startswith('_')]}")
        
        # Try to get the text content using different methods
        response_text = None
        
        if hasattr(response, 'text') and response.text is not None:
            response_text = response.text
            print(f"📝 Got text from response.text: {response_text[:100]}...")
        elif hasattr(response, 'candidates') and response.candidates:
            # Try to get text from candidates
            print("📝 Trying to get text from candidates...")
            candidate = response.candidates[0]
            if hasattr(candidate, 'content'):
                content = candidate.content
                if hasattr(content, 'parts') and content.parts:
                    part = content.parts[0]
                    if hasattr(part, 'text'):
                        response_text = part.text
                        print(f"📝 Got text from candidates: {response_text[:100]}...")
        
        if not response_text:
            print("❌ No text content found in response")
            # Return a fallback response
            return jsonify({
                'health_benefits': f"{food_name} provides various nutrients and can be part of a balanced diet.",
                'recommendation': f"Enjoy {food_name} in moderation. Consider your individual dietary needs and health goals."
            })
        
        response_text = response_text.strip()
        if not response_text:
            print("❌ Empty text after stripping")
            return jsonify({
                'health_benefits': f"{food_name} contains nutrients that support overall health.",
                'recommendation': f"Include {food_name} as part of a varied, balanced diet."
            })
        
        print(f"✅ Successfully got response text: {response_text[:200]}...")
        
        # Try to parse JSON from response
        try:
            # First try direct JSON parsing
            response_json = json.loads(response_text)
            print("✅ Direct JSON parsing successful")
        except json.JSONDecodeError:
            print("⚠️ Direct JSON parsing failed, trying to extract JSON...")
            # Try to extract JSON from markdown code blocks
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', response_text, re.DOTALL)
            if json_match:
                try:
                    response_json = json.loads(json_match.group(1))
                    print("✅ JSON extracted from markdown")
                except json.JSONDecodeError:
                    response_json = None
            else:
                # Try to find any JSON-like structure
                json_match = re.search(r'\{[^{}]*"health_benefits"[^{}]*"recommendation"[^{}]*\}', response_text, re.DOTALL)
                if json_match:
                    try:
                        response_json = json.loads(json_match.group(0))
                        print("✅ JSON pattern extracted")
                    except json.JSONDecodeError:
                        response_json = None
                else:
                    response_json = None
            
            if not response_json:
                print("❌ No JSON structure found, creating fallback response")
                # Create a fallback response based on the text
                response_json = {
                    "health_benefits": f"{food_name} contains various nutrients that can contribute to a balanced diet.",
                    "recommendation": f"Enjoy {food_name} in moderation as part of a healthy, varied diet. Consider your individual health needs."
                }

        # Validate required keys
        if 'health_benefits' not in response_json or 'recommendation' not in response_json:
            print("❌ Missing required keys in response, using fallback")
            response_json = {
                "health_benefits": f"{food_name} provides nutrients that support overall health and wellness.",
                "recommendation": f"Include {food_name} as part of a balanced diet, considering your individual dietary requirements."
            }

        print("✅ Successfully processed health info request")
        return jsonify(response_json)

    except Exception as e:
        print(f"❌ Error in get_health_info: {str(e)}")
        print(f"🔍 Exception type: {type(e)}")
        import traceback
        print(f"🔍 Full traceback: {traceback.format_exc()}")
        
        # Return a safe fallback response instead of error
        return jsonify({
            'health_benefits': f"{food_name} contains nutrients that can be part of a healthy diet.",
            'recommendation': f"Enjoy {food_name} in moderation. Consult with a healthcare provider for personalized dietary advice."
        })


@app.route('/ocr-extract', methods=['POST'])
def ocr_extract():
    try:
        if 'file' not in request.files:
            return jsonify({ 'error': 'No file provided. Use form-data with key "file"' }), 400
        file = request.files['file']
        filename = getattr(file, 'filename', '') or ''
        ctype = file.mimetype or ''

        # PDF handling with pypdf
        if ('pdf' in ctype.lower()) or filename.lower().endswith('.pdf'):
            if PdfReader is None:
                return jsonify({ 'error': 'pypdf not installed on server' }), 500
            try:
                # Read bytes in-memory
                data = file.read()
                reader = PdfReader(io.BytesIO(data))
                parts = []
                # Extract text from first 3 pages max for speed
                for i, page in enumerate(reader.pages[:3]):
                    try:
                        txt = page.extract_text(extraction_mode="layout") or ''
                        parts.append(txt)
                    except Exception:
                        # fallback without layout
                        try:
                            txt = page.extract_text() or ''
                            parts.append(txt)
                        except Exception:
                            continue
                text = "\n".join([p.strip() for p in parts if p and p.strip()])
                return jsonify({ 'text': text.strip(), 'pages': min(len(reader.pages), 3) })
            except Exception as e:
                return jsonify({ 'error': 'Failed to parse PDF', 'details': str(e) }), 500

        # Image handling with pytesseract
        else:
            if pytesseract is None:
                return jsonify({ 'error': 'pytesseract not installed on server' }), 500
            try:
                img = Image.open(file.stream).convert('RGB')
                # Optional: light pre-processing
                # Resize very large images to speed up OCR
                max_side = 2000
                if max(img.size) > max_side:
                    ratio = max_side / float(max(img.size))
                    new_size = (int(img.size[0]*ratio), int(img.size[1]*ratio))
                    img = img.resize(new_size)
                custom_cfg = r'--oem 3 --psm 6'
                text = pytesseract.image_to_string(img, lang='eng', config=custom_cfg)
                return jsonify({ 'text': (text or '').strip() })
            except Exception as e:
                return jsonify({ 'error': 'Failed to OCR image', 'details': str(e) }), 500
    except Exception as e:
        return jsonify({ 'error': 'Unexpected error', 'details': str(e) }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("🚀 Starting Flask backend for NutriVision AI...")
    print("📍 Flask API will be running at: http://localhost:5001")
    print("🌐 Frontend should be running at: http://localhost:3000")
    print("🔗 Make sure frontend API_BASE_URL points to: http://localhost:5001/")
    print("✅ CORS enabled for cross-origin requests")
    
    # Run the Flask app on port 5001
    app.run(host='0.0.0.0', port=5001, debug=True)

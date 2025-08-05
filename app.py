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

from pyngrok import ngrok, conf

conf.get_default().auth_token = "2vuIkaBHuxB8IsBgWa1DfgFvSsO_5ninjhmiKtmfsn4xWADxL"

app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React frontend

# Configure Gemini API using the latest SDK
try:
    # Load API key from environment variable
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        # Fallback to hardcoded key for development
        GEMINI_API_KEY = "AIzaSyAVW5TowZmCfSDoY5nygIB9iPiG-plnWXQ"
    
    # Initialize the new Gemini client using latest SDK
    client = genai.Client(api_key=GEMINI_API_KEY)
    print("✅ Gemini API configured successfully with new SDK.")
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
        # Use the new Gemini API client - first try with JSON format
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json',
                    max_output_tokens=500,
                    temperature=0.3,
                )
            )
        except Exception as json_error:
            print(f"JSON format failed, trying without JSON constraint: {json_error}")
            # Fallback: Try without JSON format constraint
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    max_output_tokens=500,
                    temperature=0.3,
                )
            )
        
        # Check if response exists and has text
        if not response:
            raise ValueError("No response received from Gemini API")
        
        if not hasattr(response, 'text') or response.text is None:
            raise ValueError("Empty response from Gemini API")
        
        # Parse the JSON response
        response_text = response.text.strip()
        
        if not response_text:
            raise ValueError("Empty text response from Gemini API")
        
        print(f"Gemini API response: {response_text}")  # Debug logging
        
        # Try to extract JSON from the response text
        try:
            response_json = json.loads(response_text)
        except json.JSONDecodeError:
            # If direct JSON parsing fails, try to extract JSON from markdown
            import re
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', response_text, re.DOTALL)
            if json_match:
                response_json = json.loads(json_match.group(1))
            else:
                # Try to find any JSON-like structure
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    response_json = json.loads(json_match.group(0))
                else:
                    raise ValueError("No valid JSON found in response")

        if 'health_benefits' not in response_json or 'recommendation' not in response_json:
             raise ValueError("Response JSON missing required keys")

        return jsonify(response_json)

    except json.JSONDecodeError as e:
        print(f"Error decoding Gemini JSON response: {response_text if 'response_text' in locals() else 'No response text'}")
        print(f"JSON decode error: {str(e)}")
        # Return the raw text if JSON parsing fails, maybe it's still useful
        return jsonify({'error': 'Failed to parse Gemini response as JSON', 'raw_response': response_text if 'response_text' in locals() else 'No response'}), 500
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        print(f"Response object: {response if 'response' in locals() else 'No response object'}")
        return jsonify({'error': f'Error generating health info: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("🚀 Starting Flask backend for NutriVision AI...")
    print("📍 Flask API will be running at: http://localhost:5000")
    print("🌐 Frontend should be running at: http://localhost:3000")
    print("🔗 Make sure frontend API_BASE_URL points to: http://localhost:5000/")
    print("✅ CORS enabled for cross-origin requests")
    
    # Run the Flask app on port 5000
    app.run(host='0.0.0.0', port=5001, debug=True)

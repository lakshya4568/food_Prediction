import os
import os
import io
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json # Although not strictly needed for this change, good practice if handling complex JSON later

app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React frontend

# Configure Gemini API
# IMPORTANT: Set the GEMINI_API_KEY environment variable before running the app
# For development/testing, we can use the key provided, but env var is safer
# os.environ['GEMINI_API_KEY'] = 'YOUR_API_KEY_HERE' # Replace if needed
try:
    # Use the key provided by the user directly for now
    GEMINI_API_KEY = "AIzaSyA6zoYdzKltTpYd4BoMcwfAUmMT6u_JdKE" 
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro')
    print("Gemini API configured successfully.")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    gemini_model = None

# Load the pretrained ViT model
def load_model():
    # Load pre-trained ViT model
    # Use ViT-B/16 architecture
    model = models.vit_b_16(weights='IMAGENET1K_V1')
    
    # Modify the classifier to predict 3 classes (pizza, steak, sushi)
    model.heads = torch.nn.Linear(in_features=768, out_features=3)
    
    # Load saved model weights if they exist (replace with your saved model path)
    model_path = 'model.pth'
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
    if not gemini_model:
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
        response = gemini_model.generate_content(prompt)
        
        # Attempt to parse the response text as JSON
        # Gemini might sometimes add markdown backticks or other text
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        response_json = json.loads(response_text)

        if 'health_benefits' not in response_json or 'recommendation' not in response_json:
             raise ValueError("Response JSON missing required keys")

        return jsonify(response_json)

    except json.JSONDecodeError:
        print(f"Error decoding Gemini JSON response: {response.text}")
        # Return the raw text if JSON parsing fails, maybe it's still useful
        return jsonify({'error': 'Failed to parse Gemini response as JSON', 'raw_response': response.text}), 500
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({'error': f'Error generating health info: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    # It's better practice to get the API key from environment variables
    # api_key = os.getenv("GEMINI_API_KEY")
    # if not api_key:
    #     print("Warning: GEMINI_API_KEY environment variable not set.")
    # else:
    #     genai.configure(api_key=api_key)
    #     gemini_model = genai.GenerativeModel('gemini-pro')
    #     print("Gemini API configured successfully from environment variable.")

    app.run(host='0.0.0.0', port=5000, debug=True)

import os
import io
import sys
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import json
from dotenv import load_dotenv
load_dotenv()

# Load environment variables from .env file
# Get the project root directory (two levels up from this file)
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(project_root, '.env')
load_dotenv()

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import health profile models and routes (using absolute imports for direct execution)
try:
    from .models import HealthProfile, HealthProfileValidator, health_db, Gender, ActivityLevel, ChronicCondition, AllergyInfo
    from routes.health_routes import health_bp
    from routes.nutrition_routes import nutrition_bp
except ImportError:
    # If the modules don't exist, create placeholder blueprints
    from flask import Blueprint
    health_bp = Blueprint('health', __name__)
    nutrition_bp = Blueprint('nutrition', __name__)
    print("⚠️ Health and nutrition modules not found, running with basic functionality")

# Commenting out ngrok imports and configuration
# from pyngrok import ngrok, conf
# conf.get_default().auth_token = "2vuIkaBHuxB8IsBgWa1DfgFvSsO_5ninjhmiKtmfsn4xWADxL"


app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React frontend

# Register health profile blueprint
app.register_blueprint(health_bp)

# Register nutrition API blueprint
app.register_blueprint(nutrition_bp)

# Configure Gemini API using the new SDK
# The new Google GenAI SDK automatically picks up GOOGLE_API_KEY or GEMINI_API_KEY from environment
def initialize_genai_client():
    """
    Initialize the Google GenAI client with proper error handling.
    Supports both GOOGLE_API_KEY and GEMINI_API_KEY environment variables.
    """
    try:
        # Try GOOGLE_API_KEY first (new standard), then fallback to GEMINI_API_KEY
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        
        if api_key:
            # Clean the API key (remove quotes if they exist)
            api_key = api_key.strip().strip('"').strip("'")
            
            # Initialize the client with explicit API key
            client = genai.Client(api_key=api_key)
            
            # Test the client with a simple request
            try:
                models = client.models.list()
                print("✅ Gemini API client configured successfully with explicit API key.")
                return client
            except Exception as test_error:
                print(f"⚠️ API key found but client test failed: {test_error}")
                return None
        else:
            print("❌ No API key found in environment variables.")
            return None
                
    except Exception as e:
        print(f"❌ Error configuring Gemini API client: {e}")
        print("Please ensure GOOGLE_API_KEY or GEMINI_API_KEY environment variable is set.")
        print("Get your API key from: https://aistudio.google.com/app/apikey")
        return None

def get_available_models(client):
    """Get list of available Gemini models."""
    if not client:
        return []
    
    try:
        models = client.models.list()
        return [model.name for model in models if 'gemini' in model.name.lower()]
    except Exception as e:
        print(f"Error fetching models: {e}")
        return ['gemini-2.0-flash-001']  # fallback default

# Initialize the Gemini client
genai_client = initialize_genai_client()
available_models = get_available_models(genai_client)

# Load the pretrained ViT model
def load_model():
    # Load pre-trained ViT model
    # Use ViT-B/16 architecture
    model = models.vit_b_16(weights='IMAGENET1K_V1')
    
    # Modify the classifier to predict 3 classes (pizza, steak, sushi)
    model.heads = torch.nn.Linear(in_features=768, out_features=3)
    
    # Load saved model weights if they exist (replace with your saved model path)
    model_path = 'C:\\Users\\Lakshya Sharma\\Documents\\GitHub\\food_Prediction\\models\\pretrained.pth'
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
    if not genai_client:
        return jsonify({'error': 'Gemini API client not configured. Please set GOOGLE_API_KEY or GEMINI_API_KEY environment variable.'}), 500

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
        # Choose the best available model (prefer latest Gemini 2.0 versions)
        preferred_models = [
            'gemini-2.0-flash-001',
            'gemini-2.0-flash',
            'gemini-1.5-flash-001',
            'gemini-1.5-flash',
            'gemini-pro'
        ]
        
        selected_model = None
        for model in preferred_models:
            if model in available_models:
                selected_model = model
                break
        
        if not selected_model and available_models:
            selected_model = available_models[0]  # Use first available
        elif not selected_model:
            selected_model = 'gemini-2.0-flash-001'  # Default fallback
        
        # Use the new SDK with generate_content method
        response = genai_client.models.generate_content(
            model=selected_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json',
                temperature=0.3,
                max_output_tokens=1000,
                # Use thinking budget of 0 for faster responses (disable thinking)
                thinking_config=types.GenerationConfigThinkingConfig(
                    thinking_budget=0,
                    include_thoughts=False
                )
            )
        )
        
        # Extract the response text
        response_text = response.text.strip()
        
        # Parse the JSON response
        try:
            response_json = json.loads(response_text)
            
            # Validate required keys are present
            if 'health_benefits' not in response_json or 'recommendation' not in response_json:
                raise ValueError("Response JSON missing required keys")
                
            return jsonify(response_json)
            
        except json.JSONDecodeError as json_err:
            print(f"Error decoding Gemini JSON response: {response_text}")
            # Fallback: try to extract JSON from markdown-formatted response
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            try:
                response_json = json.loads(response_text.strip())
                return jsonify(response_json)
            except json.JSONDecodeError:
                return jsonify({
                    'error': 'Failed to parse Gemini response as JSON', 
                    'raw_response': response_text
                }), 500

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({'error': f'Error generating health info: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint with API status information."""
    status = {
        'status': 'ok',
        'gemini_api_configured': genai_client is not None,
        'available_models': available_models if genai_client else [],
        'model_count': len(available_models) if genai_client else 0
    }
    
    # Add warning if Gemini API is not configured
    if not genai_client:
        status['warning'] = 'Gemini API not configured. Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable.'
        status['setup_url'] = 'https://aistudio.google.com/app/apikey'
    
    return jsonify(status)

@app.route('/api/models', methods=['GET'])
def list_models():
    """List available Gemini models."""
    if not genai_client:
        return jsonify({'error': 'Gemini API not configured'}), 500
    
    try:
        models = genai_client.models.list()
        model_info = []
        
        for model in models:
            if hasattr(model, 'name') and 'gemini' in model.name.lower():
                info = {
                    'name': model.name,
                    'display_name': getattr(model, 'display_name', model.name),
                    'description': getattr(model, 'description', 'No description available')
                }
                model_info.append(info)
        
        return jsonify({
            'models': model_info,
            'count': len(model_info)
        })
        
    except Exception as e:
        print(f"Error fetching models: {e}")
        return jsonify({'error': f'Failed to fetch models: {str(e)}'}), 500

if __name__ == '__main__':
    # Commented out ngrok tunnel setup
    # import subprocess
    # import platform
    
    # if platform.system() == "Windows":
    #     subprocess.run(['taskkill', '/F', '/IM', 'ngrok.exe'], capture_output=True, shell=True)
    # else:
    #     subprocess.run(['pkill', 'ngrok'], capture_output=True, shell=True)
    
    # public_url = ngrok.connect(5000)
    # print(f"* Flask API is publicly accessible at: {public_url}")
    
    app.run(host='0.0.0.0', port=5002, debug=True)  # Run the Flask app on port 5002

import os
import io
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React frontend

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

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
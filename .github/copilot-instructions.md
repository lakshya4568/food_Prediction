# NutriVision AI Coding Agent Instructions

For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.

## Project Overview

NutriVision is a full-stack AI-powered food recognition app with a **Vision Transformer (ViT) PyTorch backend** and **modern React + Tailwind frontend**. The system identifies food from photos and provides personalized nutrition insights via Google Gemini API.

## Architecture & Key Components

### Backend (`app.py`)

- **Flask API** on port 5002 with CORS enabled for React frontend
- **ViT Model**: torchvision's `vit_b_16` fine-tuned for 3 food classes (pizza, steak, sushi)
- **Model Loading**: Loads `models/pretrained_vit_food_model.pth` with fallback to ImageNet weights
- **API Endpoints**:
  - `POST /predict` - Food classification from image upload
  - `POST /get_health_info` - Gemini AI nutrition analysis with user health profile
  - `GET /health` - Health check endpoint

### Frontend (React + Vite)

- **Hash-based SPA routing**: `#landing`, `#auth`, `#dashboard`, `#nutrivision`
- **Main App**: `src/App.jsx` handles theme management and page routing
- **Core Component**: `src/components/NutriVision.jsx` - handles image upload, prediction UI, health form
- **Landing**: `src/components/LandingPage.jsx` - marketing page composed of feature sections

## Development Workflows

### Running the Application

```bash
# Backend (Terminal 1)
cd /path/to/food_Prediction
python app.py  # Runs on localhost:5002

# Frontend (Terminal 2)
npm run dev    # Runs on localhost:5173
```

### Model Training Environment

- Use Jupyter notebook `08_pytorch_paper_replicating.ipynb` for ViT training experiments
- Training script: `ViT_food_prediction.py` (1000+ lines of comprehensive training pipeline)
- Model artifacts saved to `models/pretrained_vit_food_model.pth`

## Project-Specific Patterns

### Image Processing Pipeline

```python
# Standard transforms for ViT input (app.py lines 63-67)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])
```

### Gemini API Integration

- **Hardcoded API key** in `app.py` line 21 (should be moved to environment variable)
- **JSON response parsing** with markdown backtick stripping (lines 130-136)
- **Structured prompts** for health recommendations with user BMI and conditions

### React State Management

- **No external state library** - uses React hooks and local state
- **Health form state**: BMI auto-calculation when height/weight changes (`NutriVision.jsx` lines 56-68)
- **Image preview**: FileReader API for client-side image display before upload

### Tailwind Configuration

- **Custom color palette**: Primary blues, success greens with 50-900 scales (`tailwind.config.js`)
- **Custom animations**: `gradient`, `float`, `pulse-slow` with keyframe definitions
- **Poppins font** as primary sans-serif family

## Critical Integration Points

### Frontend-Backend Communication

- **CORS enabled** for localhost:5173 → localhost:5002 requests
- **FormData uploads** for image files to `/predict` endpoint
- **JSON payloads** for health analysis with user profile data

### Model Inference Flow

1. Image uploaded via `<input type="file">` in `NutriVision.jsx`
2. Flask processes via PIL → tensor transforms → ViT forward pass
3. Softmax probabilities returned with confidence scores for all 3 classes
4. Frontend displays top prediction and triggers health analysis form

### Vite Configuration

- **Custom server config** allows ngrok tunneling (`vite.config.js` line 6)
- **React plugin** with HMR for development

## Code Conventions

### Component Structure

- **Functional components** with hooks (no class components)
- **Named exports** for components, default export for main modules
- **Icon imports** from `react-icons/fa` (Font Awesome)

### API Error Handling

- **Structured error responses** with HTTP status codes in Flask
- **Graceful degradation** when Gemini API unavailable (returns error vs crashing)
- **JSON parsing fallback** for Gemini responses that aren't valid JSON

### File Organization

- **Components**: Individual feature-based files in `src/components/`
- **No services layer**: API calls embedded directly in components
- **Model artifacts**: Separate `models/` directory for PyTorch checkpoints

## Key Dependencies & Versions

- **Backend**: PyTorch 2.0+, torchvision 0.13+, Flask 2.0+, google-generativeai
- **Frontend**: React 19.0+, Vite 6.2+, Tailwind CSS 3.4+, react-icons 5.5+
- **Development**: ESLint 9.21+, PostCSS 8.5+

## Important Notes

- **Limited food classes**: Only pizza, steak, sushi currently supported
- **No user authentication**: Auth components exist but aren't fully implemented
- **API key security**: Gemini key should be moved to environment variables
- **Model path**: Hardcoded relative path to `models/pretrained_vit_food_model.pth`

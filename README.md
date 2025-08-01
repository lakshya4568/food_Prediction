# NutriVision: AI-Powered Food Recognition & Nutrition Analysis

<div align="center">
  <img src="https://img.shields.io/badge/Python-3.9+-blue.svg" alt="Python Version">
  <img src="https://img.shields.io/badge/PyTorch-2.0+-orange.svg" alt="PyTorch Version">
  <img src="https://img.shields.io/badge/Flask-2.0+-green.svg" alt="Flask Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
</div>

<div align="center">
  <p><i>Transform your nutrition journey with computer vision and AI</i></p>
</div>

---

## 📋 Table of Contents

- Overview
- Features
- Project Architecture
- Machine Learning Models
- API Endpoints
- Tech Stack
- Installation & Setup
- Usage
- Frontend Integration
- Development Roadmap
- License

---

## 🔍 Overview

NutriVision is an AI-powered application that uses computer vision and machine learning to identify food from photos and provide detailed nutritional information. The system combines a Vision Transformer (ViT) model for food classification with Google's Gemini API for personalized health recommendations based on user profiles.

This application aims to simplify nutrition tracking and promote healthier eating habits by making nutritional information instantly accessible through a simple photo.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **AI Food Recognition** | Uses a Vision Transformer model to identify food items from photos with high accuracy |
| **Nutritional Analysis** | Provides detailed breakdown of nutritional content for identified foods |
| **Personalized Health Insights** | Offers customized recommendations based on user health profiles |
| **Cross-Platform Access** | Accessible via web interface or mobile devices |
| **Real-time Processing** | Delivers instant analysis of food images |
| **Health Profile Integration** | Takes into account user height, weight, BMI, and pre-existing conditions |
| **REST API Architecture** | Easy integration with various frontend frameworks |

---

## 🏗 Project Architecture

The NutriVision project is structured as follows:

```
food_Prediction/
├── app.py                    # Main Flask application
├── ViT_food_prediction.py    # Vision Transformer model implementation
├── models/
│   └── pretrained.pth        # Pre-trained food classification model
├── NutriVision/              # Frontend components
│   └── nutri-vision-mainpage/
│       ├── index.html        # Landing page
│       ├── login.html        # User authentication
│       ├── dashboard.html    # User dashboard
│       ├── css/              # Styling
│       ├── js/               # Client-side scripts
│       └── src/              # React components (if using React)
└── README.md                 # Project documentation
```

---

## 🤖 Machine Learning Models

NutriVision utilizes two primary AI components:

### 1. Vision Transformer (ViT) Food Classification Model

- **Architecture**: ViT-B/16 (Vision Transformer Base with 16×16 patch size)
- **Pre-training**: Initially trained on ImageNet, fine-tuned for food classification
- **Classes**: Currently supports pizza, steak, and sushi classification
- **Performance**: High accuracy in food identification from various angles and lighting conditions
- **Implementation**: PyTorch-based with torchvision integration

### 2. Google Gemini AI for Nutritional Analysis

- **Model**: Gemini 2.0 Flash
- **Purpose**: Analyzes identified foods and provides health recommendations
- **Personalization**: Takes into account user's health metrics (height, weight, BMI)
- **Output**: Structured JSON with health benefits and personalized recommendations

---

## 🔌 API Endpoints

| Endpoint | Method | Description | Parameters | Response |
|----------|--------|-------------|------------|----------|
| `/predict` | POST | Identifies food from an image | `image`: file | JSON with food class and confidence scores |
| `/get_health_info` | POST | Provides nutritional analysis | `food_name`, `height`, `weight`, `bmi`, `conditions` | JSON with health benefits and recommendations |
| `/health` | GET | API health check | None | Status indicator |

---

## 🛠 Tech Stack

### Backend

- **Python**: Core programming language
- **Flask**: Web framework
- **PyTorch**: Deep learning framework
- **torchvision**: Computer vision utilities
- **ngrok**: Tunnel for exposing local server
- **Google Generative AI**: Nutritional analysis

### Frontend

- **HTML/CSS/JavaScript**: UI components
- **React** (optional): For advanced UI interactions

---

## 📥 Installation & Setup

### Prerequisites

- Python 3.9+
- PyTorch 2.0+
- A Google Gemini API key

### Step-by-Step Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/food_Prediction.git
   cd food_Prediction
   ```

2. **Create and activate a virtual environment**

   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Gemini API**
   - Set your Gemini API key in app.py

   ```python
   GEMINI_API_KEY = "your-api-key-here"
   ```

5. **Run the application**

   ```bash
   python app.py
   ```

6. **Access the application**
   - The app will be available at: `http://localhost:5000`
   - An ngrok public URL will be displayed in the console

---

## 🚀 Usage

### Food Recognition

1. Take or upload a photo of food
2. The system identifies the food item
3. View confidence scores for the prediction

### Nutritional Analysis

1. After food recognition, submit your health profile
2. Receive personalized nutritional information
3. Get recommendations based on your health metrics

### API Integration

```python
# Example: Food Recognition API Call
import requests

url = "http://localhost:5000/predict"
files = {"image": open("food.jpg", "rb")}
response = requests.post(url, files=files)
prediction = response.json()
```

---

## 🔗 Frontend Integration

The NutriVision backend API can be integrated with various frontend frameworks. A sample HTML/CSS/JS implementation is provided in the nutri-vision-mainpage directory.

For a complete user experience, the frontend should:

1. Provide image upload/capture functionality
2. Collect user health metrics
3. Display food recognition results
4. Present nutritional information and recommendations

---

## 🔮 Development Roadmap

- [ ] **Expand food classification**: Increase the number of recognizable food items
- [ ] **Portion size estimation**: Add capability to estimate serving sizes
- [ ] **Meal composition analysis**: Identify multiple foods in a single image
- [ ] **User accounts**: Add user authentication and history tracking
- [ ] **Mobile application**: Develop dedicated iOS and Android apps
- [ ] **Offline capability**: Enable functionality without internet connection
- [ ] **Multi-language support**: Add internationalization

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>Developed by Team CyberKnights</p>
</div>

I've created a comprehensive README.md for your NutriVision project. This README includes:

1. A beautiful header with badges
2. Detailed table of contents
3. Overview of your project
4. Features displayed in an organized table
5. Project architecture with a clear file structure
6. Information about the AI models used
7. API endpoints in a table format
8. Tech stack breakdown
9. Step-by-step installation instructions
10. Usage examples including code snippets
11. Frontend integration guidance
12. A development roadmap with checkboxes
13. License information

You can copy this content and create a README.md file in the root of your food_Prediction directory. This will provide comprehensive documentation for anyone using or contributing to your project.

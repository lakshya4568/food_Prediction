# NutriVision: AI-Powered Food Recognition & Nutrition Analysis

<div align="center">
  
  ![Python Version](https://img.shields.io/badge/Python-3.9+-blue.svg)
  ![React Version](https://img.shields.io/badge/React-19.0+-blue.svg)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1+-38B2AC?logo=tailwind-css)
  ![PyTorch Version](https://img.shields.io/badge/PyTorch-2.0+-orange.svg)
  ![Flask Version](https://img.shields.io/badge/Flask-2.0+-green.svg)
  ![License](https://img.shields.io/badge/License-MIT-yellow.svg)

</div>

<div align="center">
  <p><i>Transform your nutrition journey with computer vision and AI</i></p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Machine Learning Models](#machine-learning-models)
- [API Endpoints](#api-endpoints)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Frontend Integration](#frontend-integration)
- [Development Roadmap](#development-roadmap)
- [License](#license)

---

## 🔍 Overview

NutriVision is a modern AI-powered web application that uses computer vision and machine learning to identify food from photos and provide detailed nutritional information. The system combines a Vision Transformer (ViT) model for food classification with Google's Gemini API for personalized health recommendations based on user profiles.

This application features a beautiful, responsive React frontend built with Tailwind CSS, offering an intuitive user experience for nutrition tracking and health insights.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🤖 AI Food Recognition** | Uses a Vision Transformer model to identify food items from photos with high accuracy |
| **📊 Nutritional Analysis** | Provides detailed breakdown of nutritional content for identified foods |
| **👤 Personalized Health Insights** | Offers customized recommendations based on user health profiles |
| **📱 Responsive Design** | Modern, mobile-first UI built with React and Tailwind CSS |
| **⚡ Real-time Processing** | Delivers instant analysis of food images |
| **🎯 Health Profile Integration** | BMI calculation and health condition considerations |
| **🔗 REST API Architecture** | Easy integration with various frontend frameworks |
| **🎨 Modern UI/UX** | Beautiful gradients, animations, and interactive components |

---

## 🏗 Project Architecture

The NutriVision project is structured as a modern full-stack application:

```
food_Prediction/
├── app.py                          # Flask backend API
├── ViT_food_prediction.py          # Vision Transformer model
├── models/
│   └── pretrained_vit_food_model.pth  # Pre-trained model weights
├── src/                            # React frontend
│   ├── components/                 # React components
│   │   ├── NutriVision.jsx        # Main prediction interface
│   │   ├── Header.jsx             # Navigation header
│   │   ├── LandingPage.jsx        # Landing page
│   │   ├── AuthPage.jsx           # Authentication
│   │   ├── Dashboard.jsx          # User dashboard
│   │   └── ...                    # Other components
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Tailwind CSS styles
├── tailwind.config.js             # Tailwind configuration
├── package.json                   # Frontend dependencies
├── vite.config.js                 # Vite build configuration
└── README.md                      # Project documentation
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

- **React**: Modern UI library with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Fast build tool and development server
- **React Icons**: Beautiful icon library
- **JavaScript (ES6+)**: Modern JavaScript features

### Development Tools

- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: CSS vendor prefixing

---

## 📥 Installation & Setup

### Prerequisites

- **Node.js**: 18.0+ (for frontend development)
- **Python**: 3.9+
- **PyTorch**: 2.0+
- **A Google Gemini API key**

### Step-by-Step Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/food_Prediction.git
   cd food_Prediction
   ```

2. **Frontend Setup**

   ```bash
   # Install frontend dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   # Create and activate a virtual environment
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   
   # Install Python dependencies
   pip install -r requirements.txt
   ```

4. **Configure Gemini API**
   - Set your Gemini API key in app.py

   ```python
   GEMINI_API_KEY = "your-api-key-here"
   ```

5. **Run the applications**

   ```bash
   # Terminal 1: Start backend
   python app.py
   
   # Terminal 2: Start frontend (if not already running)
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173` (Vite dev server)
   - Backend API: `http://localhost:5000`
   - An ngrok public URL will be displayed in the console for external access

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

The NutriVision frontend is built with modern React and Tailwind CSS, providing:

### Key Components

- **NutriVision.jsx**: Main prediction interface with image upload, AI analysis, and health profiling
- **LandingPage.jsx**: Beautiful landing page with features, benefits, and testimonials
- **Header.jsx**: Responsive navigation with mobile menu support
- **AuthPage.jsx**: User authentication interface
- **Dashboard.jsx**: User dashboard for tracking nutrition history

### Features

1. **Responsive Design**: Mobile-first approach with Tailwind CSS
2. **Modern UI/UX**: Gradient backgrounds, smooth animations, and interactive components
3. **Real-time Updates**: Live feedback during image processing and health analysis
4. **Accessibility**: Proper ARIA labels and keyboard navigation support
5. **Performance**: Optimized with Vite for fast development and production builds

### Routing

The application uses hash-based routing for single-page navigation:

- `#` or `#landing`: Landing page
- `#auth`: Authentication page
- `#dashboard`: User dashboard
- `#nutrivision`: Main prediction interface

### Customization

The Tailwind configuration includes custom colors, animations, and utilities:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { /* Custom color palette */ },
      success: { /* Success states */ },
      // ...
    },
    animation: {
      'gradient': 'gradient 6s ease infinite',
      'float': 'float 3s ease-in-out infinite',
    }
  }
}
```

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

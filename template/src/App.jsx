import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only accept images
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG)');
      return;
    }

    setSelectedImage(file);
    setError(null);
    setPrediction(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create form data
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // TODO: Replace with your actual backend API endpoint
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get prediction. Please try again.');
      // For development - show a mock result when backend is not available
      setPrediction({
        class: 'pizza',
        confidence: 0.95,
        top_classes: [
          { class: 'pizza', confidence: 0.95 },
          { class: 'steak', confidence: 0.03 },
          { class: 'sushi', confidence: 0.02 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>FoodVision Mini</h1>
        <p className="subtitle">Classify food images using Vision Transformer (ViT)</p>
      </header>

      <div className="main-content">
        <section className="upload-section">
          <div className="upload-container">
            <h2>Upload Image</h2>
            <p>Select an image of pizza, steak, or sushi</p>
            
            <div className="file-input-container">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                ref={fileInputRef}
                className="file-input"
              />
              <button className="custom-file-button">
                Choose Image
              </button>
              <span className="file-name">
                {selectedImage ? selectedImage.name : 'No file chosen'}
              </span>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            <div className="button-group">
              <button 
                className="predict-button" 
                onClick={handleSubmit} 
                disabled={!selectedImage || isLoading}
              >
                {isLoading ? 'Predicting...' : 'Predict Food'}
              </button>
              
              <button 
                className="reset-button" 
                onClick={resetForm}
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        <section className="preview-section">
          {imagePreview ? (
            <div className="image-preview-container">
              <h2>Image Preview</h2>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="image-preview" 
              />
            </div>
          ) : (
            <div className="placeholder">
              <h2>Image Preview</h2>
              <div className="placeholder-content">
                <p>Your image will appear here</p>
              </div>
            </div>
          )}
        </section>

        <section className="results-section">
          {prediction ? (
            <div className="results-container">
              <h2>Prediction Results</h2>
              <div className="prediction-result">
                <div className="main-prediction">
                  <span className="prediction-label">Predicted Food:</span>
                  <span className="prediction-class">{prediction.class}</span>
                </div>
                
                <div className="confidence-bar-container">
                  <h3>Confidence Scores</h3>
                  {prediction.top_classes && prediction.top_classes.map((item, index) => (
                    <div key={index} className="confidence-item">
                      <div className="confidence-label">{item.class}</div>
                      <div className="confidence-bar-wrapper">
                        <div 
                          className="confidence-bar"
                          style={{ width: `${item.confidence * 100}%` }}
                        ></div>
                        <span className="confidence-value">{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="placeholder">
              <h2>Prediction Results</h2>
              <div className="placeholder-content">
                <p>{isLoading ? 'Analyzing image...' : 'Prediction results will appear here'}</p>
                {isLoading && <div className="loading-spinner"></div>}
              </div>
            </div>
          )}
        </section>
      </div>

      <footer>
        <p>Powered by Vision Transformer (ViT) | Created with PyTorch</p>
      </footer>
    </div>
  )
}

export default App

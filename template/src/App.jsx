import { useState, useRef, useEffect } from 'react'; // Added useEffect
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons
import './App.css';

function App() {
  // Theme state ('light' or 'dark')
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }); 

  // Apply theme to document body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Existing state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading for prediction
  const [error, setError] = useState(null); // Error for prediction
  const fileInputRef = useRef(null);

  // New state for health info
  const [height, setHeight] = useState(''); // in cm
  const [weight, setWeight] = useState(''); // in kg
  const [bmi, setBmi] = useState(null);
  const [conditions, setConditions] = useState('');
  const [healthInfo, setHealthInfo] = useState(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false); // Loading for health info
  const [healthError, setHealthError] = useState(null); // Error for health info

  // Calculate BMI automatically
  useEffect(() => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBmi);
    } else {
      setBmi(null); // Reset if height or weight is invalid
    }
  }, [height, weight]);

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
      // Clear previous health info on new prediction error
      setHealthInfo(null); 
      setHealthError(null);
      // // For development - show a mock result when backend is not available
      // setPrediction({
      //   class: 'pizza',
      //   confidence: 0.95,
      //   top_classes: [
      //     { class: 'pizza', confidence: 0.95 },
      //     { class: 'steak', confidence: 0.03 },
      //     { class: 'sushi', confidence: 0.02 }
      //   ]
      // });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch health info after prediction and if health details are available
  const fetchHealthInfo = async () => {
    if (!prediction || !prediction.class || !height || !weight || !bmi) {
      setHealthError("Please enter your height and weight to get health recommendations.");
      return;
    }

    setIsHealthLoading(true);
    setHealthError(null);
    setHealthInfo(null); // Clear previous results

    try {
      const response = await fetch('http://localhost:5000/get_health_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          food_name: prediction.class,
          height: height,
          weight: weight,
          bmi: bmi,
          conditions: conditions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setHealthInfo(data);

    } catch (err) {
      console.error('Error fetching health info:', err);
      setHealthError(`Failed to get health info: ${err.message}`);
    } finally {
      setIsHealthLoading(false);
    }
  };

  // Trigger health info fetch when prediction is ready and health inputs are valid
  useEffect(() => {
    if (prediction && prediction.class && height && weight && bmi) {
      fetchHealthInfo();
    }
     // Clear health info if prediction is reset
    if (!prediction) {
        setHealthInfo(null);
        setHealthError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prediction, height, weight, bmi]); // Re-fetch if prediction or core health details change

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const resetForm = () => {
    // Reset existing state
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    // Reset new health state
    setHeight('');
    setWeight('');
    setBmi(null);
    setConditions('');
    setHealthInfo(null);
    setHealthError(null);
    setIsHealthLoading(false);
    setIsLoading(false); // Also reset prediction loading
  };

  return (
    // Add theme class to the main container
    <div className={`app-container ${theme === 'dark' ? 'dark-theme' : ''}`}> 
      <header>
        <h1>FoodVision Mini</h1>
        <p className="subtitle">Classify food images using Vision Transformer (ViT)</p>
        {/* Add Theme Toggle Button */}
        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === 'light' ? <FaMoon /> : <FaSun />} 
        </button>
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

        {/* New User Health Input Section */}
        <section className="health-input-section">
          <div className="health-input-container">
            <h2>Your Health Profile</h2>
            <p>Enter your details for personalized recommendations.</p>
            <div className="input-group">
              <label htmlFor="height">Height (cm):</label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g., 175"
                disabled={isLoading || isHealthLoading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="weight">Weight (kg):</label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 70"
                disabled={isLoading || isHealthLoading}
              />
            </div>
            <div className="input-group">
              <label>Calculated BMI:</label>
              <span className="bmi-display">{bmi ? bmi : 'Enter height & weight'}</span>
            </div>
            <div className="input-group">
              <label htmlFor="conditions">Pre-existing Conditions (optional):</label>
              <textarea
                id="conditions"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="e.g., Diabetes, High Blood Pressure"
                rows="3"
                disabled={isLoading || isHealthLoading}
              />
            </div>
             {/* Display health-related errors here */}
             {healthError && !isHealthLoading && <div className="error-message">{healthError}</div>}
          </div>
        </section>

        {/* Prediction Results Section (Modified) */}
        <section className="results-section">
          {prediction ? (
            <div className="results-container">
              <h2>Prediction Results</h2>
              <div className="prediction-result"> {/* Keep existing prediction display */}
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
              {/* Extra div removed */}
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

        {/* New Health Info Display Section */}
        <section className="health-info-section">
           {isHealthLoading ? (
             <div className="placeholder">
               <h2>Health Information</h2>
               <div className="placeholder-content">
                 <p>Fetching health recommendations...</p>
                 <div className="loading-spinner"></div>
               </div>
             </div>
           ) : healthInfo ? (
            <div className="health-info-container">
              <h2>Health Information for {prediction?.class}</h2>
              <div className="health-content">
                <h3>Health Benefits:</h3>
                <p>{healthInfo.health_benefits}</p>
                <h3>Recommendation:</h3>
                <p>{healthInfo.recommendation}</p>
              </div>
            </div>
          ) : prediction && height && weight && !healthError ? (
             // Show placeholder only if prediction exists and health details entered, but no info yet (and not loading/error)
             <div className="placeholder">
               <h2>Health Information</h2>
               <div className="placeholder-content">
                 <p>Health recommendations will appear here once calculated.</p>
               </div>
             </div>
           ) : null /* Don't show this section if no prediction or health details */
           }
           {/* Display health errors specifically in this section if not loading */}
           {healthError && !isHealthLoading && (
              <div className="placeholder">
                 <h2>Health Information</h2>
                 <div className="placeholder-content error-message">
                   <p>Error: {healthError}</p>
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

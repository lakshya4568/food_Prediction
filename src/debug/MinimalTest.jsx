import React, { useEffect, useState } from "react";
import runHealthCheck from "./healthCheck";

// Minimal test component to debug white screen issue
const MinimalTest = () => {
  const [healthStatus, setHealthStatus] = useState('Checking...');
  
  console.log("=== MINIMAL TEST COMPONENT RENDERING ===");
  
  useEffect(() => {
    console.log("Running health check...");
    runHealthCheck().then(result => {
      setHealthStatus(JSON.stringify(result, null, 2));
    }).catch(error => {
      setHealthStatus(`Error: ${error.message}`);
    });
  }, []);
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'red',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      overflow: 'auto'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '90%', padding: '20px' }}>
        <h1>🔧 DEBUG MODE ACTIVE</h1>
        <p>✅ React is working!</p>
        <p>✅ Component rendering successful!</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '5px',
          textAlign: 'left',
          fontSize: '14px'
        }}>
          <h3>Health Check Results:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {healthStatus}
          </pre>
        </div>
        
        <button 
          onClick={() => {
            alert('Button clicked! React events working!');
            console.log("Button click event fired");
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: 'white',
            color: 'red',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Test Button
        </button>
        
        <div style={{ marginTop: '20px' }}>
          <a 
            href="/auth" 
            style={{ 
              color: 'yellow', 
              textDecoration: 'underline',
              fontSize: '16px'
            }}
          >
            Try Auth Page (Original Route)
          </a>
        </div>
      </div>
    </div>
  );
};

export default MinimalTest;

// Backend Health Check Script
console.log("=== BACKEND HEALTH CHECK ===");

// Check if backend is running
const checkBackend = async () => {
  const backendUrls = [
    'http://localhost:5000',
    'http://localhost:8000', 
    'http://localhost:3000',
    'http://127.0.0.1:5000'
  ];

  console.log("Checking backend connectivity...");
  
  for (const url of backendUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url, { 
        method: 'GET',
        timeout: 5000 
      });
      console.log(`✅ ${url} - Status: ${response.status}`);
      return { success: true, url, status: response.status };
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`);
    }
  }
  
  console.log("❌ No backend found on common ports");
  return { success: false };
};

// Check localStorage
const checkLocalStorage = () => {
  console.log("=== LOCALSTORAGE CHECK ===");
  try {
    const testKey = 'test-key';
    localStorage.setItem(testKey, 'test-value');
    const value = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (value !== 'test-value') {
      throw new Error('localStorage test failed');
    }
    
    console.log("✅ localStorage is working");
    
    // Check auth-related items
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    console.log("Auth token:", authToken ? '✅ Present' : '❌ Not found');
    console.log("User data:", userData ? '✅ Present' : '❌ Not found');
    
    return true;
  } catch (error) {
    console.error("❌ localStorage error:", error);
    return false;
  }
};

// Check network connectivity
const checkNetwork = () => {
  console.log("=== NETWORK CHECK ===");
  console.log("Online status:", navigator.onLine ? '✅ Online' : '❌ Offline');
  console.log("User agent:", navigator.userAgent);
};

// Run all checks
const runHealthCheck = async () => {
  console.log("🔍 Starting comprehensive health check...");
  
  checkNetwork();
  checkLocalStorage();
  const backendResult = await checkBackend();
  
  console.log("=== HEALTH CHECK COMPLETE ===");
  return {
    network: navigator.onLine,
    localStorage: checkLocalStorage(),
    backend: backendResult
  };
};

// Auto-run if this script is imported
if (typeof window !== 'undefined') {
  window.runHealthCheck = runHealthCheck;
  runHealthCheck();
}

export default runHealthCheck;

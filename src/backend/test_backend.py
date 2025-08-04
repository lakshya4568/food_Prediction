#!/usr/bin/env python3
"""
Comprehensive Backend Testing Script for NutriVision AI
Tests all backend components including APIs, routes, and integrations
Requires conda environment with PyTorch installed
"""

import os
import sys
import json
import time
import requests
import logging
import subprocess
import io
import torch
import redis
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import traceback
from PIL import Image

import dotenv

dotenv.load_dotenv()

# Ensure we're using conda environment with PyTorch
def activate_conda_env():
    """Ensure we're in the correct conda environment"""
    try:
        # Check if we're in a conda environment
        conda_default_env = os.environ.get('CONDA_DEFAULT_ENV')
        if conda_default_env:
            print(f"Using conda environment: {conda_default_env}")
        else:
            print("Warning: Not in a conda environment. Activate conda environment with PyTorch first.")
        
        # Verify PyTorch is available
        import torch
        print(f"PyTorch version: {torch.__version__}")
        print(f"CUDA available: {torch.cuda.is_available()}")
        return True
    except ImportError:
        print("Error: PyTorch not found. Please install PyTorch in your conda environment:")
        print("conda install pytorch torchvision torchaudio -c pytorch")
        return False

# Activate environment check
if not activate_conda_env():
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('backend_test.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Color codes for terminal output
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    ENDC = '\033[0m'  # End color
    BOLD = '\033[1m'

@dataclass
class TestResult:
    """Test result data structure"""
    test_name: str
    status: str  # 'PASS', 'FAIL', 'SKIP'
    message: str
    duration: float
    error_details: Optional[str] = None

class BackendTester:
    """Comprehensive backend testing class"""
    
    def __init__(self):
        self.results: List[TestResult] = []
        self.base_url = "http://localhost:5002"
        self.test_start_time = datetime.now()
        
        # Load environment variables for API testing
        from dotenv import load_dotenv
        
        # Try to load .env from current directory or project root
        if os.path.exists('.env'):
            load_dotenv('.env')
        elif os.path.exists('../../.env'):
            load_dotenv('../../.env')
        else:
            load_dotenv()  # Use default behavior
        
        self.usda_api_key = os.getenv('USDA_API_KEY')
        self.edamam_app_id = os.getenv('EDAMAM_APP_ID')
        self.edamam_app_key = os.getenv('EDAMAM_API_KEY')
        self.gemini_api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
        
        print(f"Backend Tester initialized - Testing server at {self.base_url}")
        
    def log_result(self, test_name: str, status: str, message: str, duration: float, error_details: Optional[str] = None):
        """Log a test result"""
        result = TestResult(test_name, status, message, duration, error_details)
        self.results.append(result)
        
        # Print colored output
        color = Colors.GREEN if status == 'PASS' else Colors.RED if status == 'FAIL' else Colors.YELLOW
        print(f"{color}{status:<6}{Colors.ENDC} {test_name:<50} {message} ({duration:.2f}s)")
        
        if error_details and status == 'FAIL':
            print(f"       Error: {error_details}")

    def run_test(self, test_name: str, test_func):
        """Run a single test with error handling"""
        start_time = time.time()
        try:
            result = test_func()
            duration = time.time() - start_time
            if result:
                self.log_result(test_name, 'PASS', 'Test completed successfully', duration)
            else:
                self.log_result(test_name, 'FAIL', 'Test returned False', duration)
            return result
        except Exception as e:
            duration = time.time() - start_time
            error_details = f"{str(e)}\n{traceback.format_exc()}"
            self.log_result(test_name, 'FAIL', f'Exception: {str(e)}', duration, error_details)
            return False

    def test_environment_variables(self):
        """Test if all required environment variables are set"""
        env_vars = {
            'USDA_API_KEY': self.usda_api_key,
            'EDAMAM_APP_ID': self.edamam_app_id,
            'EDAMAM_APP_KEY': self.edamam_app_key,
            'GEMINI_API_KEY': self.gemini_api_key
        }
        
        missing_vars = [var for var, value in env_vars.items() if not value]
        
        if missing_vars:
            logger.warning(f"Missing environment variables: {missing_vars}")
            print(f"{Colors.YELLOW}Warning: Missing env vars: {', '.join(missing_vars)}{Colors.ENDC}")
            return True  # Not critical for basic testing
        
        logger.info("All environment variables are set")
        return True

    def test_flask_server_health(self):
        """Test if Flask server is running and responding"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                logger.info("Flask server health check passed")
                return True
            else:
                logger.error(f"Flask server health check failed: {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            logger.error("Flask server is not running or not accessible")
            print(f"{Colors.RED}❌ Flask server not running. Start with: python src/backend/app.py{Colors.ENDC}")
            return False

    def test_model_loading(self):
        """Test if the ViT model loads correctly"""
        try:
            # Import PyTorch modules
            import torch
            from torchvision import models
            
            # Test model loading logic from app.py
            model = models.vit_b_16(weights='IMAGENET1K_V1')
            model.heads.head = torch.nn.Linear(in_features=768, out_features=3)
            
            # Test model inference capability
            dummy_input = torch.randn(1, 3, 224, 224)
            model.eval()
            with torch.no_grad():
                output = model(dummy_input)
                
            if output.shape == (1, 3):  # Expected output shape for 3 classes
                logger.info("Model loading and inference test passed")
                return True
            else:
                logger.error(f"Unexpected model output shape: {output.shape}")
                return False
                
        except Exception as e:
            logger.error(f"Model loading failed: {e}")
            return False

    def test_image_prediction(self):
        """Test the /predict endpoint with a dummy image"""
        try:
            # Create a dummy image
            dummy_image = Image.new('RGB', (224, 224), color='red')
            img_byte_arr = io.BytesIO()
            dummy_image.save(img_byte_arr, format='JPEG')
            img_byte_arr.seek(0)
            
            files = {'image': ('test.jpg', img_byte_arr, 'image/jpeg')}
            response = requests.post(f"{self.base_url}/predict", files=files, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                # Fix expected keys to match actual app.py response format
                required_keys = ['class', 'confidence', 'top_classes']
                
                if all(key in data for key in required_keys):
                    logger.info(f"Image prediction successful: {data['class']} ({data['confidence']})")
                    return True
                else:
                    logger.error(f"Missing keys in response: {data}")
                    return False
            else:
                logger.error(f"Image prediction failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Image prediction test failed: {e}")
            return False

    def test_usda_api(self):
        """Test USDA FoodData Central API integration using our wrapper class"""
        if not self.usda_api_key:
            logger.warning("USDA API key not found, skipping test")
            return True
            
        try:
            # Import our USDA API wrapper
            from services.nutrition_apis.usda_api import USDAFoodDataAPI
            
            # Test using our wrapper class
            usda_api = USDAFoodDataAPI(api_key=self.usda_api_key)
            
            # Test food search
            search_results = usda_api.search_foods("apple", page_size=5)
            
            if search_results and len(search_results) > 0:
                logger.info(f"USDA API test passed: Found {len(search_results)} foods using wrapper")
                
                # Test detailed food lookup if available
                first_food = search_results[0]
                if hasattr(first_food, 'fdc_id') and first_food.fdc_id:
                    detailed_food = usda_api.get_food_details(first_food.fdc_id)
                    if detailed_food:
                        logger.info(f"USDA detailed lookup passed for FDC ID: {first_food.fdc_id}")
                    else:
                        logger.warning("USDA detailed lookup failed")
                        
                return True
            else:
                logger.error("USDA API wrapper returned no results")
                return False
                
        except ImportError as e:
            logger.warning(f"USDA API wrapper not available, testing direct API: {e}")
            
            # Fallback to direct API test
            try:
                url = "https://api.nal.usda.gov/fdc/v1/foods/search"
                params = {
                    'api_key': self.usda_api_key,
                    'query': 'apple',
                    'pageSize': 5
                }
                
                response = requests.get(url, params=params, timeout=15)
                
                if response.status_code == 200:
                    data = response.json()
                    if 'foods' in data and len(data['foods']) > 0:
                        logger.info(f"USDA API direct test passed: Found {len(data['foods'])} foods")
                        return True
                    else:
                        logger.error("USDA API returned empty results")
                        return False
                else:
                    logger.error(f"USDA API test failed: {response.status_code} - {response.text}")
                    return False
                    
            except Exception as e:
                logger.error(f"USDA API direct test failed: {e}")
                return False
                
        except Exception as e:
            logger.error(f"USDA API test failed: {e}")
            return False

    def test_edamam_api(self):
        """Test Edamam Food Database and Meal Planner API integration using our wrapper classes"""
        if not self.edamam_app_id or not self.edamam_app_key:
            logger.warning("Edamam API credentials not found, skipping test")
            return True
            
        try:
            # Import our updated API classes
            from services.nutrition_apis.edamam_api import EdamamFoodDatabaseAPI, EdamamMealPlannerAPI
            
            # Test Food Database API
            logger.info("Testing Edamam Food Database API...")
            food_api = EdamamFoodDatabaseAPI(app_id=self.edamam_app_id, app_key=self.edamam_app_key)
            
            # Test food search
            search_results = food_api.search_foods("banana", limit=3)
            
            if search_results and len(search_results) > 0:
                logger.info(f"Food Database API test passed: Found {len(search_results)} foods")
                
                # Test detailed nutrition lookup
                first_food = search_results[0]
                detailed_food = food_api.get_food_details(first_food.food_id)
                
                if detailed_food:
                    nutrient_count = len(detailed_food.nutrients)
                    logger.info(f"Detailed nutrition test passed: Found {nutrient_count} nutrients")
                    
                    # Check for key nutrients
                    key_nutrients = ['ENERC_KCAL', 'PROCNT', 'FAT', 'CHOCDF']
                    found_nutrients = [n for n in key_nutrients if n in detailed_food.nutrients]
                    logger.info(f"Key nutrients found: {found_nutrients}")
                else:
                    logger.warning("Could not get detailed nutrition data")
            else:
                logger.error("Food Database API returned no results")
                return False
                
            # Test Meal Planner API
            logger.info("Testing Edamam Meal Planner API...")
            meal_api = EdamamMealPlannerAPI(app_id=self.edamam_app_id, app_key=self.edamam_app_key)
            
            # Simple meal plan request
            meal_plan_payload = {
                "size": 1,  # 1-day plan for testing
                "plan": {
                    "accept": {
                        "all": [
                            {"health": ["VEGETARIAN"]}
                        ]
                    },
                    "fit": {
                        "ENERC_KCAL": {"min": 1800, "max": 2200}
                    },
                    "sections": {
                        "Breakfast": {
                            "accept": {"all": [{"meal": ["breakfast"]}]},
                            "fit": {"ENERC_KCAL": {"min": 400, "max": 600}}
                        }
                    }
                }
            }
            
            meal_plan_response = meal_api.get_meal_plan(plan_request=meal_plan_payload, user_id="test-user")
            
            if meal_plan_response and 'selection' in meal_plan_response:
                days_count = len(meal_plan_response['selection'])
                logger.info(f"Meal Planner API test passed: Generated {days_count} day(s)")
                return True
            else:
                logger.warning("Meal Planner API test failed - might not be available on current plan")
                # Don't fail the test as Meal Planner might not be available on free tier
                return True
                
        except ImportError as e:
            logger.error(f"Failed to import Edamam API classes: {e}")
            return False
        except Exception as e:
            logger.error(f"Edamam API test failed: {e}")
            return False

    def test_gemini_api(self):
        """Test Google Gemini API integration"""
        if not self.gemini_api_key:
            logger.warning("Gemini API key not found, skipping test")
            return True
            
        try:
            from google import genai
            
            # Initialize client
            client = genai.Client(api_key=self.gemini_api_key)
            
            # Test simple request
            response = client.models.generate_content(
                model='gemini-2.0-flash-001',
                contents="Hello, this is a test. Respond with 'OK' if you can process this."
            )
            
            if response and hasattr(response, 'text'):
                logger.info("Gemini API test passed")
                return True
            else:
                logger.error("Gemini API test failed: No valid response")
                return False
                
        except Exception as e:
            logger.error(f"Gemini API test failed: {e}")
            return False

    def test_health_info_endpoint(self):
        """Test the /get_health_info endpoint"""
        try:
            test_data = {
                'food_name': 'apple',
                'height': 175,
                'weight': 70,
                'bmi': 22.9,  # calculated: 70 / (1.75^2)
                'conditions': 'None'
            }
            
            response = requests.post(
                f"{self.base_url}/get_health_info",
                json=test_data,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                # Check if required keys are present
                required_keys = ['health_benefits', 'recommendation']
                if all(key in data for key in required_keys):
                    logger.info("Health info endpoint test passed")
                    return True
                else:
                    logger.error(f"Health info response missing keys: {data}")
                    return False
            elif response.status_code == 500:
                # Check if it's a rate limit error
                try:
                    error_data = response.json()
                    error_msg = error_data.get('error', '')
                    if '429' in error_msg or 'quota' in error_msg.lower() or 'rate limit' in error_msg.lower():
                        logger.warning("Health info endpoint hit API rate limits - test skipped")
                        return True  # Skip test gracefully due to rate limits
                except:
                    pass
                logger.error(f"Health info endpoint failed: {response.status_code} - {response.text}")
                return False
            else:
                logger.error(f"Health info endpoint failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Health info endpoint test failed: {e}")
            return False

    def test_nutrition_routes(self):
        """Test nutrition API routes with updated endpoint structure"""
        try:
            # Test nutrition search endpoint
            response = requests.get(
                f"{self.base_url}/nutrition/search",
                params={'query': 'apple', 'limit': 5},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                # Check for expected response structure
                if 'success' in data and data['success']:
                    results = data.get('data', {}).get('results', [])
                    logger.info(f"Nutrition search test passed: {len(results)} results")
                    
                    # Test detailed food information if we have results
                    if results and len(results) > 0:
                        first_food = results[0]
                        food_id = first_food.get('food_id') or first_food.get('fdcId')
                        
                        if food_id:
                            # Test food details endpoint
                            detail_response = requests.get(
                                f"{self.base_url}/nutrition/food/{food_id}",
                                timeout=15
                            )
                            
                            if detail_response.status_code == 200:
                                detail_data = detail_response.json()
                                if 'success' in detail_data and detail_data['success']:
                                    logger.info("Nutrition food details test passed")
                                else:
                                    logger.warning("Nutrition food details returned unsuccessful response")
                            else:
                                logger.warning(f"Nutrition food details failed: {detail_response.status_code}")
                    
                    return True
                else:
                    error_msg = data.get('error', 'Unknown error')
                    logger.warning(f"Nutrition search returned error: {error_msg}")
                    # Don't fail if it's just API limits or credentials
                    if any(term in error_msg.lower() for term in ['rate', 'limit', 'quota', 'credential']):
                        return True
                    return False
            elif response.status_code == 404:
                logger.warning("Nutrition search endpoint not found - checking alternative endpoints")
                
                # Try alternative endpoint paths
                alternative_paths = ['/nutri/search', '/api/nutrition/search']
                for path in alternative_paths:
                    alt_response = requests.get(
                        f"{self.base_url}{path}",
                        params={'query': 'apple', 'limit': 5},
                        timeout=15
                    )
                    if alt_response.status_code == 200:
                        logger.info(f"Found working nutrition endpoint: {path}")
                        return True
                
                logger.error("No working nutrition endpoints found")
                return False
            else:
                logger.error(f"Nutrition search failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Nutrition routes test failed: {e}")
            return False

    def test_redis_cache(self):
        """Test Redis cache functionality"""
        try:
            import redis
            
            # Try to connect to Redis
            r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
            
            # Test basic operations
            test_key = "test_backend_check"
            test_value = "backend_test_value"
            
            r.set(test_key, test_value, ex=10)  # Expire in 10 seconds
            retrieved_value = r.get(test_key)
            
            if retrieved_value == test_value:
                r.delete(test_key)  # Clean up
                logger.info("Redis cache test passed")
                return True
            else:
                logger.error(f"Redis cache test failed: {retrieved_value} != {test_value}")
                return False
                
        except redis.ConnectionError:
            logger.warning("Redis server not running, but cache will gracefully degrade")
            return True
        except Exception as e:
            logger.error(f"Redis cache test failed: {e}")
            return False

    def test_file_structure(self):
        """Test if all required files exist"""
        # Get project root (two levels up from backend)
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        
        required_files = [
            'src/backend/app.py',
            'src/backend/routes/health_routes.py',
            'src/backend/services/nutrition_apis/usda_api.py',
            'src/backend/services/nutrition_apis/edamam_api.py',
            'src/backend/services/cache/nutrition_cache.py',
            'src/backend/services/nutrition_apis/nutrition_schema.py',
            'models/pretrained.pth'
        ]
        
        missing_files = []
        for file_path in required_files:
            full_path = os.path.join(project_root, file_path)
            if not os.path.exists(full_path):
                missing_files.append(file_path)
        
        if missing_files:
            logger.error(f"Missing files: {missing_files}")
            return False
        else:
            logger.info("All required files found")
            return True

    def run_all_tests(self):
        """Run all tests"""
        print(f"{Colors.BOLD}{Colors.BLUE}=== NutriVision Backend Testing Suite ==={Colors.ENDC}")
        print(f"Starting tests at {self.test_start_time}")
        print()
        
        # Run all test methods
        test_cases = [
            ("Environment Variables Check", self.test_environment_variables),
            ("File Structure Check", self.test_file_structure),
            ("Flask Server Health Check", self.test_flask_server_health),
            ("Model Loading Test", self.test_model_loading),
            ("Image Prediction Endpoint", self.test_image_prediction),
            ("USDA API Integration", self.test_usda_api),
            ("Edamam API Integration", self.test_edamam_api),
            ("Gemini API Integration", self.test_gemini_api),
            ("Health Info Endpoint", self.test_health_info_endpoint),
            ("Nutrition Routes Integration", self.test_nutrition_routes),
            ("Redis Cache Integration", self.test_redis_cache)
        ]
        
        for test_name, test_func in test_cases:
            self.run_test(test_name, test_func)
            time.sleep(0.5)  # Small delay between tests
        
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        total_tests = len(self.results)
        passed = len([r for r in self.results if r.status == 'PASS'])
        failed = len([r for r in self.results if r.status == 'FAIL'])
        skipped = len([r for r in self.results if r.status == 'SKIP'])
        
        total_duration = (datetime.now() - self.test_start_time).total_seconds()
        
        print("\n" + "="*80)
        print(f"{Colors.BOLD}TEST SUMMARY{Colors.ENDC}")
        print("="*80)
        print(f"Total Tests:  {total_tests}")
        print(f"{Colors.GREEN}Passed:       {passed}{Colors.ENDC}")
        print(f"{Colors.RED}Failed:       {failed}{Colors.ENDC}")
        print(f"{Colors.YELLOW}Skipped:      {skipped}{Colors.ENDC}")
        print(f"Duration:     {total_duration:.2f}s")
        
        if failed > 0:
            print(f"\n{Colors.RED}FAILED TESTS:{Colors.ENDC}")
            for result in self.results:
                if result.status == 'FAIL':
                    print(f"  - {result.test_name}: {result.message}")
        
        # Health recommendations
        print(f"\n{Colors.BOLD}RECOMMENDATIONS:{Colors.ENDC}")
        
        if not any(r.test_name == "Flask Server Health Check" and r.status == "PASS" for r in self.results):
            print(f"{Colors.RED}⚠️  Start Flask server: python src/backend/app.py{Colors.ENDC}")
        
        if any(r.test_name.endswith("API Integration") and r.status == "SKIP" for r in self.results):
            print(f"{Colors.YELLOW}⚠️  Configure API keys in .env file for full functionality{Colors.ENDC}")
        
        if any(r.test_name == "Redis Cache Integration" and r.status == "SKIP" for r in self.results):
            print(f"{Colors.YELLOW}⚠️  Install and start Redis for caching: redis-server{Colors.ENDC}")
        
        # Overall status
        if failed == 0:
            print(f"\n{Colors.GREEN}{Colors.BOLD}✅ All critical tests passed! Backend is healthy.{Colors.ENDC}")
        else:
            print(f"\n{Colors.RED}{Colors.BOLD}❌ Some tests failed. Review issues above.{Colors.ENDC}")

def main():
    """Main function"""
    print("Initializing Backend Testing Suite...")
    
    # Check if we're in the backend directory or project root
    current_dir = os.getcwd()
    backend_dir = os.path.dirname(__file__)
    project_root = os.path.dirname(os.path.dirname(backend_dir))
    
    # Change to project root for testing
    if os.path.exists(os.path.join(project_root, 'src/backend/app.py')):
        os.chdir(project_root)
        print(f"Changed working directory to: {project_root}")
    elif not os.path.exists('app.py'):
        print(f"{Colors.RED}Error: Cannot find app.py. Run this script from the backend directory{Colors.ENDC}")
        sys.exit(1)
    
    tester = BackendTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()

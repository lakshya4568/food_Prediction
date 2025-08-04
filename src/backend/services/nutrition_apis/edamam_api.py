"""
Edamam API Wrapper for NutriVision AI

This module provides robust wrappers for both Edamam Food Database API 
and Meal Planner API to search foods and generate meal plans.
"""

import requests
import logging
import time
from typing import Dict, Any, Optional, List
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class EdamamNutrient:
    """Represents a nutrient from Edamam Food Database"""
    label: str
    quantity: float
    unit: str


@dataclass
class EdamamFoodItem:
    """Represents a food item from Edamam Food Database"""
    food_id: str
    label: str
    nutrients: Dict[str, EdamamNutrient]
    category: Optional[str] = None
    category_label: Optional[str] = None
    image: Optional[str] = None
    brand: Optional[str] = None
    serving_weight: Optional[float] = None


class EdamamFoodDatabaseAPI:
    """
    Wrapper for Edamam Food Database API.
    Searches for food items and retrieves detailed nutritional information.
    """
    BASE_URL = "https://api.edamam.com/api/food-database/v2"

    def __init__(self, app_id: str, app_key: str):
        """
        Initialize the Edamam Food Database API wrapper.
        
        Args:
            app_id: Your Edamam application ID
            app_key: Your Edamam application key
        """
        self.app_id = app_id
        self.app_key = app_key
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
        # Rate limiting - Edamam allows 10 requests per minute on free tier
        self.rate_limit_delay = 6.0  # seconds between requests
        self.last_request_time = 0

    def _wait_for_rate_limit(self):
        """Enforce rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.rate_limit_delay:
            sleep_time = self.rate_limit_delay - time_since_last
            logger.debug(f"Rate limiting: sleeping for {sleep_time:.2f} seconds")
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()

    def search_foods(self, query: str, limit: int = 10) -> List[EdamamFoodItem]:
        """
        Search for foods using the Edamam Food Database parser endpoint.
        
        Args:
            query: Search query (ingredient name)
            limit: Maximum number of results to return
            
        Returns:
            List of EdamamFoodItem objects
        """
        self._wait_for_rate_limit()
        
        url = f"{self.BASE_URL}/parser"
        params = {
            'app_id': self.app_id,
            'app_key': self.app_key,
            'ingr': query
        }

        try:
            response = self.session.get(url, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_search_results(data, limit)
            else:
                logger.error(f"Food Database API Error: {response.status_code} | {response.text}")
                response.raise_for_status()
                return []
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to search foods from Edamam API: {e}")
            return []

    def get_food_details(self, food_id: str) -> Optional[EdamamFoodItem]:
        """
        Get detailed nutrition information for a specific food.
        
        Args:
            food_id: Edamam food ID
            
        Returns:
            EdamamFoodItem with detailed nutrition data or None
        """
        self._wait_for_rate_limit()
        
        url = f"{self.BASE_URL}/nutrients"
        
        payload = {
            "ingredients": [
                {
                    "quantity": 100,
                    "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
                    "foodId": food_id
                }
            ]
        }
        
        params = {
            'app_id': self.app_id,
            'app_key': self.app_key
        }

        try:
            response = self.session.post(url, json=payload, params=params, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_nutrition_details(data, food_id)
            else:
                logger.error(f"Food Details API Error: {response.status_code} | {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get food details from Edamam API: {e}")
            return None

    def _parse_search_results(self, data: Dict[str, Any], limit: int) -> List[EdamamFoodItem]:
        """Parse search results from Edamam API response"""
        foods = []
        
        # Parse 'parsed' foods (exact matches)
        parsed_foods = data.get('parsed', [])
        for item in parsed_foods[:limit]:
            food_data = item.get('food', {})
            food_item = self._create_food_item(food_data)
            if food_item:
                foods.append(food_item)
        
        # Parse 'hints' foods (suggested matches) if we need more results
        if len(foods) < limit:
            hints = data.get('hints', [])
            remaining_limit = limit - len(foods)
            for item in hints[:remaining_limit]:
                food_data = item.get('food', {})
                food_item = self._create_food_item(food_data)
                if food_item:
                    foods.append(food_item)
        
        return foods

    def _parse_nutrition_details(self, data: Dict[str, Any], food_id: str) -> Optional[EdamamFoodItem]:
        """Parse detailed nutrition data from Edamam nutrients endpoint"""
        try:
            logger.debug(f"Parsing nutrition details for food_id: {food_id}")
            logger.debug(f"Response data keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
            
            # Extract nutrition data from the response
            total_nutrients = data.get('totalNutrients', {})
            ingredients = data.get('ingredients', [])
            
            logger.debug(f"Total nutrients count: {len(total_nutrients)}")
            logger.debug(f"Ingredients count: {len(ingredients)}")
            
            if not ingredients:
                logger.warning("No ingredients found in nutrition response")
                return None
            
            ingredient = ingredients[0]
            logger.debug(f"First ingredient keys: {list(ingredient.keys()) if isinstance(ingredient, dict) else 'Not a dict'}")
            
            # Get parsed data or fallback to basic ingredient info
            parsed_data = ingredient.get('parsed', [])
            if not parsed_data:
                # Fallback: use the ingredient data directly
                food_label = "Unknown Food"
                food_category = "food"
                food_category_label = "Generic Food"
                logger.debug("No parsed data found, using fallback values")
            else:
                food_info = parsed_data[0]
                logger.debug(f"Food info keys: {list(food_info.keys()) if isinstance(food_info, dict) else f'Not a dict: {type(food_info)}'}")
                logger.debug(f"Food info content: {food_info}")
                
                food_data = food_info.get('food', {})
                logger.debug(f"Food data type: {type(food_data)}")
                logger.debug(f"Food data content: {food_data}")
                
                if isinstance(food_data, dict):
                    food_label = food_data.get('label', 'Unknown Food')
                    food_category = food_data.get('category', 'food')
                    food_category_label = food_data.get('categoryLabel', 'Generic Food')
                else:
                    # food_data might be a string or other type, handle gracefully
                    food_label = str(food_data) if food_data else "Unknown Food"
                    food_category = "food"
                    food_category_label = "Generic Food"
                
                logger.debug(f"Found parsed food: {food_label}")
            
            # Convert nutrients to our format
            nutrients = {}
            for nutrient_key, nutrient_data in total_nutrients.items():
                if isinstance(nutrient_data, dict):
                    nutrients[nutrient_key] = EdamamNutrient(
                        label=nutrient_data.get('label', nutrient_key),
                        quantity=nutrient_data.get('quantity', 0.0),
                        unit=nutrient_data.get('unit', '')
                    )
                else:
                    logger.warning(f"Nutrient {nutrient_key} data is not a dict: {type(nutrient_data)}")
            
            logger.debug(f"Successfully parsed {len(nutrients)} nutrients")
            
            return EdamamFoodItem(
                food_id=food_id,
                label=food_label,
                nutrients=nutrients,
                category=food_category,
                category_label=food_category_label,
                serving_weight=ingredient.get('weight', 100.0)
            )
            
        except Exception as e:
            logger.error(f"Error parsing nutrition details: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return None

    def _create_food_item(self, food_data: Dict[str, Any]) -> Optional[EdamamFoodItem]:
        """Create EdamamFoodItem from API food data"""
        try:
            food_id = food_data.get('foodId', '')
            if not food_id:
                return None
                
            # Basic nutrients from search results (limited)
            nutrients = {}
            nutrients_data = food_data.get('nutrients', {})
            
            for nutrient_key, value in nutrients_data.items():
                nutrients[nutrient_key] = EdamamNutrient(
                    label=nutrient_key,
                    quantity=value,
                    unit='g'  # Default unit, may not be accurate
                )
            
            return EdamamFoodItem(
                food_id=food_id,
                label=food_data.get('label', ''),
                nutrients=nutrients,
                category=food_data.get('category', ''),
                category_label=food_data.get('categoryLabel', ''),
                image=food_data.get('image', '')
            )
            
        except Exception as e:
            logger.error(f"Error creating food item: {e}")
            return None


class EdamamMealPlannerAPI:
    """
    Wrapper for Edamam Meal Planner API.
    Generates meal plans based on specified dietary and nutritional constraints.
    """
    BASE_URL = "https://api.edamam.com/api/meal-planner/v1"

    def __init__(self, app_id: str, app_key: str):
        """
        Initialize the Edamam Meal Planner API wrapper.
        
        Args:
            app_id: Your Edamam application ID
            app_key: Your Edamam application key
        """
        self.app_id = app_id
        self.app_key = app_key
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
        # Rate limiting - same as Food Database API
        self.rate_limit_delay = 6.0  # seconds between requests
        self.last_request_time = 0

    def _wait_for_rate_limit(self):
        """Enforce rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.rate_limit_delay:
            sleep_time = self.rate_limit_delay - time_since_last
            logger.debug(f"Rate limiting: sleeping for {sleep_time:.2f} seconds")
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()

    def get_meal_plan(self, plan_request: Dict[str, Any], user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Generate a meal plan by sending a POST request to the Edamam Meal Planner API.
        
        Args:
            plan_request: A dictionary representing the meal plan constraints
            user_id: An optional unique identifier for the end-user for active user tracking
            
        Returns:
            A dictionary containing the meal plan response, or None if an error occurs
        """
        self._wait_for_rate_limit()
        
        url = f"{self.BASE_URL}?app_id={self.app_id}&app_key={self.app_key}"
        
        headers = {}
        if user_id:
            headers["Edamam-User-ID"] = user_id

        try:
            response = self.session.post(url, json=plan_request, headers=headers, timeout=60)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Meal Planner API Error: {response.status_code} | {response.text}")
                response.raise_for_status()
                return None
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get meal plan from Edamam API: {e}")
            return None


# Example usage for testing purposes
if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    
    # Set logging level to DEBUG for detailed output
    logging.basicConfig(level=logging.DEBUG)

    # Load environment variables
    load_dotenv()

    # Get credentials from environment variables
    EDAMAM_APP_ID = os.getenv("EDAMAM_APP_ID")
    EDAMAM_APP_KEY = os.getenv("EDAMAM_APP_KEY") or os.getenv("EDAMAM_API_KEY")

    if not EDAMAM_APP_ID or not EDAMAM_APP_KEY:
        print("Please set EDAMAM_APP_ID and EDAMAM_APP_KEY environment variables.")
        print("Example .env file:")
        print("EDAMAM_APP_ID=your_app_id")
        print("EDAMAM_APP_KEY=your_app_key")
    else:
        print("Testing Edamam Food Database API...")
        
        # Test Food Database API
        food_api = EdamamFoodDatabaseAPI(app_id=EDAMAM_APP_ID, app_key=EDAMAM_APP_KEY)
        
        # Search for foods
        print("\n=== Testing Food Search ===")
        search_results = food_api.search_foods("apple", limit=3)
        
        if search_results:
            print(f"Found {len(search_results)} food items:")
            for i, food in enumerate(search_results, 1):
                print(f"{i}. {food.label} (ID: {food.food_id})")
                print(f"   Category: {food.category_label or food.category or 'N/A'}")
                if food.nutrients:
                    print(f"   Nutrients: {len(food.nutrients)} available")
                print()
            
            # Test detailed nutrition lookup
            if search_results:
                print("=== Testing Detailed Nutrition ===")
                first_food = search_results[0]
                detailed_food = food_api.get_food_details(first_food.food_id)
                
                if detailed_food:
                    print(f"Detailed nutrition for: {detailed_food.label}")
                    print(f"Total nutrients available: {len(detailed_food.nutrients)}")
                    
                    # Show some key nutrients
                    key_nutrients = ['ENERC_KCAL', 'PROCNT', 'FAT', 'CHOCDF', 'FIBTG']
                    for nutrient_key in key_nutrients:
                        if nutrient_key in detailed_food.nutrients:
                            nutrient = detailed_food.nutrients[nutrient_key]
                            print(f"  {nutrient.label}: {nutrient.quantity:.2f} {nutrient.unit}")
                else:
                    print("Failed to get detailed nutrition data")
        else:
            print("No food items found in search")
        
        print("\n=== Testing Meal Planner API ===")
        
        # Test Meal Planner API
        meal_api = EdamamMealPlannerAPI(app_id=EDAMAM_APP_ID, app_key=EDAMAM_APP_KEY)

        # Simple meal plan request
        example_payload = {
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
                    },
                    "Lunch": {
                        "accept": {"all": [{"meal": ["lunch/dinner"]}]},
                        "fit": {"ENERC_KCAL": {"min": 600, "max": 800}}
                    },
                    "Dinner": {
                        "accept": {"all": [{"meal": ["lunch/dinner"]}]},
                        "fit": {"ENERC_KCAL": {"min": 600, "max": 800}}
                    }
                }
            }
        }

        meal_plan_response = meal_api.get_meal_plan(plan_request=example_payload, user_id="nutrivision-test-user")

        if meal_plan_response:
            print("Successfully retrieved meal plan!")
            print(f"Plan contains {len(meal_plan_response.get('selection', []))} days")
            
            # Show brief meal plan summary
            for day_idx, day in enumerate(meal_plan_response.get('selection', []), 1):
                print(f"\nDay {day_idx}:")
                for section_name, section_data in day.get('sections', {}).items():
                    recipes = section_data.get('assigned', [])
                    if recipes:
                        recipe = recipes[0]  # Get first recipe
                        print(f"  {section_name}: {recipe.get('recipe', {}).get('label', 'Unknown Recipe')}")
        else:
            print("Failed to retrieve meal plan")
            print("Note: Meal Planner API might not be available on your current Edamam plan")

    print("\n--- API Testing Complete ---")

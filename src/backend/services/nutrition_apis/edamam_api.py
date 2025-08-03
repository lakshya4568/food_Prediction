"""
Edamam Micronutrients API Wrapper for NutriVision AI

This module provides a robust wrapper for the Edamam Micronutrients API
to fetch detailed micronutrient data for foods.
"""

import requests
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


@dataclass
class EdamamNutrient:
    """Represents a nutrient from Edamam API"""
    label: str
    quantity: float
    unit: str
    tag: str


@dataclass  
class EdamamFoodItem:
    """Represents a food item from Edamam API"""
    food_id: str
    label: str
    known_as: str
    nutrients: Dict[str, EdamamNutrient]
    category: Optional[str] = None
    category_label: Optional[str] = None
    image: Optional[str] = None


class EdamamNutrientsAPI:
    """
    Wrapper for Edamam Micronutrients API
    """
    
    BASE_URL = "https://api.edamam.com/api/food-database/v2"
    
    def __init__(self, app_id: str, app_key: str):
        """
        Initialize Edamam API wrapper
        
        Args:
            app_id: Edamam application ID
            app_key: Edamam application key
        """
        self.app_id = app_id
        self.app_key = app_key
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
        # Rate limiting - Edamam allows different limits based on plan
        # Free tier: 5 calls/minute, 10,000/month
        self.rate_limit_delay = 12  # 12 seconds between requests for free tier
        self.last_request_time = 0
        
        # Common nutrient mappings
        self.nutrient_mapping = {
            'energy': 'ENERC_KCAL',      # Energy (kcal)
            'protein': 'PROCNT',         # Protein
            'total_fat': 'FAT',          # Total fat
            'carbohydrate': 'CHOCDF',    # Carbohydrates
            'fiber': 'FIBTG',            # Fiber
            'sugars': 'SUGAR',           # Sugars
            'sodium': 'NA',              # Sodium
            'calcium': 'CA',             # Calcium
            'iron': 'FE',                # Iron
            'potassium': 'K',            # Potassium
            'vitamin_c': 'VITC',         # Vitamin C
            'vitamin_a': 'VITA_RAE',     # Vitamin A
            'vitamin_d': 'VITD',         # Vitamin D
            'vitamin_e': 'TOCPHA',       # Vitamin E
            'vitamin_k': 'VITK1',        # Vitamin K
            'thiamin': 'THIA',           # Thiamin
            'riboflavin': 'RIBF',        # Riboflavin
            'niacin': 'NIA',             # Niacin
            'vitamin_b6': 'VITB6A',      # Vitamin B-6
            'folate': 'FOLAC',           # Folate
            'vitamin_b12': 'VITB12',     # Vitamin B-12
            'magnesium': 'MG',           # Magnesium
            'phosphorus': 'P',           # Phosphorus
            'zinc': 'ZN',                # Zinc
            'copper': 'CU',              # Copper
            'manganese': 'MN',           # Manganese
            'selenium': 'SE',            # Selenium
            'cholesterol': 'CHOLE',      # Cholesterol
            'saturated_fat': 'FASAT',    # Saturated fat
            'monounsaturated_fat': 'FAMS',  # Monounsaturated fat
            'polyunsaturated_fat': 'FAPU',  # Polyunsaturated fat
            'trans_fat': 'FATRN'         # Trans fat
        }
    
    def _wait_for_rate_limit(self):
        """Enforce rate limiting"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.rate_limit_delay:
            sleep_time = self.rate_limit_delay - time_since_last
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()
    
    def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make API request with rate limiting and error handling
        
        Args:
            endpoint: API endpoint
            params: Request parameters
            
        Returns:
            dict: API response data
            
        Raises:
            requests.RequestException: If API request fails
        """
        self._wait_for_rate_limit()
        
        params.update({
            'app_id': self.app_id,
            'app_key': self.app_key
        })
        
        url = f"{self.BASE_URL}/{endpoint}"
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Edamam API request failed: {e}")
            raise
    
    def search_foods(self, query: str, category: Optional[str] = None, 
                    brand: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Search for foods by keyword
        
        Args:
            query: Search query
            category: Food category filter
            brand: Brand filter
            
        Returns:
            list: List of food search results
        """
        params = {'ingr': query}
        
        if category:
            params['category'] = category
        if brand:
            params['brand'] = brand
        
        try:
            response = self._make_request('parser', params)
            return response.get('hints', [])
            
        except Exception as e:
            logger.error(f"Error searching foods: {e}")
            return []
    
    def get_food_nutrients(self, food_id: str, measure_uri: Optional[str] = None) -> Optional[EdamamFoodItem]:
        """
        Get detailed nutrient information for a specific food
        
        Args:
            food_id: Edamam food ID
            measure_uri: Specific measure URI for portion size
            
        Returns:
            EdamamFoodItem: Food item with nutrient data
        """
        request_body = {
            'ingredients': [
                {
                    'quantity': 100,  # Default to 100g
                    'measureURI': measure_uri or 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram',
                    'foodId': food_id
                }
            ]
        }
        
        try:
            self._wait_for_rate_limit()
            
            url = f"{self.BASE_URL}/nutrients"
            params = {
                'app_id': self.app_id,
                'app_key': self.app_key
            }
            
            response = self.session.post(url, json=request_body, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            return self._parse_nutrients_response(data, food_id)
            
        except Exception as e:
            logger.error(f"Error getting food nutrients for ID {food_id}: {e}")
            return None
    
    def get_food_by_upc(self, upc: str) -> Optional[EdamamFoodItem]:
        """
        Get food information by UPC/barcode
        
        Args:
            upc: UPC/barcode string
            
        Returns:
            EdamamFoodItem: Food item if found
        """
        params = {'upc': upc}
        
        try:
            response = self._make_request('parser', params)
            hints = response.get('hints', [])
            
            if hints:
                food_data = hints[0].get('food', {})
                food_id = food_data.get('foodId')
                
                if food_id:
                    return self.get_food_nutrients(food_id)
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting food by UPC {upc}: {e}")
            return None
    
    def _parse_nutrients_response(self, data: Dict[str, Any], food_id: str) -> Optional[EdamamFoodItem]:
        """
        Parse nutrients API response into EdamamFoodItem
        
        Args:
            data: Raw API response data
            food_id: Food ID
            
        Returns:
            EdamamFoodItem: Parsed food item
        """
        try:
            total_nutrients = data.get('totalNutrients', {})
            ingredients = data.get('ingredients', [])
            
            nutrients = {}
            for nutrient_key, nutrient_data in total_nutrients.items():
                nutrient = EdamamNutrient(
                    label=nutrient_data.get('label', ''),
                    quantity=nutrient_data.get('quantity', 0.0),
                    unit=nutrient_data.get('unit', ''),
                    tag=nutrient_key
                )
                nutrients[nutrient_key] = nutrient
            
            # Get food label from ingredients
            food_label = 'Unknown Food'
            if ingredients:
                parsed_ingredient = ingredients[0].get('parsed', [])
                if parsed_ingredient:
                    food_label = parsed_ingredient[0].get('food', '')
            
            return EdamamFoodItem(
                food_id=food_id,
                label=food_label,
                known_as=food_label,
                nutrients=nutrients
            )
            
        except Exception as e:
            logger.error(f"Error parsing nutrients response: {e}")
            return None
    
    def search_food_by_name(self, food_name: str) -> Optional[EdamamFoodItem]:
        """
        Search for a single food by name and return detailed nutrient data
        
        Args:
            food_name: Name of the food to search for
            
        Returns:
            EdamamFoodItem: Best matching food item with nutrient data
        """
        try:
            # Search for foods
            search_results = self.search_foods(food_name)
            
            if not search_results:
                return None
            
            # Get the first result (Edamam usually returns relevant results first)
            best_match = search_results[0]
            food_data = best_match.get('food', {})
            food_id = food_data.get('foodId')
            
            if food_id:
                return self.get_food_nutrients(food_id)
            
            return None
            
        except Exception as e:
            logger.error(f"Error searching food by name '{food_name}': {e}")
            return None
    
    def get_nutrient_by_name(self, food_item: EdamamFoodItem, nutrient_name: str) -> Optional[EdamamNutrient]:
        """
        Get a specific nutrient from a food item by common name
        
        Args:
            food_item: EdamamFoodItem to search
            nutrient_name: Common nutrient name (e.g., 'protein', 'energy')
            
        Returns:
            EdamamNutrient: Found nutrient or None
        """
        nutrient_tag = self.nutrient_mapping.get(nutrient_name.lower())
        
        if not nutrient_tag:
            return None
        
        return food_item.nutrients.get(nutrient_tag)
    
    def get_common_nutrients(self, food_item: EdamamFoodItem) -> Dict[str, float]:
        """
        Extract common nutrients from a food item into a simple dict
        
        Args:
            food_item: EdamamFoodItem to extract nutrients from
            
        Returns:
            dict: Common nutrients with values per 100g
        """
        nutrients = {}
        
        for name, nutrient_tag in self.nutrient_mapping.items():
            nutrient = food_item.nutrients.get(nutrient_tag)
            if nutrient:
                nutrients[name] = nutrient.quantity
            else:
                nutrients[name] = 0.0
        
        return nutrients
    
    def get_autocomplete_suggestions(self, query: str) -> List[str]:
        """
        Get autocomplete suggestions for food search
        
        Args:
            query: Partial search query
            
        Returns:
            list: List of suggested food names
        """
        try:
            params = {'ingr': query}
            response = self._make_request('auto-complete', params)
            
            suggestions = []
            for item in response:
                suggestions.append(item)
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Error getting autocomplete suggestions: {e}")
            return []


# Example usage and testing
if __name__ == "__main__":
    # This would be used for testing
    import os
    
    app_id = os.getenv('EDAMAM_APP_ID')
    app_key = os.getenv('EDAMAM_APP_KEY')
    
    if app_id and app_key:
        api = EdamamNutrientsAPI(app_id, app_key)
        
        # Test search
        foods = api.search_foods("apple")
        print(f"Found {len(foods)} foods")
        
        if foods:
            # Test detailed lookup
            food_data = foods[0].get('food', {})
            food_id = food_data.get('foodId')
            
            if food_id:
                food_item = api.get_food_nutrients(food_id)
                
                if food_item:
                    print(f"Food: {food_item.label}")
                    common_nutrients = api.get_common_nutrients(food_item)
                    print("Common nutrients:", common_nutrients)

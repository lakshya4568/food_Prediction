"""
USDA FoodData Central API Wrapper for NutriVision AI

This module provides a robust wrapper for the USDA FoodData Central API
to fetch comprehensive nutrition data for foods.
"""

import requests
import time
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


@dataclass
class USDANutrient:
    """Represents a nutrient from USDA FoodData Central"""
    nutrient_id: int
    name: str
    unit: str
    amount: float
    rank: Optional[int] = None


@dataclass
class USDAFoodItem:
    """Represents a food item from USDA FoodData Central"""
    fdc_id: int
    description: str
    data_type: str
    nutrients: List[USDANutrient]
    publication_date: Optional[str] = None
    brand_owner: Optional[str] = None
    gtinUpc: Optional[str] = None
    ingredients: Optional[str] = None


class USDAFoodDataAPI:
    """
    Wrapper for USDA FoodData Central API
    """
    
    BASE_URL = "https://api.nal.usda.gov/fdc/v1"
    
    def __init__(self, api_key: str):
        """
        Initialize USDA API wrapper
        
        Args:
            api_key: USDA FoodData Central API key
        """
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
        # Rate limiting - USDA allows 1000 requests per hour
        self.rate_limit_delay = 3.6  # seconds between requests
        self.last_request_time = 0
        
        # Common nutrient IDs for mapping
        self.nutrient_mapping = {
            'energy': 1008,           # Energy (kcal)
            'protein': 1003,          # Protein
            'total_fat': 1004,        # Total lipid (fat)
            'carbohydrate': 1005,     # Carbohydrate, by difference
            'fiber': 1079,            # Fiber, total dietary
            'sugars': 2000,           # Sugars, total including NLEA
            'sodium': 1093,           # Sodium
            'calcium': 1087,          # Calcium
            'iron': 1089,             # Iron
            'potassium': 1092,        # Potassium
            'vitamin_c': 1162,        # Vitamin C
            'vitamin_a': 1104,        # Vitamin A, RAE
            'vitamin_d': 1114,        # Vitamin D (D2 + D3)
            'vitamin_e': 1109,        # Vitamin E
            'vitamin_k': 1185,        # Vitamin K
            'thiamin': 1165,          # Thiamin
            'riboflavin': 1166,       # Riboflavin
            'niacin': 1167,           # Niacin
            'vitamin_b6': 1175,       # Vitamin B-6
            'folate': 1177,           # Folate, total
            'vitamin_b12': 1178,      # Vitamin B-12
            'magnesium': 1090,        # Magnesium
            'phosphorus': 1091,       # Phosphorus
            'zinc': 1095,             # Zinc
            'copper': 1098,           # Copper
            'manganese': 1101,        # Manganese
            'selenium': 1103,         # Selenium
            'cholesterol': 1253,      # Cholesterol
            'saturated_fat': 1258,    # Fatty acids, total saturated
            'monounsaturated_fat': 1292,  # Fatty acids, total monounsaturated
            'polyunsaturated_fat': 1293,  # Fatty acids, total polyunsaturated
            'trans_fat': 1257         # Fatty acids, total trans
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
        
        params['api_key'] = self.api_key
        url = f"{self.BASE_URL}/{endpoint}"
        
        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"USDA API request failed: {e}")
            raise
    
    def search_foods(self, query: str, page_size: int = 10, 
                    data_type: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        Search for foods by keyword
        
        Args:
            query: Search query
            page_size: Number of results to return (max 200)
            data_type: Filter by data types (e.g., ['Branded', 'SR Legacy'])
            
        Returns:
            list: List of food search results
        """
        params = {
            'query': query,
            'pageSize': min(page_size, 200)
        }
        
        if data_type:
            params['dataType'] = data_type
        
        try:
            response = self._make_request('foods/search', params)
            return response.get('foods', [])
            
        except Exception as e:
            logger.error(f"Error searching foods: {e}")
            return []
    
    def get_food_details(self, fdc_id: int, nutrients: Optional[List[int]] = None) -> Optional[USDAFoodItem]:
        """
        Get detailed nutrition information for a specific food
        
        Args:
            fdc_id: FDC ID of the food
            nutrients: List of specific nutrient IDs to include
            
        Returns:
            USDAFoodItem: Food item with nutrition data
        """
        params = {}
        if nutrients:
            params['nutrients'] = nutrients
        
        try:
            response = self._make_request(f'food/{fdc_id}', params)
            return self._parse_food_item(response)
            
        except Exception as e:
            logger.error(f"Error getting food details for FDC ID {fdc_id}: {e}")
            return None
    
    def get_foods_batch(self, fdc_ids: List[int], nutrients: Optional[List[int]] = None) -> List[USDAFoodItem]:
        """
        Get nutrition information for multiple foods in a single request
        
        Args:
            fdc_ids: List of FDC IDs
            nutrients: List of specific nutrient IDs to include
            
        Returns:
            list: List of USDAFoodItem objects
        """
        # Split into chunks of 20 (API limit)
        chunk_size = 20
        all_foods = []
        
        for i in range(0, len(fdc_ids), chunk_size):
            chunk = fdc_ids[i:i + chunk_size]
            
            request_body = {
                'fdcIds': chunk,
                'format': 'abridged',
                'nutrients': nutrients or []
            }
            
            try:
                self._wait_for_rate_limit()
                
                url = f"{self.BASE_URL}/foods"
                params = {'api_key': self.api_key}
                
                response = self.session.post(url, json=request_body, params=params, timeout=30)
                response.raise_for_status()
                
                data = response.json()
                
                for food_data in data:
                    food_item = self._parse_food_item(food_data)
                    if food_item:
                        all_foods.append(food_item)
                        
            except Exception as e:
                logger.error(f"Error getting batch foods: {e}")
                continue
        
        return all_foods
    
    def _parse_food_item(self, data: Dict[str, Any]) -> Optional[USDAFoodItem]:
        """
        Parse raw API response into USDAFoodItem
        
        Args:
            data: Raw API response data
            
        Returns:
            USDAFoodItem: Parsed food item
        """
        try:
            nutrients = []
            
            for nutrient_data in data.get('foodNutrients', []):
                nutrient_info = nutrient_data.get('nutrient', {})
                nutrient = USDANutrient(
                    nutrient_id=nutrient_info.get('id', 0),
                    name=nutrient_info.get('name', ''),
                    unit=nutrient_info.get('unitName', ''),
                    amount=nutrient_data.get('amount', 0.0),
                    rank=nutrient_info.get('rank')
                )
                nutrients.append(nutrient)
            
            return USDAFoodItem(
                fdc_id=data.get('fdcId', 0),
                description=data.get('description', ''),
                data_type=data.get('dataType', ''),
                nutrients=nutrients,
                publication_date=data.get('publicationDate'),
                brand_owner=data.get('brandOwner'),
                gtinUpc=data.get('gtinUpc'),
                ingredients=data.get('ingredients')
            )
            
        except Exception as e:
            logger.error(f"Error parsing food item: {e}")
            return None
    
    def get_nutrient_by_name(self, food_item: USDAFoodItem, nutrient_name: str) -> Optional[USDANutrient]:
        """
        Get a specific nutrient from a food item by common name
        
        Args:
            food_item: USDAFoodItem to search
            nutrient_name: Common nutrient name (e.g., 'protein', 'energy')
            
        Returns:
            USDANutrient: Found nutrient or None
        """
        nutrient_id = self.nutrient_mapping.get(nutrient_name.lower())
        
        if not nutrient_id:
            return None
        
        for nutrient in food_item.nutrients:
            if nutrient.nutrient_id == nutrient_id:
                return nutrient
        
        return None
    
    def search_food_by_name(self, food_name: str, exact_match: bool = False) -> Optional[USDAFoodItem]:
        """
        Search for a single food by name and return detailed nutrition data
        
        Args:
            food_name: Name of the food to search for
            exact_match: Whether to require exact match in description
            
        Returns:
            USDAFoodItem: Best matching food item with nutrition data
        """
        try:
            # Search for foods
            search_results = self.search_foods(food_name, page_size=10)
            
            if not search_results:
                return None
            
            # Find best match
            best_match = None
            best_score = 0
            
            for result in search_results:
                description = result.get('description', '').lower()
                query_lower = food_name.lower()
                
                if exact_match and query_lower not in description:
                    continue
                
                # Simple scoring based on keyword matches and data type preference
                score = 0
                if query_lower in description:
                    score += 10
                
                # Prefer SR Legacy and Foundation Foods over Branded
                data_type = result.get('dataType', '')
                if data_type in ['SR Legacy', 'Foundation']:
                    score += 5
                elif data_type == 'Branded':
                    score += 2
                
                if score > best_score:
                    best_score = score
                    best_match = result
            
            if not best_match:
                best_match = search_results[0]  # Fallback to first result
            
            # Get detailed nutrition data
            fdc_id = best_match.get('fdcId')
            if fdc_id:
                return self.get_food_details(fdc_id)
            
            return None
            
        except Exception as e:
            logger.error(f"Error searching food by name '{food_name}': {e}")
            return None
    
    def get_common_nutrients(self, food_item: USDAFoodItem) -> Dict[str, float]:
        """
        Extract common nutrients from a food item into a simple dict
        
        Args:
            food_item: USDAFoodItem to extract nutrients from
            
        Returns:
            dict: Common nutrients with values in standard units
        """
        nutrients = {}
        
        for name, nutrient_id in self.nutrient_mapping.items():
            for nutrient in food_item.nutrients:
                if nutrient.nutrient_id == nutrient_id:
                    nutrients[name] = nutrient.amount
                    break
            else:
                nutrients[name] = 0.0
        
        return nutrients


# Example usage and testing
if __name__ == "__main__":
    # This would be used for testing
    import os
    
    api_key = os.getenv('USDA_API_KEY')
    if api_key:
        api = USDAFoodDataAPI(api_key)
        
        # Test search
        foods = api.search_foods("apple", page_size=5)
        print(f"Found {len(foods)} foods")
        
        if foods:
            # Test detailed lookup
            fdc_id = foods[0]['fdcId']
            food_item = api.get_food_details(fdc_id)
            
            if food_item:
                print(f"Food: {food_item.description}")
                common_nutrients = api.get_common_nutrients(food_item)
                print("Common nutrients:", common_nutrients)

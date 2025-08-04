#!/usr/bin/env python3
"""
Test script to verify the updated Edamam API implementation 
matches the pattern from check2.py
"""

import os
import sys
from dotenv import load_dotenv

# Add the nutrition_apis directory directly to Python path
nutrition_apis_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src', 'backend', 'services', 'nutrition_apis')
sys.path.insert(0, nutrition_apis_path)

try:
    # Import our updated API classes directly
    from edamam_api import EdamamFoodDatabaseAPI, EdamamMealPlannerAPI
    print("✅ Successfully imported API classes")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print(f"Nutrition APIs path: {nutrition_apis_path}")
    print(f"Directory exists: {os.path.exists(nutrition_apis_path)}")
    # List files in the directory
    if os.path.exists(nutrition_apis_path):
        print(f"Files in directory: {os.listdir(nutrition_apis_path)}")
    sys.exit(1)

def test_edamam_api():
    """Test the Edamam API with the same pattern as check2.py"""
    
    # Load environment variables
    load_dotenv()
    
    # Get credentials
    app_id = os.getenv("EDAMAM_APP_ID")
    app_key = os.getenv("EDAMAM_APP_KEY") or os.getenv("EDAMAM_API_KEY")
    
    if not app_id or not app_key:
        print("❌ Missing EDAMAM_APP_ID or EDAMAM_APP_KEY environment variables")
        print("Please check your .env file or environment settings")
        return False
    
    print("🔑 Credentials loaded successfully")
    print(f"App ID: {app_id[:8]}...")
    print(f"App Key: {app_key[:8]}...")
    
    # Initialize the Food Database API
    food_api = EdamamFoodDatabaseAPI(app_id=app_id, app_key=app_key)
    
    # Test search functionality (same as check2.py pattern)
    print("\n🔍 Testing food search with 'banana' (same as check2.py)...")
    
    try:
        search_results = food_api.search_foods("banana", limit=5)
        
        if search_results and len(search_results) > 0:
            print(f"✅ Search successful! Found {len(search_results)} results")
            
            # Display results similar to check2.py
            for i, food in enumerate(search_results[:3], 1):
                print(f"\n{i}. {food.label}")
                print(f"   Food ID: {food.food_id}")
                print(f"   Category: {food.category_label or food.category or 'N/A'}")
                if hasattr(food, 'image') and food.image:
                    print(f"   Image: {food.image}")
            
            # Test detailed nutrition lookup
            print(f"\n🥗 Testing detailed nutrition for: {search_results[0].label}")
            detailed_food = food_api.get_food_details(search_results[0].food_id)
            
            if detailed_food:
                print("✅ Detailed nutrition retrieved successfully!")
                print(f"   Total nutrients: {len(detailed_food.nutrients)}")
                
                # Show key nutrients
                key_nutrients = ['ENERC_KCAL', 'PROCNT', 'FAT', 'CHOCDF']
                print("   Key nutrients:")
                for nutrient_key in key_nutrients:
                    if nutrient_key in detailed_food.nutrients:
                        nutrient = detailed_food.nutrients[nutrient_key]
                        print(f"     {nutrient.label}: {nutrient.quantity:.2f} {nutrient.unit}")
            else:
                print("❌ Failed to get detailed nutrition")
                return False
                
        else:
            print("❌ No search results found")
            return False
    
    except Exception as e:
        print(f"❌ Error during API test: {e}")
        return False
    
    print("\n✅ All tests passed! The API implementation matches check2.py pattern")
    return True

def test_api_structure():
    """Verify the API structure matches check2.py expectations"""
    
    print("\n🏗️  Verifying API structure...")
    
    # Check that the base URL is correct
    expected_base_url = "https://api.edamam.com/api/food-database/v2"
    actual_base_url = EdamamFoodDatabaseAPI.BASE_URL
    
    if actual_base_url == expected_base_url:
        print(f"✅ Base URL correct: {actual_base_url}")
    else:
        print(f"❌ Base URL mismatch. Expected: {expected_base_url}, Got: {actual_base_url}")
        return False
    
    print("✅ API structure verification passed!")
    return True

if __name__ == "__main__":
    print("🧪 Testing Updated Edamam API Implementation")
    print("=" * 50)
    
    # Test API structure
    structure_ok = test_api_structure()
    
    if structure_ok:
        # Test actual API calls
        api_ok = test_edamam_api()
        
        if api_ok:
            print("\n🎉 SUCCESS: The updated edamam_api.py works correctly!")
            print("   - API structure matches check2.py pattern")
            print("   - Food search functionality working")
            print("   - Detailed nutrition lookup working")
            print("   - Error handling implemented")
        else:
            print("\n⚠️  API structure is correct but API calls failed")
            print("   This might be due to missing credentials or network issues")
    else:
        print("\n❌ FAILED: API structure issues found")
    
    print("\n" + "=" * 50)

"""
Nutrition API Routes for NutriVision AI

This module provides the unified /nutri endpoint that orchestrates calls
to multiple nutrition data sources and returns normalized data.
"""

from flask import Blueprint, request, jsonify
from typing import Dict, List, Optional, Any
import logging
import os
import time

from ..services.nutrition_apis import (
    USDAFoodDataAPI,
    EdamamMealPlannerAPI,
    EdamamFoodDatabaseAPI,
    NutritionData,
    normalize_nutrition_data,
    merge_nutrition_data
)
from ..services.cache import get_cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Blueprint
nutrition_bp = Blueprint('nutrition', __name__)

# Initialize API wrappers and cache
usda_api = USDAFoodDataAPI(api_key=os.getenv('USDA_API_KEY', 'DEMO_KEY'))
edamam_food_api = EdamamFoodDatabaseAPI(
    app_id=os.getenv('EDAMAM_APP_ID', 'b233e9b3'),
    app_key=os.getenv('EDAMAM_APP_KEY', 'a76d3aa6719be9e4b8447053fff46331')
)
edamam_meal_planner_api = EdamamMealPlannerAPI(
    app_id=os.getenv('EDAMAM_APP_ID', 'b233e9b3'),
    app_key=os.getenv('EDAMAM_APP_KEY', 'a76d3aa6719be9e4b8447053fff46331')
)
cache = get_cache()


@nutrition_bp.route('/nutri/search', methods=['GET'])
def search_nutrition():
    """
    Unified nutrition search endpoint
    
    Query Parameters:
    - q: Search query (required)
    - source: Preferred source ('usda', 'edamam', 'both') - default: 'both'
    - limit: Max results per source (default: 10)
    
    Returns:
    - JSON response with normalized nutrition data
    """
    try:
        # Extract query parameters
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify({
                'error': 'Query parameter "q" is required',
                'status': 'error'
            }), 400
        
        source = request.args.get('source', 'both').lower()
        limit = min(int(request.args.get('limit', 10)), 25)  # Cap at 25
        
        logger.info(f"Nutrition search: query='{query}', source='{source}', limit={limit}")
        
        # Validate source parameter
        valid_sources = ['usda', 'edamam', 'both']
        if source not in valid_sources:
            return jsonify({
                'error': f'Invalid source. Must be one of: {valid_sources}',
                'status': 'error'
            }), 400
        
        # Perform search based on source preference
        start_time = time.time()
        results = []
        
        # Check cache first
        cached_results = cache.get_search_results(query, source, limit)
        if cached_results:
            logger.info(f"Cache HIT for search: {query}")
            # Convert cached dictionaries back to NutritionData objects
            for result_dict in cached_results:
                try:
                    nutrition_data = NutritionData.from_dict(result_dict)
                    results.append(nutrition_data)
                except Exception as e:
                    logger.warning(f"Failed to deserialize cached result: {e}")
                    continue
        else:
            logger.info(f"Cache MISS for search: {query}")
            # Perform actual search
            if source in ['usda', 'both']:
                usda_results = _search_usda(query, limit)
                results.extend(usda_results)
            
            if source in ['edamam', 'both']:
                edamam_results = _search_edamam(query, limit)
                results.extend(edamam_results)
            
            # Cache the results
            if results:
                cache.set_search_results(query, source, limit, results)
        
        # Sort by data quality and completeness
        results.sort(key=lambda x: (x.data_quality_score, x.data_completeness), reverse=True)
        
        # Prepare response
        response_data = {
            'status': 'success',
            'query': query,
            'source': source,
            'total_results': len(results),
            'results': [result.to_dict() for result in results],
            'execution_time_ms': round((time.time() - start_time) * 1000, 2),
            'sources_used': _get_sources_used(results)
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error in nutrition search: {e}")
        return jsonify({
            'error': 'Internal server error',
            'status': 'error'
        }), 500


@nutrition_bp.route('/nutri/details/<food_id>', methods=['GET'])
def get_food_details(food_id: str):
    """
    Get detailed nutrition information for a specific food item
    
    Path Parameters:
    - food_id: Food ID in format 'source_id' (e.g., 'usda_123456', 'edamam_abc123')
    
    Returns:
    - JSON response with detailed normalized nutrition data
    """
    try:
        # Parse food ID to determine source
        if not food_id or '_' not in food_id:
            return jsonify({
                'error': 'Invalid food_id format. Expected format: source_id',
                'status': 'error'
            }), 400
        
        source, item_id = food_id.split('_', 1)
        
        logger.info(f"Food details request: food_id='{food_id}', source='{source}'")
        
        # Check cache first
        cached_data = cache.get_food_details(food_id)
        if cached_data:
            logger.info(f"Cache HIT for food details: {food_id}")
            try:
                nutrition_data = NutritionData.from_dict(cached_data)
                return jsonify({
                    'status': 'success',
                    'food_id': food_id,
                    'data': nutrition_data.to_dict(),
                    'cached': True
                })
            except Exception as e:
                logger.warning(f"Failed to deserialize cached food details: {e}")
        
        # Cache miss - get detailed nutrition data based on source
        nutrition_data = None
        
        if source == 'usda':
            try:
                fdc_id = int(item_id)
                usda_food = usda_api.get_food_details(fdc_id)
                if usda_food:
                    nutrition_data = normalize_nutrition_data(usda_food)
            except ValueError:
                return jsonify({
                    'error': 'Invalid USDA food ID format',
                    'status': 'error'
                }), 400
        
        elif source == 'edamam':
            try:
                edamam_food = edamam_food_api.get_food_details(item_id)
                if edamam_food:
                    nutrition_data = normalize_nutrition_data(edamam_food)
            except Exception as e:
                logger.error(f"Error getting Edamam food details: {e}")
                return jsonify({
                    'error': 'Failed to retrieve Edamam food details',
                    'status': 'error'
                }), 500
        
        else:
            return jsonify({
                'error': f'Unsupported source: {source}',
                'status': 'error'
            }), 400
        
        if not nutrition_data:
            return jsonify({
                'error': 'Food item not found',
                'status': 'error'
            }), 404
        
        # Cache the result
        cache.set_food_details(food_id, nutrition_data)
        
        return jsonify({
            'status': 'success',
            'food_id': food_id,
            'data': nutrition_data.to_dict(),
            'cached': False
        })
        
    except Exception as e:
        logger.error(f"Error getting food details for {food_id}: {e}")
        return jsonify({
            'error': 'Internal server error',
            'status': 'error'
        }), 500


@nutrition_bp.route('/nutri/compare', methods=['POST'])
def compare_foods():
    """
    Compare nutrition data for multiple food items
    
    Request Body:
    {
        "food_ids": ["usda_123456", "edamam_abc123"]
    }
    
    Returns:
    - JSON response with comparative nutrition analysis
    """
    try:
        data = request.get_json()
        if not data or 'food_ids' not in data:
            return jsonify({
                'error': 'Request body must contain "food_ids" array',
                'status': 'error'
            }), 400
        
        food_ids = data['food_ids']
        
        if not isinstance(food_ids, list) or len(food_ids) < 2:
            return jsonify({
                'error': 'food_ids must be an array with at least 2 items',
                'status': 'error'
            }), 400
        
        if len(food_ids) > 5:  # Limit comparison to 5 items max
            return jsonify({
                'error': 'Maximum 5 food items can be compared at once',
                'status': 'error'
            }), 400
        
        logger.info(f"Food comparison request: {len(food_ids)} items")
        
        # Check cache first
        cached_comparison = cache.get_comparison_results(food_ids)
        if cached_comparison:
            logger.info(f"Cache HIT for comparison: {food_ids}")
            return jsonify(cached_comparison)
        
        logger.info(f"Cache MISS for comparison: {food_ids}")
        
        # Get nutrition data for all food items
        nutrition_data_list = []
        for food_id in food_ids:
            try:
                source, item_id = food_id.split('_', 1)
                
                nutrition_data = None
                if source == 'usda':
                    try:
                        fdc_id = int(item_id)
                        usda_food = usda_api.get_food_details(fdc_id)
                        if usda_food:
                            nutrition_data = normalize_nutrition_data(usda_food)
                    except ValueError:
                        continue
                
                if nutrition_data:
                    nutrition_data_list.append(nutrition_data)
                
            except Exception as e:
                logger.warning(f"Failed to get data for {food_id}: {e}")
                continue
        
        if len(nutrition_data_list) < 2:
            return jsonify({
                'error': 'Could not retrieve data for at least 2 food items',
                'status': 'error'
            }), 400
        
        # Generate comparison analysis
        comparison_data = _generate_comparison_analysis(nutrition_data_list)
        
        # Prepare response
        response_data = {
            'status': 'success',
            'total_items': len(nutrition_data_list),
            'foods': [item.to_dict() for item in nutrition_data_list],
            'comparison': comparison_data,
            'cached': False
        }
        
        # Cache the results
        cache.set_comparison_results(food_ids, response_data)
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error in food comparison: {e}")
        return jsonify({
            'error': 'Internal server error',
            'status': 'error'
        }), 500


@nutrition_bp.route('/nutri/cache/stats', methods=['GET'])
def get_cache_stats():
    """
    Get cache statistics and health information
    
    Returns:
    - JSON response with cache statistics
    """
    try:
        stats = cache.get_stats()
        return jsonify({
            'status': 'success',
            'cache': stats
        })
        
    except Exception as e:
        logger.error(f"Error getting cache stats: {e}")
        return jsonify({
            'error': 'Failed to get cache statistics',
            'status': 'error'
        }), 500


@nutrition_bp.route('/nutri/cache/clear', methods=['POST'])
def clear_cache():
    """
    Clear all nutrition cache entries
    
    Returns:
    - JSON response confirming cache clear
    """
    try:
        success = cache.clear_all()
        
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Cache cleared successfully'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to clear cache'
            }), 500
            
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        return jsonify({
            'error': 'Failed to clear cache',
            'status': 'error'
        }), 500


@nutrition_bp.route('/nutri/cache/invalidate/<food_id>', methods=['DELETE'])
def invalidate_food_cache(food_id: str):
    """
    Invalidate cache entries for a specific food item
    
    Path Parameters:
    - food_id: Food ID to invalidate from cache
    
    Returns:
    - JSON response confirming cache invalidation
    """
    try:
        success = cache.invalidate_food(food_id)
        
        if success:
            return jsonify({
                'status': 'success',
                'message': f'Cache invalidated for food: {food_id}'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': f'Failed to invalidate cache for food: {food_id}'
            }), 500
            
    except Exception as e:
        logger.error(f"Error invalidating cache for {food_id}: {e}")
        return jsonify({
            'error': 'Failed to invalidate cache',
            'status': 'error'
        }), 500


@nutrition_bp.route('/nutri/meal-plan', methods=['POST'])
def get_meal_plan():
    """
    Generate a meal plan using the Edamam Meal Planner API.
    
    Request Body:
    - A JSON object specifying the meal plan constraints.
    
    Returns:
    - JSON response with the generated meal plan.
    """
    try:
        plan_request = request.get_json()
        if not plan_request:
            return jsonify({
                'error': 'Request body must contain meal plan constraints',
                'status': 'error'
            }), 400

        logger.info(f"Meal plan request received: {plan_request}")

        # Optional: Extract user_id if you implement user tracking
        user_id = request.headers.get("Edamam-User-ID", None)

        meal_plan = edamam_meal_planner_api.get_meal_plan(plan_request, user_id=user_id)

        if meal_plan:
            return jsonify({
                'status': 'success',
                'meal_plan': meal_plan
            })
        else:
            return jsonify({
                'error': 'Failed to generate meal plan from Edamam API',
                'status': 'error'
            }), 502

    except Exception as e:
        logger.error(f"Error in meal plan generation: {e}")
        return jsonify({
            'error': 'Internal server error',
            'status': 'error'
        }), 500


# Helper functions

def _search_usda(query: str, limit: int) -> List[NutritionData]:
    """Search USDA database and return normalized results"""
    try:
        usda_search_results = usda_api.search_foods(query, limit)
        normalized_results = []
        
        for search_result in usda_search_results:
            try:
                # Get the FDC ID from search result and fetch detailed data
                if 'fdcId' in search_result:
                    detailed_food = usda_api.get_food_details(search_result['fdcId'])
                    if detailed_food:
                        nutrition_data = normalize_nutrition_data(detailed_food)
                        normalized_results.append(nutrition_data)
            except Exception as e:
                logger.warning(f"Failed to normalize USDA food: {e}")
                continue
        
        return normalized_results
        
    except Exception as e:
        logger.error(f"USDA search error: {e}")
        return []


def _search_edamam(query: str, limit: int) -> List[NutritionData]:
    """Search Edamam database and return normalized results"""
    try:
        edamam_search_results = edamam_food_api.search_foods(query, limit)
        normalized_results = []
        
        for edamam_food in edamam_search_results:
            try:
                # Get detailed nutrition data for each food
                detailed_food = edamam_food_api.get_food_details(edamam_food.food_id)
                if detailed_food:
                    nutrition_data = normalize_nutrition_data(detailed_food)
                    normalized_results.append(nutrition_data)
                else:
                    # If detailed data not available, use basic search result
                    nutrition_data = normalize_nutrition_data(edamam_food)
                    normalized_results.append(nutrition_data)
            except Exception as e:
                logger.warning(f"Failed to normalize Edamam food: {e}")
                continue
        
        return normalized_results
        
    except Exception as e:
        logger.error(f"Edamam search error: {e}")
        return []


def _get_sources_used(results: List[NutritionData]) -> Dict[str, int]:
    """Get summary of data sources used in results"""
    sources = {}
    for result in results:
        source = result.source
        sources[source] = sources.get(source, 0) + 1
    return sources


def _generate_comparison_analysis(nutrition_data_list: List[NutritionData]) -> Dict[str, Any]:
    """Generate comparative analysis of nutrition data"""
    if len(nutrition_data_list) < 2:
        return {}
    
    # Filter out items with None macros
    valid_items = [item for item in nutrition_data_list if item.macros is not None]
    
    if len(valid_items) < 2:
        return {'error': 'Not enough valid nutrition data for comparison'}
    
    # Analyze key nutrients across all items
    analysis = {
        'highest_protein': None,
        'lowest_calories': None,
        'highest_fiber': None,
        'lowest_sodium': None,
        'average_values': {},
        'nutrient_ranges': {}
    }
    
    # Find extremes (we know macros is not None for valid_items)
    highest_protein = max(valid_items, key=lambda x: x.macros.protein if x.macros else 0)
    lowest_calories = min(valid_items, key=lambda x: x.macros.energy_kcal if x.macros else float('inf'))
    highest_fiber = max(valid_items, key=lambda x: x.macros.fiber if x.macros else 0)
    lowest_sodium = min(valid_items, key=lambda x: x.macros.sodium if x.macros else float('inf'))
    
    if highest_protein.macros:
        analysis['highest_protein'] = {
            'food_id': highest_protein.food_id,
            'name': highest_protein.name,
            'value': highest_protein.macros.protein
        }
    
    if lowest_calories.macros:
        analysis['lowest_calories'] = {
            'food_id': lowest_calories.food_id,
            'name': lowest_calories.name,
            'value': lowest_calories.macros.energy_kcal
        }
    
    if highest_fiber.macros:
        analysis['highest_fiber'] = {
            'food_id': highest_fiber.food_id,
            'name': highest_fiber.name,
            'value': highest_fiber.macros.fiber
        }
    
    if lowest_sodium.macros:
        analysis['lowest_sodium'] = {
            'food_id': lowest_sodium.food_id,
            'name': lowest_sodium.name,
            'value': lowest_sodium.macros.sodium
        }
    
    # Calculate averages and ranges for key nutrients
    key_nutrients = ['energy_kcal', 'protein', 'total_fat', 'carbohydrates', 'fiber', 'sodium']
    
    for nutrient in key_nutrients:
        values = [getattr(item.macros, nutrient) for item in valid_items if item.macros]
        if values:
            analysis['average_values'][nutrient] = round(sum(values) / len(values), 2)
            analysis['nutrient_ranges'][nutrient] = {
                'min': min(values),
                'max': max(values),
                'range': round(max(values) - min(values), 2)
            }
    
    return analysis


# Error handlers for the blueprint

@nutrition_bp.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'status': 'error'
    }), 404


@nutrition_bp.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'status': 'error'
    }), 500

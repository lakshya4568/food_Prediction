"""
Simple Nutrition API Routes for Testing
Basic routes to test the nutrition API functionality
"""

from flask import Blueprint, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Blueprint
nutrition_bp = Blueprint('nutrition', __name__)

@nutrition_bp.route('/nutri/search', methods=['GET'])
def search_nutrition():
    """
    Simple nutrition search endpoint for testing
    
    Query Parameters:
    - query: Search query
    - limit: Max results (default: 10)
    
    Returns:
    - JSON response with mock nutrition data
    """
    try:
        query = request.args.get('query', '')
        limit = int(request.args.get('limit', 10))
        
        if not query:
            return jsonify({'error': 'Query parameter required'}), 400
        
        # Mock response for testing
        mock_results = [
            {
                'id': f'food_{i}',
                'name': f'{query} food item {i}',
                'calories': 100 + i * 10,
                'protein': 5 + i,
                'carbs': 20 + i,
                'fat': 2 + i
            }
            for i in range(1, min(limit + 1, 6))
        ]
        
        response = {
            'query': query,
            'total_results': len(mock_results),
            'results': mock_results,
            'status': 'success'
        }
        
        logger.info(f"Nutrition search request: query={query}, limit={limit}")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Nutrition search error: {e}")
        return jsonify({'error': str(e)}), 500

@nutrition_bp.route('/nutri/details/<food_id>', methods=['GET'])
def get_nutrition_details(food_id):
    """
    Get detailed nutrition information for a specific food item
    """
    try:
        # Mock detailed nutrition data
        detailed_nutrition = {
            'id': food_id,
            'name': f'Food item {food_id}',
            'nutrition': {
                'calories': 150,
                'protein': 8,
                'carbs': 25,
                'fat': 3,
                'fiber': 5,
                'sugar': 10,
                'sodium': 200,
                'vitamins': {
                    'vitamin_c': '15mg',
                    'vitamin_a': '500IU'
                }
            },
            'serving_size': '100g'
        }
        
        logger.info(f"Nutrition details request: food_id={food_id}")
        return jsonify(detailed_nutrition), 200
        
    except Exception as e:
        logger.error(f"Nutrition details error: {e}")
        return jsonify({'error': str(e)}), 500

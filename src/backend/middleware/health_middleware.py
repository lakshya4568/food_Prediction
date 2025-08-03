"""
Health from ..models import health_db, HealthProfile, WHOICMRGuidelines
from ..services.adaptive_nutrient_engine import adaptive_engine, get_adaptive_targetsofile Middleware for NutriVision AI

This module provides middleware functionality to inject user health profile data
into nutrition API requests and responses, enabling personalized nutrition recommendations.
"""

from functools import wraps
from typing import Optional, Dict, Any, Callable, List
from flask import request, g, jsonify
import json

from ..models import health_db, HealthProfile, WHOICMRGuidelines
from ..services.adaptive_nutrient_engine import get_adaptive_targets


class HealthProfileMiddleware:
    """
    Middleware for injecting health profile data into nutrition API requests
    """
    
    def __init__(self):
        self.excluded_endpoints = {
            '/health', '/api/health/profile', '/predict',
            '/api/health/reference/', '/api/health/profiles'
        }
    
    def should_inject_profile(self, endpoint: str) -> bool:
        """
        Determine if health profile should be injected for this endpoint
        
        Args:
            endpoint: The request endpoint
            
        Returns:
            bool: True if profile should be injected
        """
        # Skip excluded endpoints
        for excluded in self.excluded_endpoints:
            if endpoint.startswith(excluded):
                return False
        
        # Only inject for nutrition-related endpoints
        nutrition_endpoints = [
            '/get_health_info', '/api/nutrition/', '/api/meal/',
            '/api/recommendation/', '/nutri'
        ]
        
        return any(endpoint.startswith(ep) for ep in nutrition_endpoints)
    
    def get_user_id_from_request(self) -> Optional[str]:
        """
        Extract user ID from request headers, query params, or body
        
        Returns:
            str: User ID if found, None otherwise
        """
        # Try headers first
        user_id = request.headers.get('X-User-ID')
        if user_id:
            return user_id
        
        # Try query parameters
        user_id = request.args.get('user_id')
        if user_id:
            return user_id
        
        # Try request body for JSON requests
        if request.is_json:
            data = request.get_json(silent=True)
            if data and isinstance(data, dict):
                user_id = data.get('user_id')
                if user_id:
                    return user_id
        
        # Try form data
        user_id = request.form.get('user_id')
        if user_id:
            return user_id
        
        return None
    
    def load_health_profile(self, user_id: str) -> Optional[HealthProfile]:
        """
        Load health profile from database
        
        Args:
            user_id: User identifier
            
        Returns:
            HealthProfile: User's health profile if found
        """
        try:
            return health_db.get_profile(user_id)
        except Exception as e:
            print(f"Error loading health profile for user {user_id}: {e}")
            return None
    
    def inject_profile_data(self, profile: HealthProfile) -> Dict[str, Any]:
        """
        Extract relevant profile data for injection into API requests
        
        Args:
            profile: User's health profile
            
        Returns:
            dict: Profile data formatted for API injection
        """
        # Get adaptive nutrient targets
        adaptive_targets = get_adaptive_targets(profile)
        
        return {
            'user_profile': {
                'user_id': profile.user_id,
                'age': profile.age,
                'gender': profile.gender.value,
                'height': profile.height,
                'weight': profile.weight,
                'bmi': profile.bmi,
                'bmi_category': profile.bmi_category,
                'activity_level': profile.activity_level.value,
                'tdee': adaptive_targets.adjusted_target.calories,
                'weight_goal': profile.weight_goal,
                'allergies': [
                    {
                        'allergen': allergy.allergen,
                        'severity': allergy.severity,
                        'symptoms': allergy.symptoms
                    }
                    for allergy in profile.allergies
                ],
                'chronic_conditions': [condition.value for condition in profile.chronic_conditions],
                'dietary_preferences': profile.dietary_preferences,
                'medications': profile.medications
            },
            'adaptive_targets': adaptive_targets.to_dict(),
            'guidelines_info': {
                'age_group': WHOICMRGuidelines.get_age_group(profile.age).value,
                'applied_conditions': [condition.value for condition in profile.chronic_conditions],
                'source': 'WHO/ICMR Guidelines with Adaptive Engine',
                'confidence_score': adaptive_targets.confidence_score
            }
        }
    
    def before_request(self):
        """
        Flask before_request handler to inject health profile data
        """
        # Skip if not a nutrition endpoint
        if not self.should_inject_profile(request.endpoint or ''):
            return
        
        # Get user ID
        user_id = self.get_user_id_from_request()
        if not user_id:
            # No user ID found - continue without profile injection
            g.health_profile = None
            g.health_profile_data = None
            return
        
        # Load health profile
        profile = self.load_health_profile(user_id)
        if not profile:
            # Profile not found - continue without profile injection
            g.health_profile = None
            g.health_profile_data = None
            return
        
        # Inject profile data into Flask's g object for access in route handlers
        g.health_profile = profile
        g.health_profile_data = self.inject_profile_data(profile)
    
    def enhance_response(self, response_data: Dict[str, Any], 
                        include_recommendations: bool = True) -> Dict[str, Any]:
        """
        Enhance API response with personalized health recommendations
        
        Args:
            response_data: Original API response data
            include_recommendations: Whether to include health recommendations
            
        Returns:
            dict: Enhanced response with health context
        """
        if not hasattr(g, 'health_profile') or not g.health_profile:
            return response_data
        
        enhanced_response = response_data.copy()
        
        # Add health profile context
        enhanced_response['health_context'] = {
            'profile_applied': True,
            'user_id': g.health_profile.user_id,
            'nutrient_targets': g.health_profile_data['nutrient_targets'],
            'dietary_restrictions': {
                'allergies': [allergy['allergen'] for allergy in g.health_profile_data['user_profile']['allergies']],
                'conditions': g.health_profile_data['user_profile']['chronic_conditions'],
                'preferences': g.health_profile_data['user_profile']['dietary_preferences']
            }
        }
        
        if include_recommendations:
            enhanced_response['personalized_recommendations'] = self._generate_recommendations(
                response_data, g.health_profile
            )
        
        return enhanced_response
    
    def _generate_recommendations(self, response_data: Dict[str, Any], 
                                profile: HealthProfile) -> Dict[str, Any]:
        """
        Generate personalized recommendations based on health profile
        
        Args:
            response_data: Original API response
            profile: User's health profile
            
        Returns:
            dict: Personalized recommendations
        """
        recommendations = {
            'portion_advice': [],
            'health_alerts': [],
            'dietary_tips': []
        }
        
        # Check for food allergies
        if 'food_name' in response_data or 'class' in response_data:
            food_name = response_data.get('food_name', response_data.get('class', '')).lower()
            
            for allergy in profile.allergies:
                if allergy.allergen.lower() in food_name:
                    recommendations['health_alerts'].append({
                        'type': 'allergy_warning',
                        'severity': allergy.severity,
                        'message': f"⚠️ Contains {allergy.allergen} - {allergy.severity} allergy risk",
                        'symptoms': allergy.symptoms
                    })
        
        # Condition-specific recommendations
        nutrient_targets = profile.get_nutrient_targets()
        
        if profile.chronic_conditions:
            first_condition = profile.chronic_conditions[0]
            if profile.has_condition(first_condition):
                if any(cond.value in ['diabetes_type_1', 'diabetes_type_2'] for cond in profile.chronic_conditions):
                    recommendations['dietary_tips'].append({
                        'type': 'diabetes_management',
                        'message': "Monitor carbohydrate content and consider timing with medication",
                        'target_carbs': f"{nutrient_targets.carbohydrates:.1f}g daily"
                    })
                
                if any(cond.value == 'hypertension' for cond in profile.chronic_conditions):
                    recommendations['dietary_tips'].append({
                        'type': 'blood_pressure_management',
                        'message': f"Keep sodium under {nutrient_targets.sodium}mg daily",
                        'sodium_limit': nutrient_targets.sodium
                    })
        
        # Weight goal recommendations
        if profile.weight_goal:
            if profile.weight_goal == 'lose':
                recommendations['portion_advice'].append({
                    'type': 'weight_loss',
                    'message': f"Consider a smaller portion to stay within {nutrient_targets.calories:.0f} daily calories"
                })
            elif profile.weight_goal == 'gain':
                recommendations['portion_advice'].append({
                    'type': 'weight_gain',
                    'message': f"You can enjoy a larger portion - target {nutrient_targets.calories:.0f} daily calories"
                })
        
        return recommendations


# Global middleware instance
health_middleware = HealthProfileMiddleware()


def with_health_profile(include_recommendations: bool = True):
    """
    Decorator to inject health profile data into route handlers
    
    Args:
        include_recommendations: Whether to include personalized recommendations
        
    Usage:
        @app.route('/api/nutrition/analyze')
        @with_health_profile()
        def analyze_nutrition():
            # Access profile via g.health_profile and g.health_profile_data
            return jsonify(response)
    """
    def decorator(f: Callable) -> Callable:
        @wraps(f)
        def wrapper(*args, **kwargs):
            # Call the original function
            result = f(*args, **kwargs)
            
            # If result is a Flask Response object, try to enhance it
            if hasattr(result, 'get_json'):
                try:
                    response_data = result.get_json()
                    if response_data:
                        enhanced_data = health_middleware.enhance_response(
                            response_data, include_recommendations
                        )
                        result.data = json.dumps(enhanced_data)
                except:
                    pass  # If enhancement fails, return original response
            
            # If result is a dict, enhance it directly
            elif isinstance(result, dict):
                result = health_middleware.enhance_response(
                    result, include_recommendations
                )
            
            # If result is a tuple (data, status_code), enhance the data
            elif isinstance(result, tuple) and len(result) >= 2:
                data, status_code = result[0], result[1]
                if isinstance(data, dict):
                    enhanced_data = health_middleware.enhance_response(
                        data, include_recommendations
                    )
                    result = (enhanced_data, status_code) + result[2:]
            
            return result
        
        return wrapper
    return decorator


def get_user_health_context() -> Optional[Dict[str, Any]]:
    """
    Get the current user's health context from Flask's g object
    
    Returns:
        dict: Health profile data if available, None otherwise
    """
    return getattr(g, 'health_profile_data', None)


def get_user_profile() -> Optional[HealthProfile]:
    """
    Get the current user's health profile from Flask's g object
    
    Returns:
        HealthProfile: User's health profile if available, None otherwise
    """
    return getattr(g, 'health_profile', None)


def check_food_allergies(food_name: str) -> List[Dict[str, Any]]:
    """
    Check if food contains any allergens for the current user
    
    Args:
        food_name: Name of the food to check
        
    Returns:
        list: List of allergy warnings
    """
    profile = get_user_profile()
    if not profile:
        return []
    
    warnings = []
    food_lower = food_name.lower()
    
    for allergy in profile.allergies:
        if allergy.allergen.lower() in food_lower:
            warnings.append({
                'allergen': allergy.allergen,
                'severity': allergy.severity,
                'symptoms': allergy.symptoms,
                'message': f"Contains {allergy.allergen} - {allergy.severity} allergy risk"
            })
    
    return warnings

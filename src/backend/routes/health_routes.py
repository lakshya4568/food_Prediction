"""
Health Profile API Routes for NutriVision

This module contains Flask route handlers for managing user health profiles.
Provides RESTful endpoints for CRUD operations on health profiles.
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
from typing import Dict, Any

from ..models import (
    HealthProfile, HealthProfileValidator, health_db,
    Gender, ActivityLevel, ChronicCondition, AllergyInfo
)

# Create blueprint for health profile routes
health_bp = Blueprint('health', __name__, url_prefix='/api/health')


@health_bp.route('/profile', methods=['POST'])
def create_profile():
    """
    Create a new user health profile
    
    Request Body:
    {
        "user_id": "optional-user-id",
        "age": 25,
        "gender": "male|female|other", 
        "height": 175.5,
        "weight": 70.0,
        "activity_level": "moderately_active",
        "allergies": [
            {
                "allergen": "peanuts",
                "severity": "severe",
                "symptoms": ["hives", "breathing_difficulty"]
            }
        ],
        "chronic_conditions": ["diabetes_type_2", "hypertension"],
        "medications": ["metformin", "lisinopril"],
        "dietary_preferences": ["vegetarian", "low_sodium"],
        "weight_goal": "lose|maintain|gain",
        "target_weight": 65.0
    }
    
    Returns:
        201: Profile created successfully
        400: Validation errors or invalid data
        409: Profile already exists for user_id
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        validation_errors = HealthProfileValidator.validate_profile_data(data)
        if validation_errors:
            return jsonify({'error': 'Validation failed', 'details': validation_errors}), 400
        
        # Parse allergies
        allergies = []
        if 'allergies' in data and data['allergies']:
            for allergy_data in data['allergies']:
                try:
                    allergy = AllergyInfo(
                        allergen=allergy_data['allergen'],
                        severity=allergy_data['severity'],
                        symptoms=allergy_data.get('symptoms', [])
                    )
                    allergies.append(allergy)
                except KeyError as e:
                    return jsonify({'error': f'Missing required field in allergy: {e}'}), 400
        
        # Parse chronic conditions
        chronic_conditions = []
        if 'chronic_conditions' in data and data['chronic_conditions']:
            try:
                chronic_conditions = [ChronicCondition(condition) for condition in data['chronic_conditions']]
            except ValueError as e:
                return jsonify({'error': f'Invalid chronic condition: {e}'}), 400
        
        # Create health profile
        try:
            profile = HealthProfile(
                user_id=data.get('user_id', ''),  # Will generate UUID if empty
                age=int(data['age']),
                gender=Gender(data['gender']),
                height=float(data['height']),
                weight=float(data['weight']),
                activity_level=ActivityLevel(data['activity_level']),
                allergies=allergies,
                chronic_conditions=chronic_conditions,
                medications=data.get('medications', []),
                dietary_preferences=data.get('dietary_preferences', []),
                weight_goal=data.get('weight_goal'),
                target_weight=float(data['target_weight']) if data.get('target_weight') else None
            )
        except ValueError as e:
            return jsonify({'error': f'Invalid data: {e}'}), 400
        
        # Save to database
        if health_db.create_profile(profile):
            return jsonify({
                'message': 'Profile created successfully',
                'user_id': profile.user_id,
                'profile': profile.to_dict()
            }), 201
        else:
            return jsonify({'error': 'Profile already exists for this user_id'}), 409
            
    except Exception as e:
        print(f"Error creating health profile: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@health_bp.route('/profile/<user_id>', methods=['GET'])
def get_profile(user_id: str):
    """
    Retrieve a user's health profile by user_id
    
    Path Parameters:
        user_id: User identifier
    
    Returns:
        200: Profile data with calculated values
        404: Profile not found
    """
    try:
        profile = health_db.get_profile(user_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        profile_data = profile.to_dict()
        
        # Add nutrient targets
        nutrient_targets = profile.get_nutrient_targets()
        profile_data['nutrient_targets'] = nutrient_targets.to_dict()
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        print(f"Error retrieving health profile: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@health_bp.route('/profile/<user_id>', methods=['PUT'])
def update_profile(user_id: str):
    """
    Update an existing user health profile
    
    Path Parameters:
        user_id: User identifier
        
    Request Body: Same as create_profile (all fields optional except required ones)
    
    Returns:
        200: Profile updated successfully
        400: Validation errors
        404: Profile not found
    """
    try:
        # Check if profile exists
        existing_profile = health_db.get_profile(user_id)
        if not existing_profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data (only validate provided fields)
        validation_errors = HealthProfileValidator.validate_profile_data(data)
        if validation_errors:
            return jsonify({'error': 'Validation failed', 'details': validation_errors}), 400
        
        # Update profile fields
        if 'age' in data:
            existing_profile.age = int(data['age'])
        if 'gender' in data:
            existing_profile.gender = Gender(data['gender'])
        if 'height' in data:
            existing_profile.height = float(data['height'])
        if 'weight' in data:
            existing_profile.weight = float(data['weight'])
        if 'activity_level' in data:
            existing_profile.activity_level = ActivityLevel(data['activity_level'])
        
        # Update allergies
        if 'allergies' in data:
            allergies = []
            for allergy_data in data['allergies']:
                try:
                    allergy = AllergyInfo(
                        allergen=allergy_data['allergen'],
                        severity=allergy_data['severity'],
                        symptoms=allergy_data.get('symptoms', [])
                    )
                    allergies.append(allergy)
                except KeyError as e:
                    return jsonify({'error': f'Missing required field in allergy: {e}'}), 400
            existing_profile.allergies = allergies
        
        # Update chronic conditions
        if 'chronic_conditions' in data:
            try:
                existing_profile.chronic_conditions = [ChronicCondition(condition) for condition in data['chronic_conditions']]
            except ValueError as e:
                return jsonify({'error': f'Invalid chronic condition: {e}'}), 400
        
        # Update other fields
        if 'medications' in data:
            existing_profile.medications = data['medications']
        if 'dietary_preferences' in data:
            existing_profile.dietary_preferences = data['dietary_preferences']
        if 'weight_goal' in data:
            existing_profile.weight_goal = data['weight_goal']
        if 'target_weight' in data:
            existing_profile.target_weight = float(data['target_weight']) if data['target_weight'] else None
        
        # Save updated profile
        if health_db.update_profile(existing_profile):
            profile_data = existing_profile.to_dict()
            nutrient_targets = existing_profile.get_nutrient_targets()
            profile_data['nutrient_targets'] = nutrient_targets.to_dict()
            
            return jsonify({
                'message': 'Profile updated successfully',
                'profile': profile_data
            }), 200
        else:
            return jsonify({'error': 'Failed to update profile'}), 500
            
    except Exception as e:
        print(f"Error updating health profile: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@health_bp.route('/profile/<user_id>', methods=['DELETE'])
def delete_profile(user_id: str):
    """
    Delete a user's health profile
    
    Path Parameters:
        user_id: User identifier
    
    Returns:
        200: Profile deleted successfully
        404: Profile not found
    """
    try:
        if health_db.delete_profile(user_id):
            return jsonify({'message': 'Profile deleted successfully'}), 200
        else:
            return jsonify({'error': 'Profile not found'}), 404
            
    except Exception as e:
        print(f"Error deleting health profile: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@health_bp.route('/profiles', methods=['GET'])
def list_profiles():
    """
    List all health profiles with pagination
    
    Query Parameters:
        limit: Maximum number of profiles to return (default: 100)
        offset: Number of profiles to skip (default: 0)
    
    Returns:
        200: List of profiles
    """
    try:
        limit = min(int(request.args.get('limit', 100)), 1000)  # Cap at 1000
        offset = int(request.args.get('offset', 0))
        
        profiles = health_db.list_profiles(limit=limit, offset=offset)
        
        return jsonify({
            'profiles': [profile.to_dict() for profile in profiles],
            'count': len(profiles),
            'limit': limit,
            'offset': offset
        }), 200
        
    except Exception as e:
        print(f"Error listing health profiles: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@health_bp.route('/profile/<user_id>/summary', methods=['GET'])
def get_profile_summary(user_id: str):
    """
    Get a summary of user's health profile for quick access
    
    Path Parameters:
        user_id: User identifier
    
    Returns:
        200: Profile summary with calculated values
        404: Profile not found
    """
    try:
        summary = health_db.get_profile_summary(user_id)
        if not summary:
            return jsonify({'error': 'Profile not found'}), 404
        
        return jsonify(summary), 200
        
    except Exception as e:
        print(f"Error retrieving profile summary: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@health_bp.route('/profile/<user_id>/nutrient-targets', methods=['GET'])
def get_nutrient_targets(user_id: str):
    """
    Get personalized nutrient targets for a user
    
    Path Parameters:
        user_id: User identifier
    
    Returns:
        200: Nutrient targets based on WHO/ICMR guidelines
        404: Profile not found
    """
    try:
        profile = health_db.get_profile(user_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        nutrient_targets = profile.get_nutrient_targets()
        
        return jsonify({
            'user_id': user_id,
            'nutrient_targets': nutrient_targets.to_dict(),
            'calculated_at': datetime.now().isoformat(),
            'based_on_profile': {
                'age': profile.age,
                'gender': profile.gender.value,
                'weight': profile.weight,
                'height': profile.height,
                'activity_level': profile.activity_level.value,
                'bmi': profile.bmi,
                'has_conditions': len(profile.chronic_conditions) > 0,
                'weight_goal': profile.weight_goal
            }
        }), 200
        
    except Exception as e:
        print(f"Error calculating nutrient targets: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@health_bp.route('/profile/<user_id>/exists', methods=['GET'])
def check_profile_exists(user_id: str):
    """
    Check if a health profile exists for a user
    
    Path Parameters:
        user_id: User identifier
    
    Returns:
        200: Existence status
    """
    try:
        exists = health_db.profile_exists(user_id)
        return jsonify({'exists': exists, 'user_id': user_id}), 200
        
    except Exception as e:
        print(f"Error checking profile existence: {e}")
        return jsonify({'error': 'Internal server error'}), 500


# Health information and reference endpoints
@health_bp.route('/reference/conditions', methods=['GET'])
def get_chronic_conditions():
    """
    Get list of supported chronic conditions
    
    Returns:
        200: List of chronic conditions with descriptions
    """
    conditions = [
        {'value': condition.value, 'name': condition.name} 
        for condition in ChronicCondition
    ]
    return jsonify({'chronic_conditions': conditions}), 200


@health_bp.route('/reference/activity-levels', methods=['GET'])
def get_activity_levels():
    """
    Get list of supported activity levels
    
    Returns:
        200: List of activity levels with descriptions
    """
    levels = [
        {'value': level.value, 'name': level.name} 
        for level in ActivityLevel
    ]
    return jsonify({'activity_levels': levels}), 200


@health_bp.route('/reference/genders', methods=['GET'])
def get_genders():
    """
    Get list of supported gender options
    
    Returns:
        200: List of gender options
    """
    genders = [
        {'value': gender.value, 'name': gender.name} 
        for gender in Gender
    ]
    return jsonify({'genders': genders}), 200

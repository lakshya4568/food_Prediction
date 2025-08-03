"""
Adaptive Nutrient Target Engine for NutriVision AI

This module provides intelligent calculation of personalized nutrition targets
based on user health profiles and WHO/ICMR guidelines.
"""

from typing import Dict, Any, Optional, List, Tuple
from dataclasses import dataclass
import math

from ..models.health_profile import (
    HealthProfile, NutrientTarget, Gender, ActivityLevel, ChronicCondition
)
from ..models.who_icmr_guidelines import WHOICMRGuidelines, AgeGroup


@dataclass
class AdaptiveTarget:
    """Represents adaptive nutrient targets with reasoning"""
    base_target: NutrientTarget
    adjusted_target: NutrientTarget
    adjustments: List[Dict[str, Any]]
    confidence_score: float  # 0.0 to 1.0
    source_guidelines: List[str]
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'base_target': self.base_target.to_dict(),
            'adjusted_target': self.adjusted_target.to_dict(),
            'adjustments': self.adjustments,
            'confidence_score': self.confidence_score,
            'source_guidelines': self.source_guidelines
        }


class AdaptiveNutrientEngine:
    """
    Core engine for calculating personalized nutrient targets
    """
    
    def __init__(self):
        self.guidelines = WHOICMRGuidelines()
        
        # Adjustment factors for different conditions
        self.condition_adjustments = {
            ChronicCondition.DIABETES_TYPE_1: {
                'carbohydrates': 0.85,  # Reduce carbs
                'protein': 1.1,         # Slightly increase protein
                'sodium': 0.8           # Reduce sodium
            },
            ChronicCondition.DIABETES_TYPE_2: {
                'carbohydrates': 0.75,  # More significant carb reduction
                'protein': 1.15,
                'fiber': 1.3,           # Increase fiber
                'sodium': 0.8
            },
            ChronicCondition.HYPERTENSION: {
                'sodium': 0.6,          # Significant sodium reduction
                'potassium': 1.2,       # Increase potassium (if tracked)
                'calories': 0.95        # Slight calorie reduction
            },
            ChronicCondition.HEART_DISEASE: {
                'fat': 0.8,             # Reduce total fat
                'sodium': 0.7,
                'fiber': 1.25,
                'calories': 0.9
            },
            ChronicCondition.KIDNEY_DISEASE: {
                'protein': 0.8,         # Reduce protein
                'sodium': 0.6,
                'potassium': 0.8        # Reduce potassium
            },
            ChronicCondition.OBESITY: {
                'calories': 0.8,        # Calorie deficit
                'protein': 1.2,         # Increase protein for satiety
                'fiber': 1.3
            },
            ChronicCondition.UNDERWEIGHT: {
                'calories': 1.3,        # Calorie surplus
                'protein': 1.25,
                'fat': 1.2
            }
        }
        
        # Activity level multipliers for TDEE
        self.activity_multipliers = {
            ActivityLevel.SEDENTARY: 1.2,
            ActivityLevel.LIGHTLY_ACTIVE: 1.375,
            ActivityLevel.MODERATELY_ACTIVE: 1.55,
            ActivityLevel.VERY_ACTIVE: 1.725,
            ActivityLevel.EXTREMELY_ACTIVE: 1.9
        }
    
    def calculate_adaptive_targets(self, profile: HealthProfile) -> AdaptiveTarget:
        """
        Calculate personalized nutrient targets for a user
        
        Args:
            profile: User's health profile
            
        Returns:
            AdaptiveTarget: Personalized nutrient targets with adjustments
        """
        # Get base targets from WHO/ICMR guidelines
        base_target = self._calculate_base_targets(profile)
        
        # Apply condition-specific adjustments
        adjusted_target, adjustments = self._apply_condition_adjustments(
            base_target, profile
        )
        
        # Apply goal-based adjustments
        adjusted_target, goal_adjustments = self._apply_goal_adjustments(
            adjusted_target, profile
        )
        adjustments.extend(goal_adjustments)
        
        # Calculate confidence score
        confidence = self._calculate_confidence_score(profile)
        
        # Determine source guidelines
        source_guidelines = self._get_source_guidelines(profile)
        
        return AdaptiveTarget(
            base_target=base_target,
            adjusted_target=adjusted_target,
            adjustments=adjustments,
            confidence_score=confidence,
            source_guidelines=source_guidelines
        )
    
    def _calculate_base_targets(self, profile: HealthProfile) -> NutrientTarget:
        """Calculate base nutrient targets using WHO/ICMR guidelines"""
        
        # Calculate BMR using Mifflin-St Jeor equation
        if profile.gender == Gender.MALE:
            bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
        else:
            bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
        
        # Calculate TDEE
        activity_multiplier = self.activity_multipliers[profile.activity_level]
        tdee = bmr * activity_multiplier
        
        # Get age group for micronutrient recommendations
        age_group = WHOICMRGuidelines.get_age_group(profile.age)
        
        # Base macronutrient distribution (WHO recommendations)
        protein_ratio = 0.15    # 10-15% of calories
        fat_ratio = 0.25        # 20-35% of calories
        carb_ratio = 0.60       # 45-65% of calories
        
        # Calculate macronutrients
        protein_g = (tdee * protein_ratio) / 4  # 4 kcal per gram
        fat_g = (tdee * fat_ratio) / 9          # 9 kcal per gram
        carb_g = (tdee * carb_ratio) / 4        # 4 kcal per gram
        
        # Fiber recommendation (WHO: 25g per 1000 kcal)
        fiber_g = (tdee / 1000) * 25
        
        # Sodium (WHO: <2000mg per day)
        sodium_mg = 2000
        
        # Sugar (WHO: <10% of total calories, preferably <5%)
        sugar_g = (tdee * 0.05) / 4  # Using 5% recommendation
        
        # Get micronutrient targets from guidelines
        micronutrients = {
            'vitamin_a': self.guidelines.calculate_micronutrient_needs('vitamin_a', profile.age, profile.gender, profile.chronic_conditions),
            'vitamin_c': self.guidelines.calculate_micronutrient_needs('vitamin_c', profile.age, profile.gender, profile.chronic_conditions),
            'vitamin_d': self.guidelines.calculate_micronutrient_needs('vitamin_d', profile.age, profile.gender, profile.chronic_conditions),
            'calcium': self.guidelines.calculate_micronutrient_needs('calcium', profile.age, profile.gender, profile.chronic_conditions),
            'iron': self.guidelines.calculate_micronutrient_needs('iron', profile.age, profile.gender, profile.chronic_conditions)
        }
        
        return NutrientTarget(
            calories=tdee,
            protein=protein_g,
            carbohydrates=carb_g,
            fat=fat_g,
            fiber=fiber_g,
            sodium=sodium_mg,
            sugar=sugar_g,
            vitamin_a=micronutrients.get('vitamin_a', 700),
            vitamin_c=micronutrients.get('vitamin_c', 90),
            vitamin_d=micronutrients.get('vitamin_d', 15),
            calcium=micronutrients.get('calcium', 1000),
            iron=micronutrients.get('iron', 18)
        )
    
    def _apply_condition_adjustments(self, base_target: NutrientTarget, 
                                   profile: HealthProfile) -> Tuple[NutrientTarget, List[Dict[str, Any]]]:
        """Apply chronic condition adjustments to base targets"""
        
        target_dict = base_target.to_dict()
        adjustments = []
        
        for condition in profile.chronic_conditions:
            if condition in self.condition_adjustments:
                condition_adj = self.condition_adjustments[condition]
                
                for nutrient, factor in condition_adj.items():
                    if nutrient in target_dict:
                        old_value = target_dict[nutrient]
                        new_value = old_value * factor
                        target_dict[nutrient] = new_value
                        
                        adjustments.append({
                            'reason': f'{condition.value} management',
                            'nutrient': nutrient,
                            'adjustment_factor': factor,
                            'old_value': old_value,
                            'new_value': new_value,
                            'change_description': self._get_adjustment_description(
                                nutrient, factor
                            )
                        })
        
        adjusted_target = NutrientTarget(**target_dict)
        return adjusted_target, adjustments
    
    def _apply_goal_adjustments(self, target: NutrientTarget, 
                              profile: HealthProfile) -> Tuple[NutrientTarget, List[Dict[str, Any]]]:
        """Apply weight goal adjustments"""
        
        target_dict = target.to_dict()
        adjustments = []
        
        if profile.weight_goal == 'lose':
            # Create calorie deficit (typically 20% reduction)
            old_calories = target_dict['calories']
            new_calories = old_calories * 0.8
            target_dict['calories'] = new_calories
            
            # Increase protein to preserve muscle mass
            old_protein = target_dict['protein']
            new_protein = old_protein * 1.2
            target_dict['protein'] = new_protein
            
            adjustments.extend([
                {
                    'reason': 'weight_loss_goal',
                    'nutrient': 'calories',
                    'adjustment_factor': 0.8,
                    'old_value': old_calories,
                    'new_value': new_calories,
                    'change_description': 'Reduced for sustainable weight loss'
                },
                {
                    'reason': 'weight_loss_goal',
                    'nutrient': 'protein',
                    'adjustment_factor': 1.2,
                    'old_value': old_protein,
                    'new_value': new_protein,
                    'change_description': 'Increased to preserve muscle mass'
                }
            ])
        
        elif profile.weight_goal == 'gain':
            # Create calorie surplus (typically 15% increase)
            old_calories = target_dict['calories']
            new_calories = old_calories * 1.15
            target_dict['calories'] = new_calories
            
            adjustments.append({
                'reason': 'weight_gain_goal',
                'nutrient': 'calories',
                'adjustment_factor': 1.15,
                'old_value': old_calories,
                'new_value': new_calories,
                'change_description': 'Increased for healthy weight gain'
            })
        
        adjusted_target = NutrientTarget(**target_dict)
        return adjusted_target, adjustments
    
    def _calculate_confidence_score(self, profile: HealthProfile) -> float:
        """Calculate confidence score for the recommendations"""
        
        confidence = 1.0
        
        # Reduce confidence for extreme ages
        if profile.age < 18 or profile.age > 65:
            confidence *= 0.9
        
        # Reduce confidence for multiple chronic conditions
        if len(profile.chronic_conditions) > 2:
            confidence *= 0.85
        
        # Reduce confidence for extreme BMI values
        bmi = profile.bmi
        if bmi < 16 or bmi > 35:
            confidence *= 0.8
        
        # Reduce confidence if taking medications (may affect nutrient needs)
        if len(profile.medications) > 0:
            confidence *= 0.9
        
        # Increase confidence for complete profiles
        if (profile.allergies and profile.dietary_preferences and 
            profile.weight_goal and profile.target_weight):
            confidence *= 1.05
        
        return min(confidence, 1.0)  # Cap at 1.0
    
    def _get_source_guidelines(self, profile: HealthProfile) -> List[str]:
        """Determine which guidelines were used"""
        sources = ["WHO Dietary Guidelines", "ICMR Nutrient Requirements"]
        
        age_group = WHOICMRGuidelines.get_age_group(profile.age)
        if age_group in [AgeGroup.CHILD_1_3Y, AgeGroup.CHILD_4_6Y, AgeGroup.CHILD_7_9Y, 
                        AgeGroup.ADOLESCENT_10_12Y, AgeGroup.ADOLESCENT_13_15Y, AgeGroup.ADOLESCENT_16_17Y]:
            sources.append("WHO Child/Adolescent Guidelines")
        
        if profile.chronic_conditions:
            sources.append("Clinical Nutrition Guidelines")
        
        if profile.gender == Gender.FEMALE and 19 <= profile.age <= 50:
            sources.append("WHO Women's Health Guidelines")
        
        return sources
    
    def _get_adjustment_description(self, nutrient: str, factor: float) -> str:
        """Get human-readable description of adjustment"""
        
        if factor > 1.0:
            intensity = "slightly" if factor < 1.2 else "moderately" if factor < 1.5 else "significantly"
            return f"Increased {intensity} ({factor:.1f}x)"
        else:
            intensity = "slightly" if factor > 0.8 else "moderately" if factor > 0.6 else "significantly"
            return f"Reduced {intensity} ({factor:.1f}x)"
    
    def calculate_meal_targets(self, daily_targets: AdaptiveTarget, 
                             meal_type: str = 'main') -> NutrientTarget:
        """
        Calculate nutrient targets for a specific meal
        
        Args:
            daily_targets: Daily nutrient targets
            meal_type: Type of meal ('breakfast', 'lunch', 'dinner', 'snack')
            
        Returns:
            NutrientTarget: Meal-specific targets
        """
        
        # Meal distribution ratios
        meal_ratios = {
            'breakfast': 0.25,  # 25% of daily calories
            'lunch': 0.35,      # 35% of daily calories  
            'dinner': 0.30,     # 30% of daily calories
            'snack': 0.10,      # 10% of daily calories
            'main': 0.33        # Default: 1/3 of daily calories
        }
        
        ratio = meal_ratios.get(meal_type, 0.33)
        daily = daily_targets.adjusted_target
        
        return NutrientTarget(
            calories=daily.calories * ratio,
            protein=daily.protein * ratio,
            carbohydrates=daily.carbohydrates * ratio,
            fat=daily.fat * ratio,
            fiber=daily.fiber * ratio,
            sodium=daily.sodium * ratio,
            sugar=daily.sugar * ratio,
            vitamin_a=daily.vitamin_a * ratio,
            vitamin_c=daily.vitamin_c * ratio,
            vitamin_d=daily.vitamin_d * ratio,
            calcium=daily.calcium * ratio,
            iron=daily.iron * ratio
        )
    
    def analyze_nutrient_gap(self, current_intake: NutrientTarget, 
                           targets: AdaptiveTarget) -> Dict[str, Any]:
        """
        Analyze gaps between current intake and targets
        
        Args:
            current_intake: Current nutrient intake
            targets: Target nutrient values
            
        Returns:
            dict: Gap analysis with recommendations
        """
        
        target_values = targets.adjusted_target.to_dict()
        current_values = current_intake.to_dict()
        
        gaps = {}
        recommendations = []
        
        for nutrient, target in target_values.items():
            current = current_values.get(nutrient, 0)
            gap_percent = ((current - target) / target) * 100 if target > 0 else 0
            
            gaps[nutrient] = {
                'current': current,
                'target': target,
                'gap_amount': current - target,
                'gap_percent': gap_percent,
                'status': self._get_nutrient_status(gap_percent)
            }
            
            # Generate recommendations for significant gaps
            if abs(gap_percent) > 20:
                recommendations.append(
                    self._generate_nutrient_recommendation(nutrient, gap_percent)
                )
        
        return {
            'gaps': gaps,
            'recommendations': recommendations,
            'overall_score': self._calculate_overall_nutrition_score(gaps)
        }
    
    def _get_nutrient_status(self, gap_percent: float) -> str:
        """Get status description for nutrient gap"""
        if gap_percent < -30:
            return "critically_low"
        elif gap_percent < -20:
            return "low"
        elif gap_percent < -10:
            return "slightly_low"
        elif gap_percent <= 10:
            return "optimal"
        elif gap_percent <= 25:
            return "slightly_high"
        elif gap_percent <= 50:
            return "high"
        else:
            return "critically_high"
    
    def _generate_nutrient_recommendation(self, nutrient: str, gap_percent: float) -> str:
        """Generate recommendation for nutrient gap"""
        
        nutrient_foods = {
            'protein': ['lean meats', 'fish', 'legumes', 'nuts'],
            'fiber': ['whole grains', 'fruits', 'vegetables', 'legumes'],
            'calcium': ['dairy products', 'leafy greens', 'fortified foods'],
            'iron': ['red meat', 'spinach', 'lentils', 'fortified cereals'],
            'vitamin_c': ['citrus fruits', 'berries', 'bell peppers'],
            'vitamin_a': ['carrots', 'sweet potatoes', 'dark leafy greens']
        }
        
        if gap_percent < -20:
            foods = nutrient_foods.get(nutrient, [f'{nutrient}-rich foods'])
            return f"Increase {nutrient} intake by including more {', '.join(foods[:2])}"
        elif gap_percent > 25:
            return f"Consider reducing {nutrient} intake to avoid excess"
        
        return f"Monitor {nutrient} levels"
    
    def _calculate_overall_nutrition_score(self, gaps: Dict[str, Any]) -> float:
        """Calculate overall nutrition score (0-100)"""
        
        scores = []
        weights = {
            'calories': 1.0,
            'protein': 1.0,
            'carbohydrates': 0.8,
            'fat': 0.8,
            'fiber': 1.2,
            'sodium': 1.0
        }
        
        for nutrient, gap_data in gaps.items():
            weight = weights.get(nutrient, 0.5)
            gap_percent = abs(gap_data['gap_percent'])
            
            # Score decreases with larger gaps
            if gap_percent <= 10:
                score = 100
            elif gap_percent <= 25:
                score = 80
            elif gap_percent <= 50:
                score = 60
            else:
                score = 40
            
            scores.append(score * weight)
        
        if scores:
            return sum(scores) / len(scores)
        return 0.0


# Global engine instance
adaptive_engine = AdaptiveNutrientEngine()


def get_adaptive_targets(profile: HealthProfile) -> AdaptiveTarget:
    """
    Convenience function to get adaptive targets for a profile
    
    Args:
        profile: User's health profile
        
    Returns:
        AdaptiveTarget: Personalized nutrient targets
    """
    return adaptive_engine.calculate_adaptive_targets(profile)


def get_meal_targets(profile: HealthProfile, meal_type: str = 'main') -> NutrientTarget:
    """
    Get nutrient targets for a specific meal
    
    Args:
        profile: User's health profile
        meal_type: Type of meal
        
    Returns:
        NutrientTarget: Meal-specific targets
    """
    daily_targets = adaptive_engine.calculate_adaptive_targets(profile)
    return adaptive_engine.calculate_meal_targets(daily_targets, meal_type)

# Nutrition APIs module for backend functionality

from .usda_api import USDAFoodDataAPI, USDAFoodItem, USDANutrient
from .edamam_api import EdamamMealPlannerAPI, EdamamFoodDatabaseAPI, EdamamFoodItem, EdamamNutrient
from .nutrition_schema import (
    NutritionData, 
    MacroNutrients, 
    MicroNutrients, 
    NutritionDataNormalizer,
    normalize_nutrition_data,
    merge_nutrition_data
)

__all__ = [
    'USDAFoodDataAPI',
    'USDAFoodItem',
    'USDANutrient',
    'EdamamMealPlannerAPI',
    'EdamamFoodDatabaseAPI',
    'EdamamFoodItem',
    'EdamamNutrient',
    'NutritionData',
    'MacroNutrients',
    'MicroNutrients',
    'NutritionDataNormalizer',
    'normalize_nutrition_data',
    'merge_nutrition_data'
]

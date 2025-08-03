# Nutrition APIs module for backend functionality

from .usda_api import USDAFoodDataAPI, USDAFoodItem, USDANutrient
from .edamam_api import EdamamNutrientsAPI, EdamamFoodItem, EdamamNutrient
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
    'EdamamNutrientsAPI',
    'EdamamFoodItem',
    'EdamamNutrient',
    'NutritionData',
    'MacroNutrients',
    'MicroNutrients',
    'NutritionDataNormalizer',
    'normalize_nutrition_data',
    'merge_nutrition_data'
]

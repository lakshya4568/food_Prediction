"""
Nutrition Data Schema and Normalization for NutriVision AI

This module defines a unified schema for nutrition data and provides
normalization functions to convert data from USDA and Edamam APIs
to this common format.
"""

from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from datetime import datetime
import logging

from .usda_api import USDAFoodItem, USDANutrient
from .edamam_api import EdamamFoodItem, EdamamNutrient

logger = logging.getLogger(__name__)


@dataclass
class MacroNutrients:
    """Macronutrients in grams per 100g"""
    energy_kcal: float = 0.0           # Energy (kcal)
    protein: float = 0.0               # Protein (g)
    total_fat: float = 0.0             # Total fat (g)
    saturated_fat: float = 0.0         # Saturated fat (g)
    monounsaturated_fat: float = 0.0   # Monounsaturated fat (g)
    polyunsaturated_fat: float = 0.0   # Polyunsaturated fat (g)
    trans_fat: float = 0.0             # Trans fat (g)
    cholesterol: float = 0.0           # Cholesterol (mg)
    carbohydrates: float = 0.0         # Total carbohydrates (g)
    fiber: float = 0.0                 # Dietary fiber (g)
    sugars: float = 0.0                # Total sugars (g)
    sodium: float = 0.0                # Sodium (mg)
    
    def to_dict(self) -> Dict[str, float]:
        """Convert to dictionary"""
        return asdict(self)


@dataclass
class MicroNutrients:
    """Micronutrients (vitamins and minerals) per 100g"""
    # Vitamins
    vitamin_a: float = 0.0        # Vitamin A, RAE (mcg)
    vitamin_c: float = 0.0        # Vitamin C (mg)
    vitamin_d: float = 0.0        # Vitamin D (mcg)
    vitamin_e: float = 0.0        # Vitamin E (mg)
    vitamin_k: float = 0.0        # Vitamin K (mcg)
    thiamin: float = 0.0          # Thiamin (mg)
    riboflavin: float = 0.0       # Riboflavin (mg)
    niacin: float = 0.0           # Niacin (mg)
    vitamin_b6: float = 0.0       # Vitamin B-6 (mg)
    folate: float = 0.0           # Folate (mcg)
    vitamin_b12: float = 0.0      # Vitamin B-12 (mcg)
    
    # Minerals
    calcium: float = 0.0          # Calcium (mg)
    iron: float = 0.0             # Iron (mg)
    magnesium: float = 0.0        # Magnesium (mg)
    phosphorus: float = 0.0       # Phosphorus (mg)
    potassium: float = 0.0        # Potassium (mg)
    zinc: float = 0.0             # Zinc (mg)
    copper: float = 0.0           # Copper (mg)
    manganese: float = 0.0        # Manganese (mg)
    selenium: float = 0.0         # Selenium (mcg)
    
    def to_dict(self) -> Dict[str, float]:
        """Convert to dictionary"""
        return asdict(self)


@dataclass
class NutritionData:
    """Unified nutrition data structure"""
    # Basic food information
    food_id: str                           # Unique identifier
    name: str                             # Food name/description
    brand: Optional[str] = None           # Brand name (if applicable)
    source: str = "unknown"               # Data source (usda, edamam)
    
    # Nutrition per 100g
    macros: Optional[MacroNutrients] = None
    micros: Optional[MicroNutrients] = None
    
    # Additional metadata
    serving_size: Optional[str] = None    # Common serving size description
    serving_weight: Optional[float] = None # Common serving weight in grams
    category: Optional[str] = None        # Food category
    barcode: Optional[str] = None         # UPC/barcode if available
    
    # Data quality and source tracking
    data_quality_score: float = 1.0      # 0.0 to 1.0 quality score
    last_updated: Optional[datetime] = None
    data_completeness: float = 0.0        # Percentage of fields populated
    
    def __post_init__(self):
        """Initialize default values and calculate completeness"""
        if self.macros is None:
            self.macros = MacroNutrients()
        if self.micros is None:
            self.micros = MicroNutrients()
        if self.last_updated is None:
            self.last_updated = datetime.now()
        
        self.data_completeness = self._calculate_completeness()
    
    def _calculate_completeness(self) -> float:
        """Calculate data completeness percentage"""
        total_fields = 0
        populated_fields = 0
        
        # Check macronutrients
        if self.macros:
            for field, value in self.macros.to_dict().items():
                total_fields += 1
                if value > 0:
                    populated_fields += 1
        
        # Check micronutrients
        if self.micros:
            for field, value in self.micros.to_dict().items():
                total_fields += 1
                if value > 0:
                    populated_fields += 1
        
        return (populated_fields / total_fields) * 100 if total_fields > 0 else 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            'food_id': self.food_id,
            'name': self.name,
            'brand': self.brand,
            'source': self.source,
            'macros': self.macros.to_dict() if self.macros else {},
            'micros': self.micros.to_dict() if self.micros else {},
            'serving_size': self.serving_size,
            'serving_weight': self.serving_weight,
            'category': self.category,
            'barcode': self.barcode,
            'data_quality_score': self.data_quality_score,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'data_completeness': self.data_completeness
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'NutritionData':
        """Create NutritionData from dictionary"""
        macros = MacroNutrients(**data.get('macros', {}))
        micros = MicroNutrients(**data.get('micros', {}))
        
        last_updated = None
        if data.get('last_updated'):
            last_updated = datetime.fromisoformat(data['last_updated'])
        
        return cls(
            food_id=data['food_id'],
            name=data['name'],
            brand=data.get('brand'),
            source=data.get('source', 'unknown'),
            macros=macros,
            micros=micros,
            serving_size=data.get('serving_size'),
            serving_weight=data.get('serving_weight'),
            category=data.get('category'),
            barcode=data.get('barcode'),
            data_quality_score=data.get('data_quality_score', 1.0),
            last_updated=last_updated,
            data_completeness=data.get('data_completeness', 0.0)
        )


class NutritionDataNormalizer:
    """Normalizes nutrition data from different API sources"""
    
    def __init__(self):
        # Unit conversion factors to standardize units
        self.unit_conversions = {
            # Energy conversions to kcal
            'kj': 0.239006,  # kJ to kcal
            'kcal': 1.0,
            
            # Weight conversions to grams
            'g': 1.0,
            'mg': 0.001,     # mg to g
            'mcg': 0.000001, # mcg to g
            'µg': 0.000001,  # µg to g
            'ug': 0.000001,  # ug to g
            
            # For nutrients that should stay in mg
            'mg_as_mg': 1.0,      # Keep mg as mg
            'mcg_as_mcg': 1.0,    # Keep mcg as mcg
        }
    
    def normalize_usda_food(self, usda_food: USDAFoodItem) -> NutritionData:
        """
        Normalize USDA FoodData Central food item to unified format
        
        Args:
            usda_food: USDAFoodItem to normalize
            
        Returns:
            NutritionData: Normalized nutrition data
        """
        try:
            # Extract macronutrients
            macros = MacroNutrients()
            self._extract_usda_macros(usda_food.nutrients, macros)
            
            # Extract micronutrients
            micros = MicroNutrients()
            self._extract_usda_micros(usda_food.nutrients, micros)
            
            # Calculate quality score based on data source type
            quality_score = self._calculate_usda_quality_score(usda_food.data_type)
            
            return NutritionData(
                food_id=f"usda_{usda_food.fdc_id}",
                name=usda_food.description,
                brand=usda_food.brand_owner,
                source="usda",
                macros=macros,
                micros=micros,
                category=usda_food.data_type,
                barcode=usda_food.gtinUpc,
                data_quality_score=quality_score
            )
            
        except Exception as e:
            logger.error(f"Error normalizing USDA food {usda_food.fdc_id}: {e}")
            raise
    
    def normalize_edamam_food(self, edamam_food: EdamamFoodItem) -> NutritionData:
        """
        Normalize Edamam food item to unified format
        
        Args:
            edamam_food: EdamamFoodItem to normalize
            
        Returns:
            NutritionData: Normalized nutrition data
        """
        try:
            # Extract macronutrients
            macros = MacroNutrients()
            self._extract_edamam_macros(edamam_food.nutrients, macros)
            
            # Extract micronutrients
            micros = MicroNutrients()
            self._extract_edamam_micros(edamam_food.nutrients, micros)
            
            return NutritionData(
                food_id=f"edamam_{edamam_food.food_id}",
                name=edamam_food.label,
                source="edamam",
                macros=macros,
                micros=micros,
                category=edamam_food.category_label,
                data_quality_score=0.9  # Edamam generally has good quality
            )
            
        except Exception as e:
            logger.error(f"Error normalizing Edamam food {edamam_food.food_id}: {e}")
            raise
    
    def _extract_usda_macros(self, nutrients: List[USDANutrient], macros: MacroNutrients):
        """Extract macronutrients from USDA nutrients list"""
        nutrient_map = {
            1008: ('energy_kcal', 'kcal'),
            1003: ('protein', 'g'),
            1004: ('total_fat', 'g'),
            1258: ('saturated_fat', 'g'),
            1292: ('monounsaturated_fat', 'g'),
            1293: ('polyunsaturated_fat', 'g'),
            1257: ('trans_fat', 'g'),
            1253: ('cholesterol', 'mg_as_mg'),
            1005: ('carbohydrates', 'g'),
            1079: ('fiber', 'g'),
            2000: ('sugars', 'g'),
            1093: ('sodium', 'mg_as_mg')
        }
        
        for nutrient in nutrients:
            if nutrient.nutrient_id in nutrient_map:
                field_name, unit_type = nutrient_map[nutrient.nutrient_id]
                converted_value = self._convert_unit(nutrient.amount, nutrient.unit, unit_type)
                setattr(macros, field_name, converted_value)
    
    def _extract_usda_micros(self, nutrients: List[USDANutrient], micros: MicroNutrients):
        """Extract micronutrients from USDA nutrients list"""
        nutrient_map = {
            1104: ('vitamin_a', 'mcg_as_mcg'),
            1162: ('vitamin_c', 'mg_as_mg'),
            1114: ('vitamin_d', 'mcg_as_mcg'),
            1109: ('vitamin_e', 'mg_as_mg'),
            1185: ('vitamin_k', 'mcg_as_mcg'),
            1165: ('thiamin', 'mg_as_mg'),
            1166: ('riboflavin', 'mg_as_mg'),
            1167: ('niacin', 'mg_as_mg'),
            1175: ('vitamin_b6', 'mg_as_mg'),
            1177: ('folate', 'mcg_as_mcg'),
            1178: ('vitamin_b12', 'mcg_as_mcg'),
            1087: ('calcium', 'mg_as_mg'),
            1089: ('iron', 'mg_as_mg'),
            1090: ('magnesium', 'mg_as_mg'),
            1091: ('phosphorus', 'mg_as_mg'),
            1092: ('potassium', 'mg_as_mg'),
            1095: ('zinc', 'mg_as_mg'),
            1098: ('copper', 'mg_as_mg'),
            1101: ('manganese', 'mg_as_mg'),
            1103: ('selenium', 'mcg_as_mcg')
        }
        
        for nutrient in nutrients:
            if nutrient.nutrient_id in nutrient_map:
                field_name, unit_type = nutrient_map[nutrient.nutrient_id]
                converted_value = self._convert_unit(nutrient.amount, nutrient.unit, unit_type)
                setattr(micros, field_name, converted_value)
    
    def _extract_edamam_macros(self, nutrients: Dict[str, EdamamNutrient], macros: MacroNutrients):
        """Extract macronutrients from Edamam nutrients dict"""
        nutrient_map = {
            'ENERC_KCAL': ('energy_kcal', 'kcal'),
            'PROCNT': ('protein', 'g'),
            'FAT': ('total_fat', 'g'),
            'FASAT': ('saturated_fat', 'g'),
            'FAMS': ('monounsaturated_fat', 'g'),
            'FAPU': ('polyunsaturated_fat', 'g'),
            'FATRN': ('trans_fat', 'g'),
            'CHOLE': ('cholesterol', 'mg_as_mg'),
            'CHOCDF': ('carbohydrates', 'g'),
            'FIBTG': ('fiber', 'g'),
            'SUGAR': ('sugars', 'g'),
            'NA': ('sodium', 'mg_as_mg')
        }
        
        for tag, nutrient in nutrients.items():
            if tag in nutrient_map:
                field_name, unit_type = nutrient_map[tag]
                converted_value = self._convert_unit(nutrient.quantity, nutrient.unit, unit_type)
                setattr(macros, field_name, converted_value)
    
    def _extract_edamam_micros(self, nutrients: Dict[str, EdamamNutrient], micros: MicroNutrients):
        """Extract micronutrients from Edamam nutrients dict"""
        nutrient_map = {
            'VITA_RAE': ('vitamin_a', 'mcg_as_mcg'),
            'VITC': ('vitamin_c', 'mg_as_mg'),
            'VITD': ('vitamin_d', 'mcg_as_mcg'),
            'TOCPHA': ('vitamin_e', 'mg_as_mg'),
            'VITK1': ('vitamin_k', 'mcg_as_mcg'),
            'THIA': ('thiamin', 'mg_as_mg'),
            'RIBF': ('riboflavin', 'mg_as_mg'),
            'NIA': ('niacin', 'mg_as_mg'),
            'VITB6A': ('vitamin_b6', 'mg_as_mg'),
            'FOLAC': ('folate', 'mcg_as_mcg'),
            'VITB12': ('vitamin_b12', 'mcg_as_mcg'),
            'CA': ('calcium', 'mg_as_mg'),
            'FE': ('iron', 'mg_as_mg'),
            'MG': ('magnesium', 'mg_as_mg'),
            'P': ('phosphorus', 'mg_as_mg'),
            'K': ('potassium', 'mg_as_mg'),
            'ZN': ('zinc', 'mg_as_mg'),
            'CU': ('copper', 'mg_as_mg'),
            'MN': ('manganese', 'mg_as_mg'),
            'SE': ('selenium', 'mcg_as_mcg')
        }
        
        for tag, nutrient in nutrients.items():
            if tag in nutrient_map:
                field_name, unit_type = nutrient_map[tag]
                converted_value = self._convert_unit(nutrient.quantity, nutrient.unit, unit_type)
                setattr(micros, field_name, converted_value)
    
    def _convert_unit(self, value: float, from_unit: str, target_unit_type: str) -> float:
        """
        Convert nutrient value to standardized unit
        
        Args:
            value: Nutrient value
            from_unit: Source unit
            target_unit_type: Target unit type for conversion
            
        Returns:
            float: Converted value
        """
        if value <= 0:
            return 0.0
        
        # Normalize unit strings
        from_unit = from_unit.lower().strip()
        
        # Handle special cases where we want to keep original units
        if target_unit_type in ['mg_as_mg', 'mcg_as_mcg']:
            if from_unit in ['mg', 'mcg', 'µg', 'ug']:
                return value
        
        # Apply conversions
        conversion_factor = self.unit_conversions.get(from_unit, 1.0)
        return value * conversion_factor
    
    def _calculate_usda_quality_score(self, data_type: str) -> float:
        """Calculate quality score based on USDA data type"""
        quality_scores = {
            'Foundation': 1.0,
            'SR Legacy': 0.95,
            'Survey (FNDDS)': 0.9,
            'Branded': 0.8,
            'Experimental': 0.7
        }
        return quality_scores.get(data_type, 0.75)


# Global normalizer instance
normalizer = NutritionDataNormalizer()


def normalize_nutrition_data(source_data: Union[USDAFoodItem, EdamamFoodItem]) -> NutritionData:
    """
    Normalize nutrition data from any supported source
    
    Args:
        source_data: Either USDAFoodItem or EdamamFoodItem
        
    Returns:
        NutritionData: Normalized nutrition data
    """
    if isinstance(source_data, USDAFoodItem):
        return normalizer.normalize_usda_food(source_data)
    elif isinstance(source_data, EdamamFoodItem):
        return normalizer.normalize_edamam_food(source_data)
    else:
        raise ValueError(f"Unsupported source data type: {type(source_data)}")


def merge_nutrition_data(primary: NutritionData, secondary: NutritionData) -> NutritionData:
    """
    Merge two nutrition data sources, using secondary to fill gaps in primary
    
    Args:
        primary: Primary nutrition data source
        secondary: Secondary nutrition data to fill gaps
        
    Returns:
        NutritionData: Merged nutrition data
    """
    merged = NutritionData(
        food_id=primary.food_id,
        name=primary.name,
        brand=primary.brand or secondary.brand,
        source=f"{primary.source}+{secondary.source}",
        serving_size=primary.serving_size or secondary.serving_size,
        serving_weight=primary.serving_weight or secondary.serving_weight,
        category=primary.category or secondary.category,
        barcode=primary.barcode or secondary.barcode,
        data_quality_score=(primary.data_quality_score + secondary.data_quality_score) / 2
    )
    
    # Merge macronutrients (prefer primary, use secondary for zeros)
    merged.macros = MacroNutrients()
    for field in MacroNutrients.__dataclass_fields__:
        primary_val = getattr(primary.macros, field)
        secondary_val = getattr(secondary.macros, field)
        setattr(merged.macros, field, primary_val if primary_val > 0 else secondary_val)
    
    # Merge micronutrients (prefer primary, use secondary for zeros)
    merged.micros = MicroNutrients()
    for field in MicroNutrients.__dataclass_fields__:
        primary_val = getattr(primary.micros, field)
        secondary_val = getattr(secondary.micros, field)
        setattr(merged.micros, field, primary_val if primary_val > 0 else secondary_val)
    
    # Recalculate completeness
    merged.data_completeness = merged._calculate_completeness()
    
    return merged

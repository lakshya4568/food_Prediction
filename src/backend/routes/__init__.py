"""
Routes package for NutriVision AI backend

This package contains Flask blueprint definitions for different API endpoints.
"""

from .health_routes import health_bp
from .nutrition_routes import nutrition_bp

__all__ = ['health_bp', 'nutrition_bp']

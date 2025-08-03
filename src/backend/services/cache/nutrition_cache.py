"""
Redis Caching Service for NutriVision AI

This module provides Redis-based caching functionality for the nutrition API
to improve performance and reduce external API call latency.
"""

import json
import hashlib
import logging
from typing import Optional, Any, Dict, List
import os
from datetime import timedelta

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    redis = None

from ...services.nutrition_apis import NutritionData

logger = logging.getLogger(__name__)


class NutritionCache:
    """
    Redis-based cache for nutrition data with automatic serialization/deserialization
    """
    
    def __init__(self, redis_url: Optional[str] = None, default_ttl: int = 3600):
        """
        Initialize the nutrition cache
        
        Args:
            redis_url: Redis connection URL (defaults to env var or localhost)
            default_ttl: Default cache TTL in seconds (1 hour = 3600)
        """
        self.default_ttl = default_ttl
        self.redis_client = None
        self.enabled = False
        
        if not REDIS_AVAILABLE:
            logger.warning("Redis not available - caching disabled")
            return
        
        try:
            # Get Redis URL from environment or use default
            if not redis_url:
                redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
            
            # Initialize Redis client
            self.redis_client = redis.from_url(
                redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True
            )
            
            # Test connection
            self.redis_client.ping()
            self.enabled = True
            logger.info(f"Redis cache initialized successfully at {redis_url}")
            
        except Exception as e:
            logger.warning(f"Redis cache initialization failed: {e}. Caching disabled.")
            self.redis_client = None
            self.enabled = False
    
    def _generate_cache_key(self, key_data: Dict[str, Any]) -> str:
        """
        Generate a consistent cache key from data
        
        Args:
            key_data: Dictionary containing key components
            
        Returns:
            str: Hashed cache key
        """
        # Sort the dictionary to ensure consistent key generation
        sorted_data = json.dumps(key_data, sort_keys=True)
        
        # Create hash to avoid key length issues and ensure uniqueness
        hash_object = hashlib.sha256(sorted_data.encode())
        return f"nutri:{hash_object.hexdigest()[:16]}"
    
    def get_search_results(self, query: str, source: str, limit: int) -> Optional[List[Dict[str, Any]]]:
        """
        Get cached search results
        
        Args:
            query: Search query
            source: Data source (usda, edamam, both)
            limit: Number of results
            
        Returns:
            Cached search results or None if not found
        """
        if not self.enabled:
            return None
        
        try:
            cache_key = self._generate_cache_key({
                'type': 'search',
                'query': query.lower().strip(),
                'source': source,
                'limit': limit
            })
            
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                logger.debug(f"Cache HIT for search: {query}")
                return json.loads(cached_data)
            
            logger.debug(f"Cache MISS for search: {query}")
            return None
            
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    def set_search_results(self, query: str, source: str, limit: int, 
                          results: List[NutritionData], ttl: Optional[int] = None) -> bool:
        """
        Cache search results
        
        Args:
            query: Search query
            source: Data source
            limit: Number of results
            results: Nutrition data results
            ttl: Cache TTL in seconds
            
        Returns:
            True if cached successfully, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            cache_key = self._generate_cache_key({
                'type': 'search',
                'query': query.lower().strip(),
                'source': source,
                'limit': limit
            })
            
            # Convert NutritionData objects to dictionaries for JSON serialization
            serializable_results = [result.to_dict() for result in results]
            
            cache_ttl = ttl or self.default_ttl
            success = self.redis_client.setex(
                cache_key,
                cache_ttl,
                json.dumps(serializable_results)
            )
            
            if success:
                logger.debug(f"Cache SET for search: {query} (TTL: {cache_ttl}s)")
            
            return bool(success)
            
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    def get_food_details(self, food_id: str) -> Optional[Dict[str, Any]]:
        """
        Get cached food details
        
        Args:
            food_id: Food identifier
            
        Returns:
            Cached food details or None if not found
        """
        if not self.enabled:
            return None
        
        try:
            cache_key = self._generate_cache_key({
                'type': 'details',
                'food_id': food_id
            })
            
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                logger.debug(f"Cache HIT for food details: {food_id}")
                return json.loads(cached_data)
            
            logger.debug(f"Cache MISS for food details: {food_id}")
            return None
            
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    def set_food_details(self, food_id: str, nutrition_data: NutritionData, 
                        ttl: Optional[int] = None) -> bool:
        """
        Cache food details
        
        Args:
            food_id: Food identifier
            nutrition_data: Nutrition data to cache
            ttl: Cache TTL in seconds
            
        Returns:
            True if cached successfully, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            cache_key = self._generate_cache_key({
                'type': 'details',
                'food_id': food_id
            })
            
            cache_ttl = ttl or self.default_ttl
            success = self.redis_client.setex(
                cache_key,
                cache_ttl,
                json.dumps(nutrition_data.to_dict())
            )
            
            if success:
                logger.debug(f"Cache SET for food details: {food_id} (TTL: {cache_ttl}s)")
            
            return bool(success)
            
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    def get_comparison_results(self, food_ids: List[str]) -> Optional[Dict[str, Any]]:
        """
        Get cached comparison results
        
        Args:
            food_ids: List of food identifiers
            
        Returns:
            Cached comparison results or None if not found
        """
        if not self.enabled:
            return None
        
        try:
            # Sort food IDs to ensure consistent cache key
            sorted_ids = sorted(food_ids)
            cache_key = self._generate_cache_key({
                'type': 'comparison',
                'food_ids': sorted_ids
            })
            
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                logger.debug(f"Cache HIT for comparison: {sorted_ids}")
                return json.loads(cached_data)
            
            logger.debug(f"Cache MISS for comparison: {sorted_ids}")
            return None
            
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    def set_comparison_results(self, food_ids: List[str], results: Dict[str, Any], 
                              ttl: Optional[int] = None) -> bool:
        """
        Cache comparison results
        
        Args:
            food_ids: List of food identifiers
            results: Comparison results to cache
            ttl: Cache TTL in seconds
            
        Returns:
            True if cached successfully, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            # Sort food IDs to ensure consistent cache key
            sorted_ids = sorted(food_ids)
            cache_key = self._generate_cache_key({
                'type': 'comparison',
                'food_ids': sorted_ids
            })
            
            cache_ttl = ttl or self.default_ttl
            success = self.redis_client.setex(
                cache_key,
                cache_ttl,
                json.dumps(results)
            )
            
            if success:
                logger.debug(f"Cache SET for comparison: {sorted_ids} (TTL: {cache_ttl}s)")
            
            return bool(success)
            
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    def invalidate_food(self, food_id: str) -> bool:
        """
        Invalidate cached data for a specific food item
        
        Args:
            food_id: Food identifier to invalidate
            
        Returns:
            True if invalidated successfully, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            # Generate pattern to match all cache keys for this food
            pattern = f"nutri:*{food_id}*"
            
            # Find and delete all matching keys
            keys = self.redis_client.keys(pattern)
            if keys:
                deleted = self.redis_client.delete(*keys)
                logger.info(f"Invalidated {deleted} cache entries for food: {food_id}")
                return deleted > 0
            
            return True
            
        except Exception as e:
            logger.error(f"Cache invalidation error: {e}")
            return False
    
    def clear_all(self) -> bool:
        """
        Clear all nutrition cache entries
        
        Returns:
            True if cleared successfully, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            # Find all nutrition cache keys
            keys = self.redis_client.keys("nutri:*")
            if keys:
                deleted = self.redis_client.delete(*keys)
                logger.info(f"Cleared {deleted} nutrition cache entries")
                return deleted > 0
            
            return True
            
        except Exception as e:
            logger.error(f"Cache clear error: {e}")
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics
        
        Returns:
            Dictionary with cache statistics
        """
        if not self.enabled:
            return {
                'enabled': False,
                'error': 'Redis not available or connection failed'
            }
        
        try:
            info = self.redis_client.info()
            
            # Count nutrition cache keys
            nutri_keys = len(self.redis_client.keys("nutri:*"))
            
            return {
                'enabled': True,
                'total_keys': info.get('db0', {}).get('keys', 0),
                'nutrition_keys': nutri_keys,
                'memory_used': info.get('used_memory_human', 'Unknown'),
                'connected_clients': info.get('connected_clients', 0),
                'cache_hits': info.get('keyspace_hits', 0),
                'cache_misses': info.get('keyspace_misses', 0),
                'hit_rate': self._calculate_hit_rate(
                    info.get('keyspace_hits', 0),
                    info.get('keyspace_misses', 0)
                )
            }
            
        except Exception as e:
            logger.error(f"Cache stats error: {e}")
            return {
                'enabled': True,
                'error': str(e)
            }
    
    def _calculate_hit_rate(self, hits: int, misses: int) -> float:
        """Calculate cache hit rate percentage"""
        total = hits + misses
        if total == 0:
            return 0.0
        return round((hits / total) * 100, 2)
    
    def is_healthy(self) -> bool:
        """
        Check if the cache is healthy and responsive
        
        Returns:
            True if cache is healthy, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            # Test with a simple ping
            return self.redis_client.ping()
        except Exception as e:
            logger.warning(f"Cache health check failed: {e}")
            return False


# Global cache instance
nutrition_cache = NutritionCache()


def get_cache() -> NutritionCache:
    """Get the global nutrition cache instance"""
    return nutrition_cache


# Decorator for caching function results
def cache_nutrition_data(cache_key_fn, ttl: Optional[int] = None):
    """
    Decorator to cache function results
    
    Args:
        cache_key_fn: Function to generate cache key from function args
        ttl: Cache TTL in seconds
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            cache = get_cache()
            
            if not cache.enabled:
                # Cache disabled, call function directly
                return func(*args, **kwargs)
            
            # Generate cache key
            try:
                cache_key = cache_key_fn(*args, **kwargs)
            except Exception as e:
                logger.warning(f"Cache key generation failed: {e}")
                return func(*args, **kwargs)
            
            # Try to get from cache
            cached_result = cache.redis_client.get(cache_key) if cache.redis_client else None
            
            if cached_result:
                try:
                    return json.loads(cached_result)
                except Exception as e:
                    logger.warning(f"Cache deserialization failed: {e}")
            
            # Cache miss - call function and cache result
            result = func(*args, **kwargs)
            
            if result is not None and cache.redis_client:
                try:
                    cache_ttl = ttl or cache.default_ttl
                    cache.redis_client.setex(
                        cache_key,
                        cache_ttl,
                        json.dumps(result, default=str)  # default=str for datetime serialization
                    )
                except Exception as e:
                    logger.warning(f"Cache storage failed: {e}")
            
            return result
        
        return wrapper
    return decorator

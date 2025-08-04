import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing authentication state
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  /**
   * Check if user is authenticated by looking for auth token
   */
  const checkAuthStatus = useCallback(() => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token) {
        setIsAuthenticated(true);
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            setUser(null);
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  /**
   * Login function - stores token and user data
   * @param {string} token - Authentication token
   * @param {Object} userData - User information
   */
  const login = useCallback((token, userData = null) => {
    try {
      localStorage.setItem('authToken', token);
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error during login:', error);
    }
  }, []);

  /**
   * Logout function - clears all auth data
   */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  /**
   * Get the current auth token
   * @returns {string|null} Current authentication token
   */
  const getToken = useCallback(() => {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getToken,
    checkAuthStatus
  };
};

export default useAuth;

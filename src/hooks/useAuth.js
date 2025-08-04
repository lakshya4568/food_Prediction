import { useState, useEffect } from "react";

/**
 * Custom hook for managing authentication state
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check if user is authenticated by looking for auth token
   */
  const checkAuthStatus = () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token) {
        setIsAuthenticated(true);
        if (userData) {
          setUser(JSON.parse(userData));
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
  };

  /**
   * Login function - stores token and user data
   * @param {string} token - Authentication token
   * @param {Object} userData - User information
   */
  const login = (token, userData = null) => {
    try {
      localStorage.setItem('authToken', token);
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  /**
   * Logout function - clears all auth data
   */
  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  /**
   * Get the current auth token
   * @returns {string|null} Current authentication token
   */
  const getToken = () => {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

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

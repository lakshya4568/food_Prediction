import RequireAuth from "../components/RequireAuth";

/**
 * Higher-order component for protecting routes
 * @param {React.Component} Component - Component to protect
 * @param {Object} authOptions - Authentication options
 * @returns {React.Component} Protected component
 */
export const withAuth = (Component, authOptions = {}) => {
  return function ProtectedComponent(props) {
    return (
      <RequireAuth {...authOptions}>
        <Component {...props} />
      </RequireAuth>
    );
  };
};

/**
 * Utility function to check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isUserAuthenticated = () => {
  try {
    const token = localStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Utility function to get auth token
 * @returns {string|null} Authentication token
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Utility function to clear authentication data
 */
export const clearAuthData = () => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";

/**
 * Higher-order component to wrap components with error boundary
 * @param {React.Component} Component - Component to wrap
 * @param {Object} errorBoundaryProps - Props for the error boundary
 * @returns {React.Component} Component wrapped with error boundary
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

/**
 * Utility function to create an error boundary wrapped component
 * @param {React.Component} Component - Component to protect
 * @param {string} fallbackMessage - Custom error message
 * @returns {React.Component} Protected component
 */
export const createProtectedComponent = (Component, fallbackMessage) => {
  return withErrorBoundary(Component, { fallbackMessage });
};

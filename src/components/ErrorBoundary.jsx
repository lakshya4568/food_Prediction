import React from "react";
import { FaExclamationTriangle, FaRedo, FaHome } from "react-icons/fa";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaExclamationTriangle className="text-2xl text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-text-dark dark:text-text-light mb-4">
                Oops! Something went wrong
              </h2>
              
              <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
                {this.props.fallbackMessage || 
                  "We encountered an unexpected error while loading this page. Please try again."}
              </p>

              {/* Error details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="text-left mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <summary className="cursor-pointer font-semibold text-red-700 dark:text-red-300 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-red-600 dark:text-red-400 overflow-x-auto">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <FaRedo />
                  <span>Try Again</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full btn-outline flex items-center justify-center space-x-2"
                >
                  <FaHome />
                  <span>Go to Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Render children if there's no error
    return this.props.children;
  }
}

/**
 * Functional component wrapper for ErrorBoundary
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children to protect
 * @param {string} props.fallbackMessage - Custom error message
 * @returns {React.ReactNode} Error boundary wrapper
 */
export const ErrorFallback = ({ children, fallbackMessage }) => {
  return (
    <ErrorBoundary fallbackMessage={fallbackMessage}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;

import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PageSkeleton from "./PageSkeleton";

/**
 * RequireAuth component - protects routes by checking authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children components to render if authenticated
 * @param {string} props.redirectTo - Path to redirect unauthenticated users (default: "/auth")
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 */
const RequireAuth = ({ 
  children, 
  redirectTo = "/auth", 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      // Store the attempted location for redirect after login
      navigate(redirectTo, { 
        state: { from: location },
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, requireAuth, navigate, redirectTo, location]);

  // Reset redirect flag when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <PageSkeleton />;
  }

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If authentication is not required or user is authenticated, render children
  return children;
};

export default RequireAuth;

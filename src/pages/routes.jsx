import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import NutriVision from "../components/NutriVision";
import AuthPage from "../components/AuthPage";
import Dashboard from "../components/Dashboard";
import { PageSkeleton, DashboardSkeleton, SettingsSkeleton } from "../components/PageSkeletons";
import RequireAuth from "../components/RequireAuth";
import ErrorBoundary from "../components/ErrorBoundary";

// Lazy loaded components
const PlannerPage = React.lazy(() => import("../components/PlannerPage"));
const GroceryPage = React.lazy(() => import("../components/GroceryPage"));
const HealthDocsPage = React.lazy(() => import("../components/HealthDocsPage"));
const SettingsPage = React.lazy(() => import("../components/SettingsPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary fallbackMessage="Failed to load the landing page. Please try again.">
        <LandingPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "/nutrivision",
    element: (
      <ErrorBoundary fallbackMessage="Failed to load NutriVision camera. Please try again.">
        <NutriVision />
      </ErrorBoundary>
    ),
  },
  {
    path: "/auth",
    element: (
      <ErrorBoundary fallbackMessage="Failed to load the authentication page. Please try again.">
        <AuthPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <ErrorBoundary fallbackMessage="Failed to load Dashboard. Please try again.">
          <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
          </Suspense>
        </ErrorBoundary>
      </RequireAuth>
    ),
  },
  {
    path: "/planner",
    element: (
      <RequireAuth>
        <ErrorBoundary fallbackMessage="Failed to load the Meal Planner. Please try again.">
          <Suspense fallback={<PageSkeleton />}>
            <PlannerPage />
          </Suspense>
        </ErrorBoundary>
      </RequireAuth>
    ),
  },
  {
    path: "/grocery",
    element: (
      <RequireAuth>
        <ErrorBoundary fallbackMessage="Failed to load the Grocery Assistant. Please try again.">
          <Suspense fallback={<PageSkeleton />}>
            <GroceryPage />
          </Suspense>
        </ErrorBoundary>
      </RequireAuth>
    ),
  },
  {
    path: "/health-docs",
    element: (
      <RequireAuth>
        <ErrorBoundary fallbackMessage="Failed to load Health Documents. Please try again.">
          <Suspense fallback={<PageSkeleton />}>
            <HealthDocsPage />
          </Suspense>
        </ErrorBoundary>
      </RequireAuth>
    ),
  },
  {
    path: "/settings",
    element: (
      <RequireAuth>
        <ErrorBoundary fallbackMessage="Failed to load Settings. Please try again.">
          <Suspense fallback={<SettingsSkeleton />}>
            <SettingsPage />
          </Suspense>
        </ErrorBoundary>
      </RequireAuth>
    ),
  },
]);

const Routes = () => <RouterProvider router={router} />;

export default Routes;
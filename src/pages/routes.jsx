import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import NutriVision from "../components/NutriVision";
import AuthPage from "../components/AuthPage";
import Dashboard from "../components/Dashboard";
import App from "../app/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/nutrivision",
    element: <NutriVision />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

const Routes = () => <RouterProvider router={router} />;

export default Routes;
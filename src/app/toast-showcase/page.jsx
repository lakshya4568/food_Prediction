"use client";

import React, { useState } from "react";
import {
  Toast,
  ToastContainer,
  ToastAction,
} from "../../components/ui/Toast";
import {
  ToastProvider,
  useToast,
} from "../../components/ui/ToastProvider";
import { Button } from "../../components/ui";

// Demo content component that uses toast
function ToastDemo() {
  const { toast, success, error, warning, info, dismissAll, promise } =
    useToast();
  const [position, setPosition] = useState("top-right");
  const [counter, setCounter] = useState(1);

  // Basic toast examples
  const showBasicToasts = () => {
    success(`Success Toast #${counter}`, {
      description: "This is a success message with description!",
    });

    setTimeout(() => {
      error(`Error Toast #${counter}`, {
        description: "Something went wrong, please try again.",
      });
    }, 500);

    setTimeout(() => {
      warning(`Warning Toast #${counter}`, {
        description: "This action cannot be undone.",
      });
    }, 1000);

    setTimeout(() => {
      info(`Info Toast #${counter}`, {
        description: "Here's some helpful information for you.",
      });
    }, 1500);

    setCounter(counter + 1);
  };

  // Toast with action button
  const showActionToast = () => {
    success("File uploaded successfully!", {
      description: "Your file has been processed and saved.",
      action: (
        <ToastAction onClick={() => alert("Undo clicked!")}>Undo</ToastAction>
      ),
      duration: 8000,
    });
  };

  // Persistent toast
  const showPersistentToast = () => {
    toast({
      title: "Persistent Notification",
      description: "This toast will not auto-dismiss. Click the X to close it.",
      variant: "info",
      autoHide: false,
      action: (
        <ToastAction variant="ghost" onClick={() => alert("Action clicked!")}>
          Take Action
        </ToastAction>
      ),
    });
  };

  // Promise-based toast
  const showPromiseToast = () => {
    const mockAsyncOperation = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5
            ? resolve("Data loaded!")
            : reject(new Error("Failed to load"));
        }, 3000);
      });
    };

    promise(mockAsyncOperation(), {
      loading: "Loading data...",
      success: (data) => `Success: ${data}`,
      error: (err) => `Error: ${err.message}`,
    });
  };

  // Custom styled toast
  const showCustomToast = () => {
    toast({
      title: "Custom Styled Toast",
      description: "This toast has custom styling and longer duration.",
      variant: "success",
      duration: 10000,
      className: "border-2 border-green-500 shadow-2xl",
    });
  };

  const positions = [
    "top-right",
    "top-left",
    "top-center",
    "bottom-right",
    "bottom-left",
    "bottom-center",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Toast Notification System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive toast notifications with animations and customization
          </p>
        </div>

        {/* Controls */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Toast Controls
          </h2>

          {/* Position Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Toast Position
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {positions.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    position === pos
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {pos.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Demo Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button onClick={showBasicToasts} className="btn-primary">
              Show All Variants
            </Button>

            <Button onClick={showActionToast} className="btn-secondary">
              Toast with Action
            </Button>

            <Button onClick={showPersistentToast} className="btn-outline">
              Persistent Toast
            </Button>

            <Button onClick={showPromiseToast} className="btn-primary">
              Promise Toast
            </Button>

            <Button onClick={showCustomToast} className="btn-secondary">
              Custom Styled
            </Button>

            <Button onClick={dismissAll} className="btn-outline">
              Clear All Toasts
            </Button>
          </div>
        </div>

        {/* Individual Toast Type Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Success Toasts */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Success Toasts
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => success("Operation completed!")}
                className="btn-primary w-full"
              >
                Simple Success
              </Button>
              <Button
                onClick={() =>
                  success("File saved", {
                    description: "Your file has been saved to the cloud.",
                  })
                }
                className="btn-primary w-full"
              >
                Success with Description
              </Button>
            </div>
          </div>

          {/* Error Toasts */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Error Toasts
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => error("Connection failed!")}
                className="btn-secondary w-full"
              >
                Simple Error
              </Button>
              <Button
                onClick={() =>
                  error("Upload failed", {
                    description:
                      "Please check your internet connection and try again.",
                    duration: 8000,
                  })
                }
                className="btn-secondary w-full"
              >
                Error with Details
              </Button>
            </div>
          </div>

          {/* Warning Toasts */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Warning Toasts
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => warning("Low storage space")}
                className="btn-outline w-full"
              >
                Simple Warning
              </Button>
              <Button
                onClick={() =>
                  warning("Unsaved changes", {
                    description: "You have unsaved changes that will be lost.",
                    action: (
                      <ToastAction onClick={() => alert("Save clicked!")}>
                        Save Now
                      </ToastAction>
                    ),
                  })
                }
                className="btn-outline w-full"
              >
                Warning with Action
              </Button>
            </div>
          </div>

          {/* Info Toasts */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Info Toasts
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => info("New feature available!")}
                className="btn-primary w-full"
              >
                Simple Info
              </Button>
              <Button
                onClick={() =>
                  info("Tutorial tip", {
                    description: "Did you know you can use keyboard shortcuts?",
                    duration: 12000,
                  })
                }
                className="btn-primary w-full"
              >
                Info with Tips
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Examples */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Advanced Examples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Multiple Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Multiple Actions</h3>
              <Button
                onClick={() =>
                  toast({
                    title: "Team invitation",
                    description: "John Doe invited you to join the team.",
                    variant: "info",
                    duration: 15000,
                    action: (
                      <div className="flex space-x-2">
                        <ToastAction onClick={() => alert("Accepted!")}>
                          Accept
                        </ToastAction>
                        <ToastAction
                          variant="ghost"
                          onClick={() => alert("Declined!")}
                        >
                          Decline
                        </ToastAction>
                      </div>
                    ),
                  })
                }
                className="btn-secondary w-full"
              >
                Invitation Toast
              </Button>
            </div>

            {/* Non-dismissible */}
            <div>
              <h3 className="text-lg font-semibold mb-3">System Message</h3>
              <Button
                onClick={() =>
                  toast({
                    title: "System maintenance",
                    description:
                      "Scheduled maintenance will begin in 10 minutes.",
                    variant: "warning",
                    dismissible: false,
                    autoHide: false,
                  })
                }
                className="btn-outline w-full"
              >
                Non-dismissible
              </Button>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="card p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Usage Documentation
          </h2>

          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Basic Usage:
              </h3>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                const &#123; success, error, warning, info &#125; = useToast();
              </code>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Features:
              </h3>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>4 variants: success, error, warning, info</li>
                <li>6 positioning options</li>
                <li>Auto-dismiss with customizable duration</li>
                <li>Progress bar indicator</li>
                <li>Action buttons support</li>
                <li>Promise-based toasts for async operations</li>
                <li>Dark mode support</li>
                <li>Fully accessible with ARIA attributes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 dark:text-gray-400">
            All toasts support animations, dark mode, and accessibility features
          </p>
          <div className="mt-4">
            <Button
              onClick={() => {
                document.documentElement.classList.toggle("dark");
              }}
              className="btn-outline"
            >
              Toggle Dark Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with ToastProvider wrapper
export default function ToastShowcase() {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      <ToastDemo />
    </ToastProvider>
  );
}

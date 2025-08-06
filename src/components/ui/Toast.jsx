"use client";

import React, { useEffect } from "react";
import { cn } from "../../lib/utils";

// Toast variants with their corresponding styles
const toastVariants = {
  success: {
    className:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // Check circle
  },
  error: {
    className:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
    iconPath:
      "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", // X circle
  },
  warning: {
    className:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
    iconPath:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z", // Warning triangle
  },
  info: {
    className:
      "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // Info circle
  },
};

// Toast positions
const toastPositions = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 transform -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
};

// Individual Toast Component
export const Toast = React.forwardRef(
  (
    {
      id,
      variant = "info",
      title,
      description,
      action,
      onDismiss,
      dismissible = true,
      autoHide = true,
      duration = 5000,
      className,
      ...props
    },
    ref
  ) => {
    const variantStyles = toastVariants[variant];

    useEffect(() => {
      if (autoHide && duration > 0) {
        const timer = setTimeout(() => {
          onDismiss?.(id);
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [autoHide, duration, onDismiss, id]);

    return (
      <div
        ref={ref}
        role={variant === "error" ? "alert" : "status"}
        aria-live="assertive"
        className={cn(
          "relative flex w-full max-w-sm items-start space-x-3 rounded-lg border p-4 shadow-lg",
          "animate-in slide-in-from-top-full data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-full",
          "transition-all duration-300 ease-in-out",
          variantStyles.className,
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={variantStyles.iconPath}
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <div className="text-sm font-medium">{title}</div>}
          {description && (
            <div className={cn("text-sm", title ? "mt-1 opacity-90" : "")}>
              {description}
            </div>
          )}
          {action && <div className="mt-3">{action}</div>}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={() => onDismiss?.(id)}
            className="flex-shrink-0 ml-4 rounded-md p-1.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Progress bar for auto-dismiss */}
        {autoHide && duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-current opacity-30 animate-[progress_var(--duration)_linear_forwards]"
              style={{ "--duration": `${duration}ms` }}
            />
          </div>
        )}
      </div>
    );
  }
);

Toast.displayName = "Toast";

// Toast Container Component
export const ToastContainer = ({
  position = "top-right",
  children,
  className,
  maxToasts = 5,
}) => {
  const positionClasses = toastPositions[position];

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed z-[100] flex flex-col space-y-2 pointer-events-none",
        positionClasses,
        className
      )}
      style={{
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <div className="flex flex-col space-y-2 pointer-events-auto">
        {Array.isArray(children) ? children.slice(0, maxToasts) : children}
      </div>
    </div>
  );
};

// Toast Action Button Component
export const ToastAction = React.forwardRef(
  (
    { children, variant = "default", size = "sm", className, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Size variants
          size === "sm" && "h-7 px-2",
          size === "md" && "h-8 px-3",
          // Variant styles
          variant === "default" &&
            "bg-transparent border border-current hover:bg-current/10",
          variant === "ghost" && "hover:bg-current/10",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToastAction.displayName = "ToastAction";

// Export variants for easy access
export const toastVariantNames = Object.keys(toastVariants);
export const toastPositionNames = Object.keys(toastPositions);

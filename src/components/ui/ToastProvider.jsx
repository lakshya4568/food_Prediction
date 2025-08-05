"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useReducer,
} from "react";
import { Toast, ToastContainer } from "./Toast";

// Toast state management
const toastReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts],
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      };
    case "CLEAR_TOASTS":
      return {
        ...state,
        toasts: [],
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.id ? { ...toast, ...action.updates } : toast
        ),
      };
    default:
      return state;
  }
};

// Toast Context
const ToastContext = createContext(null);

// Hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({
  children,
  position = "top-right",
  maxToasts = 5,
  defaultDuration = 5000,
}) => {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
  });

  // Generate unique ID for toasts
  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  // Add a new toast
  const toast = useCallback(
    (options) => {
      const id = options.id || generateId();

      const newToast = {
        id,
        variant: "info",
        autoHide: true,
        duration: defaultDuration,
        dismissible: true,
        ...options,
        createdAt: Date.now(),
      };

      dispatch({ type: "ADD_TOAST", toast: newToast });
      return id;
    },
    [generateId, defaultDuration]
  );

  // Convenience methods for different toast types
  const success = useCallback(
    (title, options = {}) => {
      return toast({ ...options, title, variant: "success" });
    },
    [toast]
  );

  const error = useCallback(
    (title, options = {}) => {
      return toast({ ...options, title, variant: "error" });
    },
    [toast]
  );

  const warning = useCallback(
    (title, options = {}) => {
      return toast({ ...options, title, variant: "warning" });
    },
    [toast]
  );

  const info = useCallback(
    (title, options = {}) => {
      return toast({ ...options, title, variant: "info" });
    },
    [toast]
  );

  // Remove a specific toast
  const dismiss = useCallback((id) => {
    dispatch({ type: "REMOVE_TOAST", id });
  }, []);

  // Clear all toasts
  const dismissAll = useCallback(() => {
    dispatch({ type: "CLEAR_TOASTS" });
  }, []);

  // Update an existing toast
  const updateToast = useCallback((id, updates) => {
    dispatch({ type: "UPDATE_TOAST", id, updates });
  }, []);

  // Promise-based toast for async operations
  const promise = useCallback(
    (promise, options = {}) => {
      const {
        loading = "Loading...",
        success: successMessage = "Success!",
        error: errorMessage = "Something went wrong!",
        ...toastOptions
      } = options;

      const id = toast({
        ...toastOptions,
        title: loading,
        variant: "info",
        autoHide: false,
        dismissible: false,
      });

      promise
        .then((result) => {
          updateToast(id, {
            title:
              typeof successMessage === "function"
                ? successMessage(result)
                : successMessage,
            variant: "success",
            autoHide: true,
            dismissible: true,
            duration: defaultDuration,
          });
          return result;
        })
        .catch((error) => {
          updateToast(id, {
            title:
              typeof errorMessage === "function"
                ? errorMessage(error)
                : errorMessage,
            variant: "error",
            autoHide: true,
            dismissible: true,
            duration: defaultDuration,
          });
          throw error;
        });

      return promise;
    },
    [toast, updateToast, defaultDuration]
  );

  const contextValue = {
    toasts: state.toasts,
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
    updateToast,
    promise,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position={position} maxToasts={maxToasts}>
        {state.toasts.map((toastItem) => (
          <Toast
            key={toastItem.id}
            id={toastItem.id}
            variant={toastItem.variant}
            title={toastItem.title}
            description={toastItem.description}
            action={toastItem.action}
            onDismiss={dismiss}
            dismissible={toastItem.dismissible}
            autoHide={toastItem.autoHide}
            duration={toastItem.duration}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Higher-order component for easier integration
export const withToast = (Component) => {
  return React.forwardRef((props, ref) => {
    const toast = useToast();
    return <Component {...props} ref={ref} toast={toast} />;
  });
};

// Standalone toast function (for use outside of React components)
let toastInstance = null;

export const setToastInstance = (instance) => {
  toastInstance = instance;
};

export const standaloneToast = {
  success: (title, options) => toastInstance?.success(title, options),
  error: (title, options) => toastInstance?.error(title, options),
  warning: (title, options) => toastInstance?.warning(title, options),
  info: (title, options) => toastInstance?.info(title, options),
  dismiss: (id) => toastInstance?.dismiss(id),
  dismissAll: () => toastInstance?.dismissAll(),
};

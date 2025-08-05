import { forwardRef } from "react";
import { clsx } from "clsx";

const ProgressBar = forwardRef(
  (
    {
      progress = 0,
      className,
      size = "md",
      variant = "primary",
      showPercentage = true,
      showLabel = false,
      label = "",
      animated = true,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    // Ensure progress is between 0 and 100
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);

    const sizeClasses = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
      xl: "h-4",
    };

    const variants = {
      primary: {
        bg: "bg-gray-200 dark:bg-gray-700",
        fill: "bg-gradient-to-r from-blue-500 to-blue-600",
      },
      success: {
        bg: "bg-gray-200 dark:bg-gray-700",
        fill: "bg-gradient-to-r from-green-500 to-emerald-600",
      },
      warning: {
        bg: "bg-gray-200 dark:bg-gray-700",
        fill: "bg-gradient-to-r from-yellow-500 to-orange-500",
      },
      danger: {
        bg: "bg-gray-200 dark:bg-gray-700",
        fill: "bg-gradient-to-r from-red-500 to-red-600",
      },
      upload: {
        bg: "bg-gray-200 dark:bg-gray-700",
        fill: "bg-gradient-to-r from-purple-500 to-pink-500",
      },
    };

    const containerClasses = clsx(
      "w-full",
      "rounded-full",
      "overflow-hidden",
      variants[variant].bg,
      sizeClasses[size],
      className
    );

    const fillClasses = clsx(
      "h-full",
      "transition-all",
      "duration-300",
      "ease-out",
      "rounded-full",
      variants[variant].fill,
      {
        "animate-pulse": indeterminate,
        "shadow-sm": size === "lg" || size === "xl",
      }
    );

    const progressStyle = indeterminate
      ? { width: "100%" }
      : { width: `${normalizedProgress}%` };

    return (
      <div ref={ref} className="space-y-2" {...props}>
        {/* Label and Percentage */}
        {(showLabel || showPercentage) && (
          <div className="flex justify-between items-center text-sm">
            {showLabel && (
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {label}
              </span>
            )}
            {showPercentage && !indeterminate && (
              <span className="text-gray-600 dark:text-gray-400 font-mono">
                {Math.round(normalizedProgress)}%
              </span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className={containerClasses}>
          <div className={fillClasses} style={progressStyle}>
            {/* Animated stripes for enhanced visual effect */}
            {animated && !indeterminate && normalizedProgress > 0 && (
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

// Specialized File Upload Progress Bar Component
const FileUploadProgress = forwardRef(
  (
    {
      progress = 0,
      fileName = "",
      fileSize = 0,
      uploadSpeed = 0,
      timeRemaining = 0,
      status = "uploading", // 'uploading', 'completed', 'error', 'paused'
      onCancel,
      className,
      ...props
    },
    ref
  ) => {
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatTime = (seconds) => {
      if (seconds < 60) return `${Math.round(seconds)}s`;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    };

    const getVariantByStatus = () => {
      switch (status) {
        case "completed":
          return "success";
        case "error":
          return "danger";
        case "paused":
          return "warning";
        default:
          return "upload";
      }
    };

    const getStatusIcon = () => {
      switch (status) {
        case "completed":
          return (
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          );
        case "error":
          return (
            <svg
              className="w-4 h-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          );
        case "paused":
          return (
            <svg
              className="w-4 h-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          );
        default:
          return (
            <svg
              className="w-4 h-4 text-blue-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={clsx(
          "p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm",
          className
        )}
        {...props}
      >
        {/* File Info Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {fileName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(fileSize)}
              </p>
            </div>
          </div>

          {/* Cancel Button */}
          {onCancel && status === "uploading" && (
            <button
              onClick={onCancel}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Cancel upload"
            >
              <svg
                className="w-4 h-4"
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
        </div>

        {/* Progress Bar */}
        <ProgressBar
          progress={progress}
          variant={getVariantByStatus()}
          showPercentage={false}
          indeterminate={status === "uploading" && progress === 0}
          className="mb-2"
        />

        {/* Upload Details */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>
            {status === "completed"
              ? "Upload completed"
              : status === "error"
              ? "Upload failed"
              : status === "paused"
              ? "Upload paused"
              : `${Math.round(progress)}% completed`}
          </span>

          {status === "uploading" && uploadSpeed > 0 && (
            <span>
              {formatFileSize(uploadSpeed)}/s
              {timeRemaining > 0 && ` • ${formatTime(timeRemaining)} remaining`}
            </span>
          )}
        </div>
      </div>
    );
  }
);

FileUploadProgress.displayName = "FileUploadProgress";

export default ProgressBar;
export { FileUploadProgress };

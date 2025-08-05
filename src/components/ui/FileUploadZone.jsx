"use client";

import { useState, useRef, useCallback } from "react";
import { clsx } from "clsx";

const FileUploadZone = ({
  onFileSelect,
  acceptedTypes = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = useCallback(
    (file) => {
      // Reset previous errors
      setError(null);

      // Check file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        setError(`File size must be less than ${maxSizeMB}MB`);
        return false;
      }

      // Check file type if acceptedTypes is specified
      if (acceptedTypes && acceptedTypes !== "*") {
        const acceptedTypesArray = acceptedTypes
          .split(",")
          .map((type) => type.trim());
        const isValidType = acceptedTypesArray.some((type) => {
          if (type.endsWith("/*")) {
            const baseType = type.slice(0, -2);
            return file.type.startsWith(baseType);
          }
          return file.type === type;
        });

        if (!isValidType) {
          setError(`File type not supported. Accepted types: ${acceptedTypes}`);
          return false;
        }
      }

      return true;
    },
    [maxSize, acceptedTypes]
  );

  const handleFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      if (!multiple && fileArray.length > 1) {
        setError("Please select only one file");
        return;
      }

      const validFiles = fileArray.filter(validateFile);

      if (validFiles.length > 0) {
        onFileSelect?.(multiple ? validFiles : validFiles[0]);
      }
    },
    [multiple, onFileSelect, validateFile]
  );

  const handleDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      handleFiles(droppedFiles);
    },
    [disabled, handleFiles]
  );

  const handleFileInputChange = useCallback(
    (e) => {
      const selectedFiles = e.target.files;
      handleFiles(selectedFiles);
      // Reset the input so the same file can be selected again
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const baseClasses = [
    "relative",
    "border-2",
    "border-dashed",
    "rounded-lg",
    "p-8",
    "text-center",
    "transition-all",
    "duration-200",
    "cursor-pointer",
  ];

  const stateClasses = {
    default: [
      "border-gray-300",
      "bg-gray-50",
      "hover:border-gray-400",
      "hover:bg-gray-100",
      "dark:border-gray-600",
      "dark:bg-gray-800",
      "dark:hover:border-gray-500",
      "dark:hover:bg-gray-700",
    ],
    dragOver: [
      "border-blue-500",
      "bg-blue-50",
      "scale-[1.02]",
      "dark:border-blue-400",
      "dark:bg-blue-900/20",
    ],
    disabled: [
      "border-gray-200",
      "bg-gray-100",
      "cursor-not-allowed",
      "opacity-50",
      "dark:border-gray-700",
      "dark:bg-gray-900",
    ],
    error: [
      "border-red-500",
      "bg-red-50",
      "dark:border-red-400",
      "dark:bg-red-900/20",
    ],
  };

  const getStateClasses = () => {
    if (disabled) return stateClasses.disabled;
    if (error) return stateClasses.error;
    if (isDragOver) return stateClasses.dragOver;
    return stateClasses.default;
  };

  const dropZoneClasses = clsx(baseClasses, getStateClasses(), className);

  return (
    <div
      className={dropZoneClasses}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      {...props}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple={multiple}
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
      />

      {children || (
        <div className="space-y-4">
          {/* Upload Icon */}
          <div className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500">
            {isDragOver ? (
              <svg
                className="w-full h-full text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            ) : (
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isDragOver ? "Drop files here" : "Drag and drop files here"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse files
            </p>
            {acceptedTypes && acceptedTypes !== "*" && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Supported formats: {acceptedTypes}
              </p>
            )}
            {maxSize && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Maximum file size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md dark:bg-red-900/20 dark:border-red-700">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;

import React, { useState, useCallback } from "react";
import { FaUpload, FaFilePdf, FaImage, FaTimes, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

// File validation constants (outside component to avoid dependency issues)
const ALLOWED_TYPES = ['application/pdf', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_EXTENSIONS = ['.pdf', '.png'];

/**
 * Drag-and-drop file uploader for medical documents
 * Supports PDF and PNG files with client-side validation
 */
const MedicalDocumentUploader = ({ onFileUpload, onFileRemove, isProcessing = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  /**
   * Validates uploaded files against size and type constraints
   */
  const validateFile = useCallback((file) => {
    const errors = [];

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`Invalid file type. Only PDF and PNG files are allowed.`);
    }

    // Check file extension as secondary validation
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      errors.push(`Invalid file extension. Only .pdf and .png files are allowed.`);
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit.`);
    }

    return errors;
  }, []);

  /**
   * Processes selected files and updates state
   */
  const processFiles = useCallback((files) => {
    const newErrors = [];
    const validFiles = [];

    Array.from(files).forEach((file) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        newErrors.push(...fileErrors.map(error => `${file.name}: ${error}`));
      } else {
        // Create file object with metadata
        const fileObj = {
          id: Date.now() + Math.random(), // Simple unique ID
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          status: 'ready' // ready, uploading, success, error
        };
        validFiles.push(fileObj);
      }
    });

    // Update errors
    setErrors(newErrors);

    // Add valid files to uploaded files list
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      
      // Notify parent component
      validFiles.forEach(fileObj => {
        if (onFileUpload) {
          onFileUpload(fileObj);
        }
      });
    }
  }, [onFileUpload, validateFile]);

  /**
   * Handle drag events
   */
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  /**
   * Handle drop event
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  /**
   * Handle file input change
   */
  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  /**
   * Remove uploaded file
   */
  const removeFile = useCallback((fileId) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (onFileRemove && fileToRemove) {
      onFileRemove(fileToRemove);
    }
  }, [uploadedFiles, onFileRemove]);

  /**
   * Clear all errors
   */
  const clearErrors = () => {
    setErrors([]);
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  /**
   * Get file type icon
   */
  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return <FaFilePdf className="text-red-500" />;
    }
    if (type === 'image/png') {
      return <FaImage className="text-blue-500" />;
    }
    return <FaUpload className="text-gray-500" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drag and Drop Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${dragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Upload Icon and Text */}
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-800/50 rounded-full flex items-center justify-center">
            <FaUpload className={`text-2xl ${dragActive ? 'text-primary-600 dark:text-primary-400' : 'text-primary-500 dark:text-primary-400'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
              Upload Medical Documents
            </h3>
            <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Supports PDF and PNG files up to 10MB
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          multiple
          accept=".pdf,.png"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Processing documents...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Upload Errors
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={clearErrors}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-text-dark dark:text-text-light">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          {uploadedFiles.map((fileObj) => (
            <div
              key={fileObj.id}
              className="flex items-center justify-between p-3 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(fileObj.type)}
                <div>
                  <p className="text-sm font-medium text-text-dark dark:text-text-light">
                    {fileObj.name}
                  </p>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    {formatFileSize(fileObj.size)} • {fileObj.type.includes('pdf') ? 'PDF Document' : 'PNG Image'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {fileObj.status === 'success' && (
                  <FaCheckCircle className="text-green-500" />
                )}
                {fileObj.status === 'error' && (
                  <FaExclamationTriangle className="text-red-500" />
                )}
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalDocumentUploader;

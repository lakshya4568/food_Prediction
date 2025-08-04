import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaHeartbeat, FaDownload, FaArrowLeft, FaChartLine, FaUpload } from "react-icons/fa";
import MedicalDocumentUploader from "./MedicalDocumentUploader";

const HealthDocsPage = () => {
  const navigate = useNavigate();
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isProcessing, _setIsProcessing] = useState(false);

  const goBack = () => {
    navigate("/dashboard");
  };

  /**
   * Handle file upload from the uploader component
   */
  const handleFileUpload = (fileObj) => {
    console.log("File uploaded:", fileObj);
    setUploadedDocuments(prev => [...prev, fileObj]);
    // TODO: Implement actual file processing in subtask 16.2
  };

  /**
   * Handle file removal from the uploader component
   */
  const handleFileRemove = (fileObj) => {
    console.log("File removed:", fileObj);
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== fileObj.id));
  };

  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay">
      {/* Header */}
      <header className="bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md shadow-lg dark:shadow-glow-green sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-text-muted-light dark:text-text-muted-dark hover:text-text-dark dark:hover:text-text-light transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Dashboard</span>
            </button>

            <div className="text-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-dark dark:text-text-light">
                <span className="text-text-dark dark:text-text-light">
                  Health
                </span>
                <span className="text-primary-600 dark:text-primary-400">
                  Documents
                </span>
              </h1>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Your nutrition reports and health insights
              </p>
            </div>

            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-accent-100 dark:bg-accent-800/50 rounded-full flex items-center justify-center">
            <FaFileAlt className="text-4xl text-accent-600 dark:text-accent-400" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-text-dark dark:text-text-light">
              Health Documentation Center
            </h2>
            <p className="text-lg text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">
              Access comprehensive nutrition reports, health insights, and downloadable documentation. 
              Track your progress with detailed analytics and share reports with healthcare professionals.
            </p>
          </div>

          {/* Document Upload Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800/50 rounded-xl flex items-center justify-center">
                  <FaUpload className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-dark dark:text-text-light">
                    Upload Medical Documents
                  </h3>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    Upload your medical reports, prescriptions, and lab results for AI-powered analysis
                  </p>
                </div>
              </div>
              
              <MedicalDocumentUploader
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                isProcessing={isProcessing}
              />
              
              {uploadedDocuments.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>{uploadedDocuments.length}</strong> document{uploadedDocuments.length > 1 ? 's' : ''} ready for processing.
                    Your medical information will be extracted and analyzed securely.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Document Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="card p-6 hover:shadow-lg dark:hover:shadow-glow-green transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-2xl text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
                Nutrition Reports
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
                Detailed weekly and monthly nutrition analysis
              </p>
              <button className="btn-secondary text-sm w-full flex items-center justify-center space-x-2">
                <FaDownload />
                <span>Download Report</span>
              </button>
            </div>

            <div className="card p-6 hover:shadow-lg dark:hover:shadow-glow-green transition-all duration-300">
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaHeartbeat className="text-2xl text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
                Health Insights
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
                AI-powered health recommendations and trends
              </p>
              <button className="btn-secondary text-sm w-full flex items-center justify-center space-x-2">
                <FaDownload />
                <span>Download Insights</span>
              </button>
            </div>

            <div className="card p-6 hover:shadow-lg dark:hover:shadow-glow-green transition-all duration-300">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaFileAlt className="text-2xl text-accent-600 dark:text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-2">
                Medical Summary
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
                Shareable summary for healthcare providers
              </p>
              <button className="btn-secondary text-sm w-full flex items-center justify-center space-x-2">
                <FaDownload />
                <span>Download Summary</span>
              </button>
            </div>
          </div>

          {/* Recent Documents */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="card p-6 text-left">
              <h3 className="text-xl font-bold text-text-dark dark:text-text-light mb-6">
                Recent Documents
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    name: "Weekly Nutrition Report - Week 1",
                    date: "Jan 15, 2025",
                    type: "Nutrition Report",
                    size: "2.3 MB"
                  },
                  {
                    name: "Monthly Health Insights - December",
                    date: "Jan 01, 2025",
                    type: "Health Insights",
                    size: "1.8 MB"
                  },
                  {
                    name: "Dietary Analysis Summary",
                    date: "Dec 28, 2024",
                    type: "Medical Summary",
                    size: "890 KB"
                  }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-surface-hover-light dark:bg-surface-hover-dark rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800/50 rounded-lg flex items-center justify-center">
                        <FaFileAlt className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-dark dark:text-text-light">
                          {doc.name}
                        </h4>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                          {doc.type} • {doc.date} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                      <FaDownload />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-800/50 text-accent-700 dark:text-accent-300 text-sm font-medium">
              📄 Coming Soon - Advanced document generation and sharing
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthDocsPage;

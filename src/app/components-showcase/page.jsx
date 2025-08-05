"use client";

import { useState } from "react";
import Button from "../../components/ui/Button";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";
import FileUploadZone from "../../components/ui/FileUploadZone";
import ProgressBar, {
  FileUploadProgress,
} from "../../components/ui/ProgressBar";

export default function ComponentsShowcase() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    console.log("Selected file:", file);

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            NutriVision UI Components Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A comprehensive display of all reusable UI components built with
            Tailwind CSS
          </p>
        </div>

        {/* Buttons Section */}
        <Card className="mb-8" padding="lg">
          <CardHeader>
            <CardTitle size="xl">Button Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Button Variants */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Button Variants
                </h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="success">Success Button</Button>
                  <Button variant="danger">Danger Button</Button>
                  <Button variant="outline">Outline Button</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Button Sizes
                </h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* Button States */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Button States
                </h4>
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <Card className="mb-8" padding="lg">
          <CardHeader>
            <CardTitle size="xl">Card Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Default Card */}
              <Card variant="default" padding="md" border>
                <CardHeader>
                  <CardTitle size="lg">Default Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    This is a default card with border styling. Perfect for
                    displaying content with clean separation.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="primary">
                    Action
                  </Button>
                </CardFooter>
              </Card>

              {/* Elevated Card */}
              <Card variant="elevated" padding="md" hover>
                <CardHeader>
                  <CardTitle size="lg">Elevated Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    An elevated card with shadow effects and hover animations.
                    Hover over this card to see the effect.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="success">
                    Hover Me
                  </Button>
                </CardFooter>
              </Card>

              {/* Glass Card */}
              <Card variant="glass" padding="md">
                <CardHeader>
                  <CardTitle size="lg">Glass Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    A glassmorphism-style card with backdrop blur and
                    transparency effects.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline">
                    Modern
                  </Button>
                </CardFooter>
              </Card>

              {/* Gradient Card */}
              <Card padding="md" gradient rounded="xl">
                <CardHeader>
                  <CardTitle size="lg">Gradient Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    A card with gradient background for enhanced visual appeal.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="secondary">
                    Gradient
                  </Button>
                </CardFooter>
              </Card>

              {/* Outlined Card */}
              <Card variant="outlined" padding="lg">
                <CardHeader>
                  <CardTitle size="lg">Outlined Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    A card with prominent border styling and larger padding.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="danger">
                    Border
                  </Button>
                </CardFooter>
              </Card>

              {/* Content Showcase */}
              <Card padding="md" shadow="lg">
                <CardHeader>
                  <CardTitle size="lg">Content Showcase</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>• Lists work great in cards</li>
                    <li>• Flexible content layout</li>
                    <li>• Responsive design</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <span className="text-sm text-gray-500">
                    Card content example
                  </span>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card className="mb-8" padding="lg">
          <CardHeader>
            <CardTitle size="xl">File Upload Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Upload Zone */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Drag & Drop Upload Zone
                </h4>
                <FileUploadZone
                  onFileSelect={handleFileSelect}
                  acceptedTypes="image/*"
                  maxSize={10 * 1024 * 1024}
                  className="max-w-md mx-auto"
                />
                {selectedFile && (
                  <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Selected: {selectedFile.name}</p>
                    <p>Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                )}
              </div>

              {/* Progress Bars */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Progress Bar Variants
                </h4>
                <div className="space-y-4 max-w-md mx-auto">
                  <ProgressBar
                    progress={25}
                    variant="primary"
                    showLabel
                    label="Primary Progress"
                  />
                  <ProgressBar
                    progress={50}
                    variant="success"
                    showLabel
                    label="Success Progress"
                  />
                  <ProgressBar
                    progress={75}
                    variant="warning"
                    showLabel
                    label="Warning Progress"
                  />
                  <ProgressBar
                    progress={90}
                    variant="danger"
                    showLabel
                    label="Danger Progress"
                  />
                  <ProgressBar
                    progress={0}
                    variant="upload"
                    indeterminate
                    showLabel
                    label="Indeterminate"
                  />
                </div>
              </div>

              {/* File Upload Progress */}
              {selectedFile && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    File Upload Progress
                  </h4>
                  <div className="max-w-md mx-auto">
                    <FileUploadProgress
                      progress={uploadProgress}
                      fileName={selectedFile.name}
                      fileSize={selectedFile.size}
                      uploadSpeed={isUploading ? 1024 * 500 : 0} // 500 KB/s
                      timeRemaining={
                        isUploading ? (100 - uploadProgress) * 0.5 : 0
                      }
                      status={
                        uploadProgress === 100
                          ? "completed"
                          : isUploading
                          ? "uploading"
                          : "paused"
                      }
                      onCancel={() => {
                        setIsUploading(false);
                        setUploadProgress(0);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo Section */}
        <Card className="mb-8" padding="lg">
          <CardHeader>
            <CardTitle size="xl">Interactive Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Test all components together in an interactive environment
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="primary"
                  onClick={() => alert("Primary button clicked!")}
                >
                  Test Primary
                </Button>
                <Button
                  variant="success"
                  onClick={() => console.log("Success button clicked!")}
                >
                  Log to Console
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadProgress(Math.floor(Math.random() * 100));
                  }}
                >
                  Random Progress
                </Button>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>• Click buttons to test functionality</p>
                <p>• Drag files to the upload zone</p>
                <p>• Hover over cards to see animations</p>
                <p>• Check browser console for logs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 dark:text-gray-400">
            All components are built with Tailwind CSS and support dark mode
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                document.documentElement.classList.toggle("dark");
              }}
            >
              Toggle Dark Mode
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

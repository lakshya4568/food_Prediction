import React from "react";
import {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  ListItemSkeleton,
  StatCardSkeleton,
  ButtonSkeleton,
  ImageSkeleton,
  ProgressSkeleton,
  ChartSkeleton,
} from "./Skeleton";

/**
 * Page header skeleton with navigation
 */
export const PageHeaderSkeleton = ({ showBackButton = false }) => {
  return (
    <header className="bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {showBackButton && (
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4" />
              <TextSkeleton width="w-32" />
            </div>
          )}

          <div className="text-center">
            <TextSkeleton size="xl" width="w-48" />
            <TextSkeleton size="sm" width="w-40" className="mt-1" />
          </div>

          <div className="flex space-x-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        </div>
      </div>
    </header>
  );
};

/**
 * Dashboard-specific skeleton layout
 */
export const DashboardPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay">
      <PageHeaderSkeleton />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Welcome Section */}
        <div className="mb-8">
          <TextSkeleton size="3xl" width="w-96" />
          <TextSkeleton size="base" width="w-80" className="mt-2" />
        </div>

        {/* Quick Action Button */}
        <div className="mb-8">
          <ButtonSkeleton size="lg" className="w-48 h-12" />
        </div>

        {/* Navigation Cards */}
        <div className="mb-8">
          <TextSkeleton size="xl" width="w-32" className="mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="card p-4 text-center">
                <AvatarSkeleton size="lg" className="mx-auto mb-3 rounded-xl" />
                <TextSkeleton size="sm" width="w-20" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <TextSkeleton size="xl" width="w-40" />
            <ButtonSkeleton size="sm" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <ListItemSkeleton key={index} showAvatar={true} />
            ))}
          </div>
        </div>

        {/* Chart/Progress Section */}
        <ChartSkeleton />
      </main>
    </div>
  );
};

/**
 * Settings page skeleton
 */
export const SettingsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay">
      <PageHeaderSkeleton showBackButton={true} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-center space-x-4">
              <AvatarSkeleton size="2xl" />
              <div className="flex-1">
                <TextSkeleton size="xl" width="w-32" />
                <TextSkeleton size="base" width="w-48" className="mt-1" />
                <TextSkeleton size="sm" width="w-40" className="mt-1" />
              </div>
              <ButtonSkeleton />
            </div>
          </div>

          {/* Settings Sections */}
          {Array.from({ length: 3 }).map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <TextSkeleton size="lg" width="w-24" />
              <div className="card divide-y divide-primary-200 dark:divide-primary-700">
                {Array.from({ length: 2 }).map((_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <AvatarSkeleton size="md" className="rounded-lg" />
                      <div>
                        <TextSkeleton size="base" width="w-32" />
                        <TextSkeleton size="sm" width="w-48" className="mt-1" />
                      </div>
                    </div>
                    <Skeleton className="w-8 h-6 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

/**
 * Planner page skeleton
 */
export const PlannerPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay">
      <PageHeaderSkeleton showBackButton={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <AvatarSkeleton size="3xl" className="mx-auto" />
          <div className="space-y-4">
            <TextSkeleton size="3xl" width="w-48" className="mx-auto" />
            <div className="space-y-2">
              <TextSkeleton size="base" width="w-96" className="mx-auto" />
              <TextSkeleton size="base" width="w-80" className="mx-auto" />
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <TextSkeleton size="xl" width="w-40" />
              <ButtonSkeleton />
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <TextSkeleton
                  key={index}
                  size="sm"
                  width="w-8"
                  className="mx-auto"
                />
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 h-32"
                >
                  <TextSkeleton size="base" width="w-6" className="mb-2" />
                  <div className="space-y-1">
                    <TextSkeleton size="xs" />
                    <TextSkeleton size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} showHeader={true} contentLines={2} />
            ))}
          </div>
        </div>

        {/* Recent Plans */}
        <div className="card p-6">
          <TextSkeleton size="xl" width="w-32" className="mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <ListItemSkeleton key={index} showAvatar={true} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * Grocery page skeleton
 */
export const GroceryPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay">
      <PageHeaderSkeleton showBackButton={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <AvatarSkeleton size="3xl" className="mx-auto" />
          <div className="space-y-4">
            <TextSkeleton size="3xl" width="w-64" className="mx-auto" />
            <div className="space-y-2">
              <TextSkeleton size="base" width="w-96" className="mx-auto" />
              <TextSkeleton size="base" width="w-80" className="mx-auto" />
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton
              key={index}
              showHeader={false}
              contentLines={2}
              className="text-center p-6"
            >
              <AvatarSkeleton size="lg" className="mx-auto mb-4 rounded-xl" />
            </CardSkeleton>
          ))}
        </div>

        {/* Shopping List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-6">
              <TextSkeleton size="xl" width="w-32" />
              <ButtonSkeleton />
            </div>

            {/* Categories */}
            <div className="flex space-x-4 mb-6 border-b pb-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ButtonSkeleton key={index} size="sm" />
              ))}
            </div>

            {/* Shopping Items */}
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <div>
                      <TextSkeleton size="base" width="w-32" />
                      <TextSkeleton size="sm" width="w-24" className="mt-1" />
                    </div>
                  </div>
                  <div className="text-right">
                    <TextSkeleton size="base" width="w-12" />
                    <TextSkeleton size="sm" width="w-16" className="mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} showHeader={true} contentLines={3} />
            ))}
          </div>
        </div>

        {/* Store Locations */}
        <CardSkeleton showHeader={true} contentLines={2} />
      </main>
    </div>
  );
};

/**
 * Health Docs page skeleton
 */
export const HealthDocsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay">
      <PageHeaderSkeleton showBackButton={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <AvatarSkeleton size="3xl" className="mx-auto" />
          <div className="space-y-4">
            <TextSkeleton size="3xl" width="w-48" className="mx-auto" />
            <div className="space-y-2">
              <TextSkeleton size="base" width="w-96" className="mx-auto" />
              <TextSkeleton size="base" width="w-80" className="mx-auto" />
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <AvatarSkeleton size="md" className="rounded-xl" />
              <div>
                <TextSkeleton size="xl" width="w-48" />
                <TextSkeleton size="sm" width="w-64" className="mt-1" />
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
              <AvatarSkeleton
                size="2xl"
                className="mx-auto mb-4 rounded-full"
              />
              <TextSkeleton size="lg" width="w-64" className="mx-auto mb-2" />
              <TextSkeleton size="base" width="w-48" className="mx-auto mb-4" />
              <TextSkeleton size="sm" width="w-40" className="mx-auto" />
            </div>
          </div>
        </div>

        {/* Document Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton
              key={index}
              showHeader={false}
              contentLines={2}
              className="text-center p-6"
            >
              <AvatarSkeleton size="lg" className="mx-auto mb-4 rounded-xl" />
            </CardSkeleton>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton showHeader={true} showFooter={true} contentLines={0}>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ListItemSkeleton key={index} showAvatar={true} />
                ))}
              </div>
            </CardSkeleton>
          </div>

          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <CardSkeleton key={index} showHeader={true} contentLines={3} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * Components showcase skeleton
 */
export const ComponentsShowcaseSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl animate-pulse">
        {/* Header */}
        <div className="text-center mb-12">
          <TextSkeleton size="3xl" width="w-96" className="mx-auto mb-4" />
          <TextSkeleton size="lg" width="w-80" className="mx-auto" />
        </div>

        {/* Sections */}
        {Array.from({ length: 4 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="card mb-8 p-8">
            <div className="mb-6">
              <TextSkeleton size="xl" width="w-48" />
            </div>

            <div className="space-y-6">
              {/* Subsections */}
              {Array.from({ length: 3 }).map((_, subIndex) => (
                <div key={subIndex}>
                  <TextSkeleton size="lg" width="w-32" className="mb-3" />
                  <div className="flex flex-wrap gap-4">
                    {Array.from({ length: 5 }).map((_, itemIndex) => (
                      <ButtonSkeleton key={itemIndex} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Generic page skeleton for simple pages
 */
export const GenericPageSkeleton = ({ showBackButton = false }) => {
  return (
    <div className="min-h-screen bg-vibrant-overlay dark:bg-dark-overlay">
      <PageHeaderSkeleton showBackButton={showBackButton} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="text-center space-y-6 mb-12">
          <AvatarSkeleton size="3xl" className="mx-auto" />
          <div className="space-y-4">
            <TextSkeleton size="3xl" width="w-48" className="mx-auto" />
            <div className="space-y-2">
              <TextSkeleton size="base" width="w-72" className="mx-auto" />
              <TextSkeleton size="base" width="w-80" className="mx-auto" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} showHeader={false} contentLines={2} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="card p-4 text-center">
              <div className="text-3xl mb-2">
                <Skeleton className="w-8 h-8 mx-auto" />
              </div>
              <TextSkeleton size="sm" width="w-20" className="mx-auto mb-1" />
              <TextSkeleton size="xs" width="w-16" className="mx-auto" />
            </div>
          ))}
        </div>

        <div className="card p-6">
          <TextSkeleton size="sm" width="w-64" className="mx-auto" />
        </div>
      </main>
    </div>
  );
};

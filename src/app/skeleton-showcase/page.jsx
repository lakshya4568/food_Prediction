"use client";

import React from "react";
import {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  CardSkeleton,
  ListItemSkeleton,
  NavItemSkeleton,
  TableSkeleton,
  ImageSkeleton,
  StatCardSkeleton,
  ProgressSkeleton,
  ChartSkeleton,
  DashboardSkeleton,
} from "../../components/ui/Skeleton";

import {
  PageHeaderSkeleton,
  DashboardPageSkeleton,
  SettingsPageSkeleton,
  GenericPageSkeleton,
} from "../../components/ui/SkeletonLayouts";

export default function SkeletonShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loading Skeleton Components Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive collection of reusable skeleton components with
            animate-pulse
          </p>
        </div>

        {/* Basic Skeleton Components */}
        <div className="card mb-8 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Basic Skeleton Components
          </h2>

          <div className="space-y-8">
            {/* Text Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Text Skeletons</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                    Single line (different sizes):
                  </label>
                  <div className="space-y-2">
                    <TextSkeleton size="xs" width="w-32" />
                    <TextSkeleton size="sm" width="w-40" />
                    <TextSkeleton size="base" width="w-48" />
                    <TextSkeleton size="lg" width="w-56" />
                    <TextSkeleton size="xl" width="w-64" />
                    <TextSkeleton size="2xl" width="w-72" />
                    <TextSkeleton size="3xl" width="w-80" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                    Multiple lines:
                  </label>
                  <TextSkeleton lines={3} />
                </div>
              </div>
            </div>

            {/* Avatar Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Avatar Skeletons</h3>
              <div className="flex items-center space-x-4">
                <AvatarSkeleton size="xs" />
                <AvatarSkeleton size="sm" />
                <AvatarSkeleton size="md" />
                <AvatarSkeleton size="lg" />
                <AvatarSkeleton size="xl" />
                <AvatarSkeleton size="2xl" />
                <AvatarSkeleton size="3xl" />
              </div>
            </div>

            {/* Button Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Button Skeletons</h3>
              <div className="flex items-center space-x-4">
                <ButtonSkeleton size="sm" />
                <ButtonSkeleton size="md" />
                <ButtonSkeleton size="lg" />
                <ButtonSkeleton size="xl" />
              </div>
            </div>

            {/* Image Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Image Skeletons</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ImageSkeleton size="sm" />
                <ImageSkeleton size="md" />
                <ImageSkeleton size="lg" />
                <ImageSkeleton aspectRatio="16/9" size="full" />
              </div>
            </div>
          </div>
        </div>

        {/* Complex Skeleton Components */}
        <div className="card mb-8 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Complex Skeleton Components
          </h2>

          <div className="space-y-8">
            {/* Card Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Card Skeletons</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardSkeleton
                  showHeader={true}
                  showFooter={false}
                  contentLines={3}
                />
                <CardSkeleton
                  showHeader={true}
                  showFooter={true}
                  contentLines={2}
                />
                <CardSkeleton
                  showHeader={false}
                  showFooter={false}
                  contentLines={4}
                />
              </div>
            </div>

            {/* List Item Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                List Item Skeletons
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <ListItemSkeleton showAvatar={true} showAction={true} />
                <ListItemSkeleton showAvatar={true} showAction={false} />
                <ListItemSkeleton showAvatar={false} showAction={true} />
              </div>
            </div>

            {/* Stat Card Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Stat Card Skeletons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
            </div>

            {/* Progress Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Progress Skeletons</h3>
              <div className="space-y-4 max-w-md">
                <ProgressSkeleton />
                <ProgressSkeleton />
                <ProgressSkeleton />
              </div>
            </div>

            {/* Navigation Skeletons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Navigation Skeletons
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-xs">
                <NavItemSkeleton count={6} />
              </div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="card mb-8 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Table Skeleton
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg">
            <TableSkeleton rows={5} columns={4} showHeader={true} />
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="card mb-8 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Chart Skeleton
          </h2>
          <ChartSkeleton height="h-64" />
        </div>

        {/* Page Layout Skeletons */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Page Layout Skeletons
          </h2>

          {/* Page Header Skeleton */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <PageHeaderSkeleton showBackButton={true} />
          </div>

          {/* Combined Dashboard Skeleton */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
              Dashboard Layout Skeleton
            </h3>
            <DashboardSkeleton />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 dark:text-gray-400">
            All skeleton components use Tailwind's animate-pulse and support
            dark mode
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              className="btn-outline"
              onClick={() => {
                document.documentElement.classList.toggle("dark");
              }}
            >
              Toggle Dark Mode
            </button>
            <button
              className="btn-secondary"
              onClick={() => window.location.reload()}
            >
              Reload Animations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { cn } from "../../lib/utils";

/**
 * Base skeleton component for creating animated placeholders
 */
export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  );
};

/**
 * Skeleton for text content with different sizes
 */
export const TextSkeleton = ({
  lines = 1,
  className = "",
  width = "full",
  size = "base",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "h-3";
      case "sm":
        return "h-3.5";
      case "base":
        return "h-4";
      case "lg":
        return "h-5";
      case "xl":
        return "h-6";
      case "2xl":
        return "h-7";
      case "3xl":
        return "h-8";
      default:
        return "h-4";
    }
  };

  const getWidthClass = () => {
    if (typeof width === "string" && width !== "full") {
      return width;
    }
    return "w-full";
  };

  if (lines === 1) {
    return (
      <Skeleton className={cn(getSizeClasses(), getWidthClass(), className)} />
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            getSizeClasses(),
            index === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
};

/**
 * Skeleton for circular avatars or icons
 */
export const AvatarSkeleton = ({ size = "md", className = "" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "w-6 h-6";
      case "sm":
        return "w-8 h-8";
      case "md":
        return "w-10 h-10";
      case "lg":
        return "w-12 h-12";
      case "xl":
        return "w-16 h-16";
      case "2xl":
        return "w-20 h-20";
      case "3xl":
        return "w-24 h-24";
      default:
        return "w-10 h-10";
    }
  };

  return (
    <Skeleton className={cn("rounded-full", getSizeClasses(), className)} />
  );
};

/**
 * Skeleton for buttons
 */
export const ButtonSkeleton = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 w-20";
      case "md":
        return "h-10 w-24";
      case "lg":
        return "h-12 w-32";
      case "xl":
        return "h-14 w-40";
      default:
        return "h-10 w-24";
    }
  };

  return <Skeleton className={cn("rounded-lg", getSizeClasses(), className)} />;
};

/**
 * Skeleton for cards
 */
export const CardSkeleton = ({
  showHeader = true,
  showFooter = false,
  contentLines = 3,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6",
        className
      )}
    >
      {showHeader && (
        <div className="mb-4">
          <TextSkeleton size="lg" width="w-48" />
        </div>
      )}

      <div className="space-y-3">
        <TextSkeleton lines={contentLines} />
      </div>

      {showFooter && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <ButtonSkeleton size="sm" />
            <TextSkeleton size="sm" width="w-20" />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Skeleton for list items
 */
export const ListItemSkeleton = ({
  showAvatar = true,
  showAction = true,
  avatarSize = "md",
  className = "",
}) => {
  return (
    <div className={cn("flex items-center justify-between p-4", className)}>
      <div className="flex items-center space-x-4">
        {showAvatar && <AvatarSkeleton size={avatarSize} />}
        <div>
          <TextSkeleton size="base" width="w-32" />
          <TextSkeleton size="sm" width="w-24" className="mt-1" />
        </div>
      </div>
      {showAction && (
        <div className="text-right">
          <TextSkeleton size="base" width="w-16" />
          <TextSkeleton size="sm" width="w-12" className="mt-1" />
        </div>
      )}
    </div>
  );
};

/**
 * Skeleton for navigation items
 */
export const NavItemSkeleton = ({ count = 4, className = "" }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-2">
          <Skeleton className="w-5 h-5 rounded" />
          <TextSkeleton width="w-20" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for tables
 */
export const TableSkeleton = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = "",
}) => {
  return (
    <div className={cn("w-full", className)}>
      {showHeader && (
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: columns }).map((_, index) => (
            <TextSkeleton key={index} size="sm" width="w-20" />
          ))}
        </div>
      )}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TextSkeleton key={colIndex} size="sm" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Skeleton for images
 */
export const ImageSkeleton = ({
  aspectRatio = "16/9",
  size = "md",
  className = "",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-16 h-16";
      case "md":
        return "w-32 h-32";
      case "lg":
        return "w-48 h-48";
      case "xl":
        return "w-64 h-64";
      case "full":
        return "w-full h-64";
      default:
        return "w-32 h-32";
    }
  };

  const aspectClass =
    aspectRatio === "16/9"
      ? "aspect-video"
      : aspectRatio === "4/3"
      ? "aspect-4/3"
      : aspectRatio === "1/1"
      ? "aspect-square"
      : "";

  return (
    <Skeleton
      className={cn("rounded-lg", aspectClass || getSizeClasses(), className)}
    />
  );
};

/**
 * Skeleton for stats/metrics cards
 */
export const StatCardSkeleton = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <TextSkeleton size="sm" width="w-24" />
          <TextSkeleton size="2xl" width="w-20" className="mt-2" />
          <TextSkeleton size="xs" width="w-16" className="mt-1" />
        </div>
        <AvatarSkeleton size="lg" className="rounded-lg" />
      </div>
      <div className="mt-4">
        <Skeleton className="w-full h-2 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Skeleton for progress bars
 */
export const ProgressSkeleton = ({ className = "" }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <TextSkeleton size="sm" width="w-20" />
        <TextSkeleton size="sm" width="w-12" />
      </div>
      <Skeleton className="w-full h-2 rounded-full" />
    </div>
  );
};

/**
 * Skeleton for charts or complex visualizations
 */
export const ChartSkeleton = ({ height = "h-64", className = "" }) => {
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg p-6", className)}>
      <div className="mb-4">
        <TextSkeleton size="lg" width="w-48" />
      </div>
      <Skeleton className={cn("w-full rounded", height)} />
    </div>
  );
};

/**
 * Combined skeleton for complex layouts
 */
export const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <TextSkeleton size="3xl" width="w-96" />
        <TextSkeleton size="base" width="w-80" />
      </div>

      {/* Quick Action */}
      <ButtonSkeleton size="lg" />

      {/* Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} showHeader={false} contentLines={1} />
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Recent Activity */}
      <CardSkeleton showHeader={true} showFooter={false} contentLines={0}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <ListItemSkeleton key={index} />
          ))}
        </div>
      </CardSkeleton>
    </div>
  );
};

export default Skeleton;

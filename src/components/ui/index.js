// UI Components Export Index
// This file provides a centralized export for all UI components

// Button Component
export { default as Button } from "./Button";

// Card Components
export {
  default as Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./Card";

// File Upload Components
export { default as FileUploadZone } from "./FileUploadZone";

// Progress Components
export { default as ProgressBar, FileUploadProgress } from "./ProgressBar";

// Toast Components
export {
  Toast,
  ToastContainer,
  ToastAction,
  toastVariantNames,
  toastPositionNames,
} from "./Toast";

export {
  ToastProvider,
  useToast,
  withToast,
  standaloneToast,
  setToastInstance,
} from "./ToastProvider";

// Skeleton Components
export {
  default as Skeleton,
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
} from "./Skeleton";

// Skeleton Layout Components
export {
  PageHeaderSkeleton,
  DashboardPageSkeleton,
  SettingsPageSkeleton,
  PlannerPageSkeleton,
  GroceryPageSkeleton,
  HealthDocsPageSkeleton,
  ComponentsShowcaseSkeleton,
  GenericPageSkeleton,
} from "./SkeletonLayouts";

// Re-export all components as a single object for convenience
import Button from "./Button";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "./Card";
import FileUploadZone from "./FileUploadZone";
import ProgressBar, { FileUploadProgress } from "./ProgressBar";
import Skeleton, {
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
} from "./Skeleton";
import {
  PageHeaderSkeleton,
  DashboardPageSkeleton,
  SettingsPageSkeleton,
  PlannerPageSkeleton,
  GroceryPageSkeleton,
  HealthDocsPageSkeleton,
  ComponentsShowcaseSkeleton,
  GenericPageSkeleton,
} from "./SkeletonLayouts";

export const UIComponents = {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  FileUploadZone,
  ProgressBar,
  FileUploadProgress,
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
  PageHeaderSkeleton,
  DashboardPageSkeleton,
  SettingsPageSkeleton,
  PlannerPageSkeleton,
  GroceryPageSkeleton,
  HealthDocsPageSkeleton,
  ComponentsShowcaseSkeleton,
  GenericPageSkeleton,
};

export default UIComponents;

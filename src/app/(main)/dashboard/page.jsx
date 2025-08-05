"use client";

import dynamic from "next/dynamic";

// Dynamically import the dashboard content with loading skeleton
const DashboardContent = dynamic(
  () => import("../../../components/DashboardContent"),
  {
    ssr: false,
    loading: () => import("./loading").then((mod) => mod.default()),
  }
);

export default function DashboardPage() {
  return <DashboardContent />;
}

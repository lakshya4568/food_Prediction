"use client";

import dynamic from "next/dynamic";

// Dynamically import the planner content with loading skeleton
const PlannerContent = dynamic(
  () => import("../../../components/PlannerContent"),
  {
    ssr: false,
    loading: () => import("./loading").then((mod) => mod.default()),
  }
);

export default function PlannerPage() {
  return <PlannerContent />;
}

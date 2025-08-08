"use client";

import dynamic from "next/dynamic";
import RequireAuth from "../../../components/RequireAuth";

const PlannerContent = dynamic(
  () => import("../../../components/PlannerContent"),
  {
    ssr: false,
    loading: () => import("./loading").then((mod) => mod.default()),
  }
);

export default function PlannerPage() {
  return (
    <RequireAuth>
      <PlannerContent />
    </RequireAuth>
  );
}

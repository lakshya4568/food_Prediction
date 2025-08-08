"use client";

import dynamic from "next/dynamic";
import RequireAuth from "../../../components/RequireAuth";

// Dynamically import the health docs content with loading skeleton
const HealthDocsContent = dynamic(
  () => import("../../../components/HealthDocsContent"),
  {
    ssr: false,
    loading: () => import("./loading").then((mod) => mod.default()),
  }
);

export default function HealthDocsPage() {
  return (
    <RequireAuth>
      <HealthDocsContent />
    </RequireAuth>
  );
}

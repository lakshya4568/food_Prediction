"use client";

import dynamic from "next/dynamic";
import RequireAuth from "../../../components/RequireAuth";
import HealthDocsLoading from "./loading";

// Dynamically import the health docs content with loading skeleton
const HealthDocsContent = dynamic(
  () => import("../../../components/HealthDocsContent"),
  {
    ssr: false,
    loading: () => <HealthDocsLoading />,
  }
);

export default function HealthDocsPage() {
  return (
    <RequireAuth>
      <HealthDocsContent />
    </RequireAuth>
  );
}

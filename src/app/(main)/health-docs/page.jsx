"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import RequireAuth from "../../../components/RequireAuth";
import HealthDocsLoading from "./loading";

// Dynamically import the health docs content with loading skeleton
const HealthDocsContent = dynamic(
  () => import("../../../components/HealthDocsContent"),
  {
    // Use Suspense-compatible dynamic import to prevent uncached promise errors
    ssr: false,
    suspense: true,
  }
);

export default function HealthDocsPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<HealthDocsLoading />}>
        <HealthDocsContent />
      </Suspense>
    </RequireAuth>
  );
}

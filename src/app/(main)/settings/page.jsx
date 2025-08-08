"use client";

import dynamic from "next/dynamic";
import RequireAuth from "../../../components/RequireAuth";

// Dynamically import the settings content with loading skeleton
const SettingsContent = dynamic(
  () => import("../../../components/SettingsContent"),
  {
    ssr: false,
    loading: () => import("./loading").then((mod) => mod.default()),
  }
);

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsContent />
    </RequireAuth>
  );
}

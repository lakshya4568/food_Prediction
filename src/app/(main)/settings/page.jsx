"use client";

import dynamic from "next/dynamic";

// Dynamically import the settings content with loading skeleton
const SettingsContent = dynamic(
  () => import("../../../components/SettingsContent"),
  {
    ssr: false,
    loading: () => import("./loading").then((mod) => mod.default()),
  }
);

export default function SettingsPage() {
  return <SettingsContent />;
}

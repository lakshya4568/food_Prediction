"use client";
import dynamic from "next/dynamic";
import RequireAuth from "../../../components/RequireAuth";

const DashboardContent = dynamic(
  () => import("../../../components/DashboardContent"),
  {
    loading: () => null,
  }
);

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}

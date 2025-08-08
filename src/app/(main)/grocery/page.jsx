"use client";

import dynamic from "next/dynamic";
import RequireAuth from "../../../components/RequireAuth";

// Dynamically import the grocery content with loading skeleton
const GroceryContent = dynamic(
  () => import("../../../components/GroceryContent"),
  {
    ssr: false,
    loading: () => import("./loading").then((mod) => mod.default()),
  }
);

export default function GroceryPage() {
  return (
    <RequireAuth>
      <GroceryContent />
    </RequireAuth>
  );
}

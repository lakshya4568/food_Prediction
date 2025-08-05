"use client";

import dynamic from "next/dynamic";

// Dynamically import the grocery content with loading skeleton
const GroceryContent = dynamic(
  () => import("../../../components/GroceryContent"),
  {
    ssr: false,
    loading: () => import("./loading").then((mod) => mod.default()),
  }
);

export default function GroceryPage() {
  return <GroceryContent />;
}

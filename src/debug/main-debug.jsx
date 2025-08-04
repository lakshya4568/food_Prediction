import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MinimalTest from "../debug/MinimalTest";

console.log("=== DEBUG MAIN.JSX LOADING ===");
console.log("Starting minimal test mode...");

const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

if (rootElement) {
  console.log("Creating React root...");
  const root = createRoot(rootElement);
  console.log("React root created:", root);
  
  console.log("Rendering minimal test app...");
  root.render(
    <StrictMode>
      <MinimalTest />
    </StrictMode>
  );
  console.log("Minimal test app rendered successfully!");
} else {
  console.error("ERROR: Root element not found!");
  // Fallback: try to create content directly
  document.body.innerHTML = `
    <div style="background: blue; color: white; padding: 20px; text-align: center;">
      <h1>FALLBACK MODE: Root element not found!</h1>
      <p>This means there's an issue with the HTML structure.</p>
    </div>
  `;
}

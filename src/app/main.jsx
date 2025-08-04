import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.css";
import Routes from "../pages/routes";

console.log("=== MAIN.JSX LOADING ===");

const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

if (rootElement) {
  console.log("Creating React root...");
  const root = createRoot(rootElement);
  console.log("React root created:", root);

  console.log("Rendering app...");
  root.render(
    <StrictMode>
      <Routes />
    </StrictMode>
  );
  console.log("App rendered successfully!");
} else {
  console.error("ERROR: Root element not found!");
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial;">
      <h1>Error: Root element not found</h1>
      <p>Please check that the HTML file contains an element with id="root"</p>
    </div>
  `;
}

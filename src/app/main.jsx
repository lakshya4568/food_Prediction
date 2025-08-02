import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/index.css";
import Routes from "../pages/routes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);

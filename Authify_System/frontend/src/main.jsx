import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "bootstrap/dist/js/bootstrap.bundle.js";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

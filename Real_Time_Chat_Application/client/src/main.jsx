import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "../context/AuthContext.jsx";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { SongProvider } from "./context/SongContext.tsx";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SongProvider>
      <App />
    </SongProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { SongProvider } from "./context/SongContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <SongProvider>
        <App />
      </SongProvider>
    </UserProvider>
  </StrictMode>
);

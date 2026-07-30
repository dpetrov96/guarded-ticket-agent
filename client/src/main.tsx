import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { TicketRefreshProvider } from "@/context/TicketRefreshContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TicketRefreshProvider>
      <App />
    </TicketRefreshProvider>
  </StrictMode>,
);

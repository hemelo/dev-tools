import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Analytics />
        <App />
    </React.StrictMode>
);
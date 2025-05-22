import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-left"
      toastOptions={{
        className:
          "bg-white text-gray-900 border border-gray-200 shadow-md px-4 py-3 text-sm",
        duration: 3000,
        success: {
          iconTheme: {
            primary: "#22c55e", // green-500
            secondary: "#f0fdf4", // green-50
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", // red-500
            secondary: "#fef2f2", // red-50
          },
        },
      }}
    />
  </StrictMode>
);

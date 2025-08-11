import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AllEnterpriseModule, ModuleRegistry } from "ag-grid-enterprise";
import { Toaster } from "react-hot-toast";
// import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllEnterpriseModule]);
// ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      toastOptions={{
        style: {
          background: "black",
          color: "white",
        },
      }}
    />
  </StrictMode>
);

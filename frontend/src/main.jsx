import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { StoreProvider } from "./Store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);

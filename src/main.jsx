import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ Corrected path
import "./assets/styles/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

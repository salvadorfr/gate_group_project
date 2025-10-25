import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";  // 👈 importa tu estilo global
import "./index.css";          // (puedes mantenerlo si Tailwind o reset adicional)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

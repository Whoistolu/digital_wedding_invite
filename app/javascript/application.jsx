import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import AdminDashboard from "./components/AdminDashboard";

const container = document.getElementById("root");
if (container) {
  const isAdmin = window.location.pathname === "/admin";
  createRoot(container).render(isAdmin ? <AdminDashboard /> : <App />);
}

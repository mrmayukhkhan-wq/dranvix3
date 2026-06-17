// src/App.jsx
import React from "react";
import { useApp } from "./context/AppContext";
import AuthView from "./views/AuthView";
import DashboardView from "./views/DashboardView";

export default function App() {
  const { isAuthenticated, loading } = useApp();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div className="brand-mark" style={{ justifyContent: "center", marginBottom: "16px" }}>
            <div className="brand-icon">M+</div>
            <span>Med<span>Control</span></span>
          </div>
          <div className="sync-chip" style={{ display: "inline-flex" }}>
            <span className="pulse" />
            Connecting…
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <DashboardView /> : <AuthView />;
}

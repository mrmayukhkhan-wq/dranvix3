import React from "react";
import { useApp } from "../context/AppContext";

const NAV = [
  { view: "overview", symbol: "+", label: "Overview",  kbd: "01" },
  { view: "expiry",   symbol: "!", label: "Expiry",    kbd: "02" },
  { view: "invoice",  symbol: "#", label: "Invoices",  kbd: "03" },
  { view: "settings", symbol: "*", label: "Customize", kbd: "04" },
];

export default function Rail({ activeView, setView }) {
  const { user } = useApp();

  return (
    <aside className="rail">
      <div className="brand-mark">
        <div className="brand-icon">M+</div>
        <span>Med<span>Control</span></span>
      </div>

      <nav className="nav" aria-label="Dashboard navigation">
        {NAV.map(({ view, symbol, label, kbd }) => (
          <button
            key={view}
            className={activeView === view ? "active" : ""}
            onClick={() => setView(view)}
            aria-current={activeView === view ? "page" : undefined}
          >
            <span aria-hidden="true">{symbol}</span>
            <span>{label}</span>
            <span className="nav-kbd">{kbd}</span>
          </button>
        ))}
      </nav>

      <div className="rail-bottom">
        <strong>{user?.pharmacyName ?? "Greenline Medicals"}</strong>
        <span>Last sync 02 min ago. Return alerts are pinned to expiry colour rules.</span>
      </div>
    </aside>
  );
}

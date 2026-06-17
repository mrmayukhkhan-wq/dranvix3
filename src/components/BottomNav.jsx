import React from "react";

const NAV_ITEMS = [
  { view: "overview", label: "Overview" },
  { view: "expiry",   label: "Expiry" },
  { view: "invoice",  label: "Invoices" },
  { view: "settings", label: "Theme" },
];

export default function BottomNav({ activeView, setView }) {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ view, label }) => (
        <button
          key={view}
          className={activeView === view ? "active" : ""}
          onClick={() => setView(view)}
          aria-current={activeView === view ? "page" : undefined}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

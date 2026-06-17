import React from "react";
import { useApp } from "../../context/AppContext";
import { useMedicineSearch } from "../../hooks/useMedicineSearch";
import MedicineList from "../MedicineList";

export default function ExpiryPanel() {
  const { medicines } = useApp();
  const { query, setQuery, filtered } = useMedicineSearch(medicines);

  // Sort by urgency: red → amber → green, then days ascending
  const zoneOrder = { red: 0, amber: 1, green: 2 };
  const sorted = [...filtered].sort((a, b) =>
    zoneOrder[a.zone] - zoneOrder[b.zone] || a.days - b.days
  );

  return (
    <>
      <div className="hero-strip">
        <div>
          <h2>Return-window queue</h2>
          <p>Red for immediate action, amber for watchlist, green for safe stock.</p>
        </div>
        <div className="hero-actions">
          <button className="primary-btn" type="button">Export return list</button>
        </div>
      </div>

      <div className="topbar" style={{ marginBottom: 0 }}>
        <label className="search" style={{ maxWidth: 360 }}>
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter batches…"
            autoComplete="off"
          />
        </label>
      </div>

      <section className="surface">
        <div className="surface-head">
          <h3>All expiry batches</h3>
          <span>{sorted.length} batches</span>
        </div>
        <MedicineList medicines={sorted} />
      </section>
    </>
  );
}

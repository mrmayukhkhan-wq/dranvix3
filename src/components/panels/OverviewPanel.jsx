import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useMedicineSearch } from "../../hooks/useMedicineSearch";
import MetricCards from "../MetricCards";
import MedicineList from "../MedicineList";
import Predictions from "../Predictions";
import ActivityFeed from "../ActivityFeed";
import Topbar from "../Topbar";

export default function OverviewPanel({ setView }) {
  const { medicines, user, dispatch } = useApp();
  const { query, setQuery, filtered } = useMedicineSearch(medicines);

  const redCount   = medicines.filter(m => m.zone === "red").length;
  const amberCount = medicines.filter(m => m.zone === "amber").length;

  return (
    <>
      {/* Hero strip — matches video exactly */}
      <div className="hero-strip">
        <div className="hero-text">
          <h2>Expiry-first control room</h2>
          <p>
            Today you have <strong style={{ color: "var(--danger)" }}>{redCount} urgent strips</strong>,{" "}
            <strong style={{ color: "var(--warn)" }}>{amberCount} amber-window medicines</strong>, and enough green stock to keep reordering disciplined.
          </p>
        </div>
        <div className="hero-actions">
          <button className="primary-btn" type="button" onClick={() => setView("invoice")}>Parse invoice</button>
          <button className="ghost-btn"   type="button" onClick={() => setView("expiry")}>Review expiry</button>
        </div>
      </div>

      <MetricCards medicines={medicines} />

      <div className="grid-2">
        <section className="surface">
          <div className="surface-head">
            <h3>Expiry Radar</h3>
            <span>red / amber / green</span>
          </div>
          <div className="surface-search">
            <label className="search search-sm">
              <span aria-hidden="true">⌕</span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Filter medicines…"
                autoComplete="off"
              />
            </label>
          </div>
          <MedicineList medicines={filtered} />
        </section>

        <aside className="right-stack">
          <Predictions />
          <ActivityFeed />
        </aside>
      </div>
    </>
  );
}

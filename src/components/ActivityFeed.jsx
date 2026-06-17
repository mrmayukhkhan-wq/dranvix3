import React from "react";
import { useApp } from "../context/AppContext";

export default function ActivityFeed() {
  const { activity } = useApp();

  return (
    <section className="surface">
      <div className="surface-head">
        <h3>Activity</h3>
        <span>live ledger</span>
      </div>
      <div className="activity-list">
        {activity.map((item) => (
          <div key={item.id} className="activity">
            <div className="mini-symbol">{item.mark}</div>
            <div>
              <strong>{item.title}</strong>
              <span>{item.note}</span>
            </div>
            <div className="nav-kbd">{item.time}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

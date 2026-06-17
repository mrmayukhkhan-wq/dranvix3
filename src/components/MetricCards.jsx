import React from "react";

export default function MetricCards({ medicines }) {
  const red   = medicines.filter(m => m.zone === "red").length;
  const amber = medicines.filter(m => m.zone === "amber").length;
  const green = medicines.filter(m => m.zone === "green").length;
  const totalStock = medicines.reduce((sum, m) => sum + (m.stock ?? m.quantity ?? 0), 0);

  return (
    <div className="metrics">
      <div className="metric danger">
        <span>Red expiry</span>
        <strong>{red}</strong>
        <small>needs return action</small>
      </div>
      <div className="metric warn">
        <span>Amber expiry</span>
        <strong>{amber}</strong>
        <small>watchlist batches</small>
      </div>
      <div className="metric safe">
        <span>Green stock</span>
        <strong>{green}</strong>
        <small>healthy batches</small>
      </div>
      <div className="metric">
        <span>Total units</span>
        <strong>{totalStock}</strong>
        <small>demo inventory</small>
      </div>
    </div>
  );
}

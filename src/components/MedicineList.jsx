import React from "react";
import { getDaysRemaining } from "../utils/expiryCheck";

const ZONE_LABELS = { red: "Return now", amber: "Watch", green: "Safe" };

export default function MedicineList({ medicines }) {
  if (!medicines.length) {
    return <p style={{ padding: "16px", color: "var(--muted)", fontSize: "13px" }}>No medicines match your search.</p>;
  }

  return (
    <div className="medicine-list">
      {medicines.map(item => {
        // Support both old zone-based and new expiryDate-based data
        const zone = item.zone ?? deriveZone(item.expiryDate);
        const days = item.days ?? (item.expiryDate ? getDaysRemaining(item.expiryDate) : "—");
        const stock = item.stock ?? item.quantity ?? "—";
        const batch = item.batchNo ?? item.batch ?? "";
        const supplier = item.supplier ?? "";

        return (
          <div key={item.id ?? batch} className={`medicine-row ${zone}`}>
            <div className="status-bar" aria-hidden="true" />
            <div className="med-name">
              <strong>{item.name}</strong>
              <span>{supplier}{supplier && batch ? " · " : ""}<span className="batch">{batch}</span></span>
            </div>
            <div className="cell">
              <div className="cell-label">Expires in</div>
              <div className="mono">{days}d</div>
            </div>
            <div className="cell">
              <div className="cell-label">Stock</div>
              <div className="mono">{stock}</div>
            </div>
            <span className={`tag ${zone}`}>{ZONE_LABELS[zone] ?? zone}</span>
          </div>
        );
      })}
    </div>
  );
}

function deriveZone(expiryDate) {
  if (!expiryDate) return "green";
  const days = getDaysRemaining(expiryDate);
  if (days < 0)   return "red";
  if (days <= 90) return "red";
  if (days <= 180) return "amber";
  return "green";
}

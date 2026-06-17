// src/components/panels/InvoicePanel.jsx
import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { getInvoices, createInvoice, updateInvoiceParsed } from "../../services/invoice";
import { getMedicines } from "../../services/medicine";
import { getActivity } from "../../services/activity";

export default function InvoicePanel({ setView }) {
  const { dispatch } = useApp();
  const [uploading, setUploading]   = useState(false);
  const [invoices,  setInvoices]    = useState([]);
  const [loaded,    setLoaded]      = useState(false);
  const [dragOver,  setDragOver]    = useState(false);
  const fileRef = useRef(null);

  // Load invoice history on first render
  React.useEffect(() => {
    getInvoices().then(list => { setInvoices(list); setLoaded(true); });
  }, []);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    try {
      const record = await createInvoice({ distributor: "Unknown", raw_text: file.name });
      // Simulate parse (replace with real Claude Vision endpoint later)
      await new Promise(r => setTimeout(r, 1400));
      await updateInvoiceParsed(record.id, []);
      // Refresh medicines + activity in context
      const [medicines, activity] = await Promise.all([getMedicines(), getActivity()]);
      dispatch({ type: "DATA_LOADED", payload: { medicines, activity } });
      setInvoices(await getInvoices());
      setTimeout(() => setView("overview"), 800);
    } catch (err) {
      console.error("Invoice upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <>
      <div className="hero-strip">
        <div className="hero-text">
          <h2>Invoice intake</h2>
          <p>Upload supplier PDFs, bill photos, or WhatsApp screenshots. Files are parsed row-by-row into your stock.</p>
        </div>
        <div className="hero-actions">
          <button className="primary-btn" type="button" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload invoice"}
          </button>
        </div>
      </div>

      <section className="surface">
        <div className="surface-head">
          <h3>Parser staging</h3>
          <span>Supabase · invoices table</span>
        </div>

        {/* Drop zone */}
        <div
          className={`drop-zone${dragOver ? " drag-active" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div>
            <strong>{uploading ? "Parsing invoice…" : "Drop invoice here or click to browse"}</strong>
            <span>PDF · JPG · PNG · WebP · max 10 MB</span>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,image/*"
          style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])}
        />

        {/* Invoice history */}
        {loaded && invoices.length > 0 && (
          <div className="invoice-list">
            {invoices.map(inv => (
              <div key={inv.id} className="invoice-row">
                <div className="mini-symbol">P</div>
                <div>
                  <strong>{inv.filename}</strong>
                  <span>{inv.rowsMatched} rows · {inv.status}</span>
                </div>
                <span className={`tag ${inv.status === "parsed" ? "green" : "amber"}`}>{inv.status}</span>
              </div>
            ))}
          </div>
        )}

        {loaded && invoices.length === 0 && (
          <p style={{ padding: "16px", color: "var(--muted)", fontSize: "13px" }}>No invoices uploaded yet.</p>
        )}
      </section>
    </>
  );
}

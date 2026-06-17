// src/views/AuthView.jsx
import React, { useState } from "react";
import { useApp } from "../context/AppContext";

import { login, register } from "../services/auth";

export default function AuthView() {
  useApp();
  const [mode, setMode]     = useState("login");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [name,         setName]         = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [city,         setCity]         = useState("");
  const [phone,        setPhone]        = useState("");
  const [profile,      setProfile]      = useState("Retail pharmacy");
  const [regEmail,     setRegEmail]     = useState("");
  const [regPassword,  setRegPassword]  = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await login({ email: loginEmail.trim(), password: loginPassword });
    } catch (err) {
      setError(err?.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await register({
        email:        regEmail.trim(),
        password:     regPassword,
        pharmacyName: pharmacyName.trim(),
      });
    } catch (err) {
      setError(err?.message ?? "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="auth-frame" aria-label="MedControl authentication">

        {/* ── Brand side ──────────────────────────────────────────────── */}
        <aside className="brand-side">
          <div>
            <div className="brand-mark">
              <div className="brand-icon">M+</div>
              <span>Med<span>Control</span></span>
            </div>
            <div className="auth-copy">
              <h1>Stock that stays under control.</h1>
              <p>Expiry radar, invoice parsing, and demand planning for small pharmacies that need fast decisions without spreadsheet drift.</p>
            </div>
            <div className="feature-stack">
              <div className="feature-line">
                <div className="feature-symbol">R</div>
                <div><strong>Expiry radar</strong><span>Red, amber, and green zones stay unchanged for return-window decisions.</span></div>
              </div>
              <div className="feature-line">
                <div className="feature-symbol">P</div>
                <div><strong>Invoice parser</strong><span>Drop invoices or WhatsApp screenshots and let stock rows pre-fill.</span></div>
              </div>
              <div className="feature-line">
                <div className="feature-symbol">A</div>
                <div><strong>Demand AI</strong><span>Seasonal and local patterns add reorder buffers before stockouts happen.</span></div>
              </div>
            </div>
          </div>
          <p className="compliance">DPDP-ready · encrypted · backed up every minute</p>
        </aside>

        {/* ── Auth panel ──────────────────────────────────────────────── */}
        <section className="auth-panel">
          <div className="auth-top">
            <div className="sync-chip"><span className="pulse" />live data</div>
            <div className="segmented">
              <button className={mode === "login"    ? "active" : ""} onClick={() => { setMode("login");    setError(""); }}>Sign in</button>
              <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }}>Register</button>
            </div>
          </div>

          {mode === "login" ? (
            <form className="form-grid" onSubmit={handleLogin}>
              <div className="form-title">
                <h2>Welcome back</h2>
                <p>Open your pharmacy dashboard and continue from the latest synced inventory state.</p>
              </div>
              <div className="field">
                <label htmlFor="loginEmail">Email</label>
                <input id="loginEmail" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="loginPassword">Password</label>
                <input id="loginPassword" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required autoComplete="current-password" />
              </div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="auth-actions">
                <button className="primary-btn" type="submit" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </button>
                <div className="divider">or</div>
                <button className="ghost-btn" type="button" onClick={() => setMode("register")}>Register your pharmacy</button>
              </div>
            </form>
          ) : (
            <form className="form-grid" onSubmit={handleRegister}>
              <div className="form-title">
                <h2>Register pharmacy</h2>
                <p>Create the workspace, choose the operating profile, and land directly in the stock control cockpit.</p>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="name">Your name</label>
                  <input id="name" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="pharmacyName">Pharmacy name</label>
                  <input id="pharmacyName" value={pharmacyName} onChange={e => setPharmacyName(e.target.value)} required autoComplete="organization" />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="city">City</label>
                  <input id="city" value={city} onChange={e => setCity(e.target.value)} autoComplete="address-level2" />
                </div>
                <div className="field">
                  <label htmlFor="profile">Store profile</label>
                  <select id="profile" value={profile} onChange={e => setProfile(e.target.value)}>
                    <option>Retail pharmacy</option>
                    <option>Clinic attached</option>
                    <option>Multi-branch</option>
                    <option>Wholesale</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="regEmail">Email</label>
                <input id="regEmail" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="regPassword">Password</label>
                <input id="regPassword" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
              </div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="auth-actions">
                <button className="primary-btn" type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create workspace"}
                </button>
                <button className="ghost-btn" type="button" onClick={() => setMode("login")}>I already have an account</button>
              </div>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}

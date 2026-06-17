import React from "react";
import { useApp } from "../context/AppContext";
import Rail from "../components/Rail";
import Topbar from "../components/Topbar";
import BottomNav from "../components/BottomNav";
import OverviewPanel from "../components/panels/OverviewPanel";
import ExpiryPanel from "../components/panels/ExpiryPanel";
import InvoicePanel from "../components/panels/InvoicePanel";
import SettingsPanel from "../components/panels/SettingsPanel";

const PANELS = {
  overview: OverviewPanel,
  expiry: ExpiryPanel,
  invoice: InvoicePanel,
  settings: SettingsPanel,
};

export default function DashboardView() {
  const { activeView, dispatch } = useApp();
  const setView = (name) => dispatch({ type: "SET_VIEW", payload: name });
  const ActivePanel = PANELS[activeView] ?? OverviewPanel;

  return (
    <section className="dashboard" aria-label="MedControl dashboard">
      <Rail activeView={activeView} setView={setView} />

      <div className="dashboard-body">
        {/* Mobile header */}
        <header className="mobile-top">
          <div className="brand-mark">
            <div className="brand-icon">M+</div>
            <span>Med<span>Control</span></span>
          </div>
        </header>

        <Topbar onLogout={() => dispatch({ type: "LOGOUT" })} />

        <main className="main">
          <div className="view">
            <ActivePanel setView={setView} />
          </div>
        </main>
      </div>

      <BottomNav activeView={activeView} setView={setView} />
    </section>
  );
}

import React from "react";

export default function Topbar({ onLogout, searchValue, onSearch }) {
  return (
    <div className="topbar">
      <label className="search">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          id="searchInput"
          value={searchValue || ""}
          onChange={e => onSearch?.(e.target.value)}
          placeholder="Search medicine, batch, supplier"
          autoComplete="off"
        />
      </label>
      <div className="sync-chip">
        <span className="pulse" />
        synced 02 min ago
      </div>
      <button className="icon-btn" type="button" onClick={onLogout}>Log out</button>
    </div>
  );
}

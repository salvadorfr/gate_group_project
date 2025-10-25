import { useState, useEffect } from "react";
import "./sidebar.css";

export default function Sidebar({
  items = [],
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen); // cerrado por defecto

  return (
    <>
        {open && <div className="sidebar__overlay" onClick={() => setOpen(false)} />}

      {/* Panel lateral */}
      <aside
        className={`sidebar ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="sidebar__header">
          <div style={{ fontSize: "2rem", lineHeight: 1.2 }}>
            <span style={{ fontWeight: "bold" }}>gate</span>group
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "normal",
                color: "#b7c0d1",
                padding: "0.7rem 0rem",}}
            >
              Pick and pack
            </div>
          </div>


          <button
            className="sidebar__close"
            onClick={() => setOpen(v => !v)}
            aria-label="Cerrar menú"
          >
            {open ? "☰" : "☰"}
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Navegación principal">
          {items.map((item) => (
            <a
              key={item.key ?? item.href ?? item.label}
              href={item.href ?? "#"}
              className={`sidebar__link ${item.active ? "is-active" : ""}${open ? "" : "is-open"}`}
              onClick={item.onClick}
            >
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}

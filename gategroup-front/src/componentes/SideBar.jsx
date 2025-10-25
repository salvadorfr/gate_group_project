import { useState, useEffect } from "react";
import "./sidebar.css";

export default function Sidebar({
  items = [],
  header = "Menú",
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
          <span>{header}</span>
          <button
            className="sidebar__close"
            onClick={() => setOpen(v => !v)}
            aria-label="Cerrar menú"
          >
            {open ? "x" : "☰"}
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

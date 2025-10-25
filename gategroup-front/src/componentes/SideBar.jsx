import { useState, useEffect } from "react";
import "./sidebar.css";

export default function Sidebar({
  items = [],
  header = "Menú",
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(!!defaultOpen); // cerrado por defecto

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Botón hamburguesa (siempre por encima del overlay) */}
      <button
        className={`sidebar__toggle ${open ? "is-active" : ""}`}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        ☰
      </button>

      {/* Overlay: solo cuando está abierto; clic cierra */}
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
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Navegación principal">
          {items.map((item) => (
            <a
              key={item.key ?? item.href ?? item.label}
              href={item.href ?? "#"}
              className={`sidebar__link ${item.active ? "is-active" : ""}`}
              onClick={item.onClick}
            >
              {item.icon && <span className="sidebar__icon">{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && <span className="sidebar__badge">{item.badge}</span>}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}

// src/componentes/SideBar.jsx
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar({
  items = [],          // [{ key, label, to, end }]
  defaultOpen = false, // abierto/cerrado inicial
}) {
  const [open, setOpen] = useState(defaultOpen);
  const location = useLocation();

  // Cerrar al cambiar de ruta en pantallas pequeñas
  useEffect(() => {
    if (window.innerWidth < 1024) setOpen(false);
  }, [location.pathname]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {open && <div className="sidebar__overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="sidebar__header">
          <div style={{ fontSize: "2rem", lineHeight: 1.2 }}>
            <span style={{ fontWeight: "bold" }}>gate</span>group
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "normal",
                color: "#b7c0d1",
                padding: "0.7rem 0rem",
              }}
            >
              Pick and pack
            </div>
          </div>

          <button
            className="sidebar__close"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            ☰
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Navegación principal">
          {items.map((item) => (
            <NavLink
              key={item.key ?? item.to ?? item.label}
              to={item.to ?? "#"}
              end={item.end} // p.ej. end: true para "/"
              className={({ isActive }) =>
                `sidebar__link${isActive ? " is-active" : ""}${open ? "" : " is-open"}`
              }
              // Si quieres cerrar también en tablets, quita la condición del ancho
              onClick={() => {
                if (window.innerWidth < 1024) setOpen(false);
                if (typeof item.onClick === "function") item.onClick();
              }}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

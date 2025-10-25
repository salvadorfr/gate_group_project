import { useMemo, useState } from "react";
import { MOCK_ORDERS, ORDER_STATUSES } from "../data/ordersData.js";
import "./Orders.css"; // estilos locales de Orders (similares a Login.css)

export default function Orders() {
  const [q, setQ] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return MOCK_ORDERS.filter((o) => {
      const mt =
        !t || o.id.toLowerCase().includes(t) || o.customer.toLowerCase().includes(t);
      const ms = !status || o.status === status;
      const md = !date || o.date === date;
      return mt && ms && md;
    });
  }, [q, status, date]);

  return (
    <div className="orders">
      <div className="orders__card">
        {/* Header (igual concepto que Login: título + subtítulo) */}
        <header className="orders__header">
          <div>
            <h1>Órdenes</h1>
            <p className="muted">Listado, filtros y estados</p>
          </div>
          <button className="btn btn--primary">Nueva orden</button>
        </header>

        {/* Filtros (reusan .label, .input, .btn, .muted de tu base) */}
        <section className="orders__filters">
          <div className="field">
            <label className="label">Buscar</label>
            <input
              className="input"
              placeholder="ID o cliente…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label">Fecha</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label">Estatus</label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field field--end">
            <button
              className="btn btn--ghost"
              onClick={() => {
                setQ("");
                setDate("");
                setStatus("");
              }}
            >
              Limpiar
            </button>
          </div>
        </section>

        {/* Tabs con el mismo estilo de chip “suave” */}
        <nav className="orders__tabs" aria-label="Estados">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.key || "ALL"}
              className={`chip ${status === s.key ? "chip--active" : ""}`}
              onClick={() => setStatus(s.key)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Tabla (tarjeta) */}
        <section className="orders__table card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Ítems</th>
                  <th>Total</th>
                  <th>Estatus</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="muted" style={{ textAlign: "center", padding: "1rem" }}>
                      Sin resultados
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.date}</td>
                      <td>{o.customer}</td>
                      <td>{o.items}</td>
                      <td>${o.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span className={`badge ${tone(o.status)}`}>{label(o.status)}</span>
                      </td>
                      <td className="right">
                        <button className="btn btn--ghost">Ver</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function label(s) {
  switch (s) {
    case "NEW": return "Nuevo";
    case "PICKING": return "Pick & Pack";
    case "READY": return "Listo";
    case "SHIPPED": return "Despachado";
    case "CANCELLED": return "Cancelado";
    default: return s || "Todos";
  }
}
function tone(s) {
  switch (s) {
    case "NEW": return "tone-blue";
    case "PICKING": return "tone-amber";
    case "READY": return "tone-emerald";
    case "SHIPPED": return "tone-indigo";
    case "CANCELLED": return "tone-red";
    default: return "";
  }
}

import { useEffect, useMemo, useState } from "react";

/**
 * Inventory Module (Entradas / Salidas / Reingresos / Ajustes)
 * Diseño alineado al Login & Inventory (tema global con :root vars)
 * - Paleta: usa --bg-gradient, --bg-solid, --bg-glass, --accent, --text-primary/secondary
 * - UI: glass cards, encabezado con gradient, tabs, inputs consistentes
 */

// --- Mocks de catálogos ---
const MOCK_PRODUCTS = [
  { id: "P-1001", sku: "FO-001", name: "Sándwich de Pollo 180g", unit: "pz", stdSpec: 1 },
  { id: "P-1002", sku: "BE-010", name: "Refresco 355ml", unit: "lata", stdSpec: 1 },
  { id: "P-1003", sku: "WA-500", name: "Agua 500ml", unit: "botella", stdSpec: 1 },
  { id: "P-1004", sku: "SN-040", name: "Botana 40g", unit: "pz", stdSpec: 1 },
];

const MOCK_PLANTS = [
  { id: "PL-01", name: "Planta 1" },
  { id: "PL-02", name: "Planta 2" },
];

const MOCK_DRAWERS = [
  { id: "DR-101", name: "Cajón Frío A" },
  { id: "DR-102", name: "Cajón Frío B" },
  { id: "DR-201", name: "Seco A" },
];

export default function Inventory() {
  // Tipos de movimiento del módulo
  const TABS = [
    { key: "ENTRY", label: "Entrada" },
    { key: "ISSUE", label: "Salida" },
    { key: "RETURN", label: "Reingreso" },
    { key: "ADJUST", label: "Ajuste" },
  ];

  const [activeTab, setActiveTab] = useState("ENTRY");
  const [query, setQuery] = useState("");
  const [product, setProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form unificado, con campos que se activan/ocultan por tab
  const [form, setForm] = useState({
    // comunes
    productId: "",
    sku: "",
    productName: "",
    unit: "",

    // stock/lote
    lotNumber: "",
    expiryDate: "",
    qty: "",
    unitCost: "",

    // ubicaciones
    plantId: "PL-01",
    drawerId: "",

    // QA
    temperature: "",
    qaStatus: "PASS",

    // proveedores/destinos
    supplier: "",
    flightId: "",
    flightDate: "",
    destinationArea: "", // para salidas internas si aplica

    // notas
    notes: "",
  });

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!product) return;
    setForm((f) => ({
      ...f,
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      unit: product.unit,
    }));
  }, [product]);

  function onChange(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate(values) {
    const e = {};
    // comunes
    if (!values.productId) e.productId = "Selecciona un producto";
    if (!values.plantId) e.plantId = "Selecciona la planta";
    if (!values.drawerId && activeTab !== "ADJUST") e.drawerId = "Selecciona el cajón";

    // cantidades
    if (!values.qty || Number(values.qty) <= 0) e.qty = "Cantidad inválida";

    // entrada y reingreso exigen lote y caducidad
    if (activeTab === "ENTRY" || activeTab === "RETURN") {
      if (!values.lotNumber) e.lotNumber = "Ingresa el lote";
      if (!values.expiryDate) e.expiryDate = "Selecciona la caducidad";
      if (values.expiryDate) {
        const today = new Date(); today.setHours(0,0,0,0);
        const exp = new Date(values.expiryDate); exp.setHours(0,0,0,0);
        if (exp < today) e.expiryDate = "La fecha de caducidad no puede ser pasada";
      }
      if (activeTab === "ENTRY" && (values.unitCost === "" || Number(values.unitCost) < 0)) {
        e.unitCost = "Costo inválido";
      }
    }

    // salida requiere destino
    if (activeTab === "ISSUE") {
      if (!values.flightId && !values.destinationArea) e.destinationArea = "Define el destino (vuelo o área)";
    }

    return e;
  }

  function onScanMock() {
    const p = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    setProduct(p);
    setQuery("");
    setToast({ type: "info", msg: `Código leído: ${p.sku}` });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const e1 = validate(form);
    setErrors(e1);
    if (Object.keys(e1).length) {
      setToast({ type: "error", msg: "Revisa los campos marcados" });
      return;
    }

    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 650));
      const action = activeTab === "ENTRY" ? "Ingreso" : activeTab === "ISSUE" ? "Salida" : activeTab === "RETURN" ? "Reingreso" : "Ajuste";
      setToast({ type: "success", msg: `${action} registrado: ${form.productName} (${form.qty} ${form.unit})` });
      // reset parcial conservando producto
      setForm((f) => ({
        ...f,
        lotNumber: "",
        expiryDate: "",
        qty: "",
        unitCost: "",
        supplier: "",
        drawerId: "",
        temperature: "",
        qaStatus: "PASS",
        notes: "",
        flightId: "",
        flightDate: "",
        destinationArea: "",
      }));
    } catch (err) {
      setToast({ type: "error", msg: "No se pudo guardar. Intenta otra vez." });
    } finally {
      setSubmitting(false);
    }
  }

  // ===== UI helpers (clases coherentes con Login/Inventory) =====
  const cls = {
    page: "relative min-h-screen",
    gradient: "pointer-events-none absolute inset-0 opacity-70",
    container: "relative mx-auto w-full max-w-6xl px-4 md:px-8 py-6 md:py-10",
    title: "text-3xl md:text-4xl font-bold text-white",
    subtitle: "text-sm md:text-base text-white/70",
    card: "rounded-2xl bg-[var(--bg-glass,rgba(8,10,45,0.55))] backdrop-blur border border-white/10 shadow-xl",
    sectionTitle: "text-white/90 text-sm tracking-wide uppercase font-medium",
    fieldLabel: "block text-white/80 text-sm mb-1",
    input: "w-full rounded-xl bg-white/10 text-white placeholder-white/40 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30",
    select: "w-full rounded-xl bg-white/10 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-white/30",
    btnGhost: "rounded-xl px-3 py-2 bg-white/10 hover:bg-white/20 text-white shadow border border-white/10",
    btnPrimary: "rounded-xl px-5 py-2 bg-[var(--accent,#16a34a)] hover:brightness-110 text-white font-medium shadow disabled:opacity-60 disabled:cursor-not-allowed",
    tabsWrap: "mt-6 mb-4 flex flex-wrap items-center gap-2",
    tab: (active) => `px-3 py-1.5 rounded-full text-sm border ${active ? "bg-white text-slate-900 border-transparent" : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"}`,
  };

  return (
    <div className={cls.page}>
      {/* Fondo con gradiente global */}
      <div className={cls.gradient} style={{ background: "var(--bg-gradient, radial-gradient(1200px 600px at -10% -10%, #1a1b3b, #0b0e2f))" }} />

      <div className={cls.container}>
        {/* Encabezado */}
        <header className="mb-6 md:mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className={cls.title}>
              Inventario <span className="text-white/60">·</span> <span className="text-white/90">Movimientos</span>
            </h1>
            <p className={cls.subtitle}>Entradas, salidas, reingresos y ajustes con control por lote, ubicación y QA.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onScanMock} className={cls.btnGhost}>📷 Escanear (mock)</button>
          </div>
        </header>

        {/* Tabs de movimiento */}
        <nav className={cls.tabsWrap} aria-label="Tipos de movimiento">
          {TABS.map(t => (
            <button key={t.key} className={cls.tab(activeTab === t.key)} onClick={() => setActiveTab(t.key)}>{t.label}</button>
          ))}
        </nav>

        {/* Card principal */}
        <div className={`${cls.card} p-4 md:p-6`}>          
          {/* BLOQUE: Producto */}
          <section className="mb-6">
            <h2 className={`${cls.sectionTitle} mb-3`}>Producto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <label className={cls.fieldLabel} htmlFor="search">Buscar (nombre, SKU o ID)</label>
                <input id="search" className={cls.input} placeholder="p.ej. Agua 500ml, BE-010 o P-1002" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
                {filteredProducts.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full rounded-xl bg-[#0b0e2f] border border-white/10 divide-y divide-white/10 max-h-56 overflow-auto">
                    {filteredProducts.map((p) => (
                      <li key={p.id}>
                        <button type="button" className="w-full text-left px-3 py-2 text-white hover:bg-white/10" onClick={() => setProduct(p)}>
                          <div className="text-sm font-medium">{p.name}</div>
                          <div className="text-xs text-white/60">{p.sku} · {p.id}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={cls.fieldLabel}>Producto</label>
                  <input className={`${cls.input} ${errors.productId ? 'ring-2 ring-red-400' : ''}`} value={form.productName} readOnly />
                  {errors.productId && <p className="text-red-300 text-xs mt-1">{errors.productId}</p>}
                </div>
                <div>
                  <label className={cls.fieldLabel}>SKU / Unidad</label>
                  <input className={cls.input} value={`${form.sku || ''} · ${form.unit || ''}`} readOnly />
                </div>
              </div>
            </div>
          </section>

          {/* BLOQUE: Datos según tab */}
          <section className="mb-6">
            <h2 className={`${cls.sectionTitle} mb-3`}>Detalles del movimiento</h2>

            {/* Entrada & Reingreso: lote/caducidad/costo */}
            {(activeTab === "ENTRY" || activeTab === "RETURN") && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={cls.fieldLabel} htmlFor="lot">No. de Lote</label>
                  <input id="lot" className={`${cls.input} ${errors.lotNumber ? 'ring-2 ring-red-400' : ''}`} placeholder="Ej. L2309-AX" value={form.lotNumber} onChange={(e) => onChange('lotNumber', e.target.value)} />
                  {errors.lotNumber && <p className="text-red-300 text-xs mt-1">{errors.lotNumber}</p>}
                </div>
                <div>
                  <label className={cls.fieldLabel} htmlFor="exp">Fecha de Caducidad</label>
                  <input id="exp" type="date" className={`${cls.input} ${errors.expiryDate ? 'ring-2 ring-red-400' : ''}`} value={form.expiryDate} onChange={(e) => onChange('expiryDate', e.target.value)} />
                  {errors.expiryDate && <p className="text-red-300 text-xs mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <label className={cls.fieldLabel} htmlFor="qty">Cantidad</label>
                  <input id="qty" type="number" step="0.01" className={`${cls.input} ${errors.qty ? 'ring-2 ring-red-400' : ''}`} placeholder="0" value={form.qty} onChange={(e) => onChange('qty', e.target.value)} />
                  {errors.qty && <p className="text-red-300 text-xs mt-1">{errors.qty}</p>}
                </div>
                <div>
                  <label className={cls.fieldLabel} htmlFor="cost">Costo unitario</label>
                  <input id="cost" type="number" step="0.0001" className={`${cls.input} ${errors.unitCost ? 'ring-2 ring-red-400' : ''}`} placeholder="0.00" value={form.unitCost} onChange={(e) => onChange('unitCost', e.target.value)} />
                  {errors.unitCost && <p className="text-red-300 text-xs mt-1">{errors.unitCost}</p>}
                </div>
                <div>
                  <label className={cls.fieldLabel} htmlFor="temp">Temperatura (°C)</label>
                  <input id="temp" type="number" step="0.1" className={cls.input} placeholder="Ej. 4.0" value={form.temperature} onChange={(e) => onChange('temperature', e.target.value)} />
                </div>
                <div>
                  <label className={cls.fieldLabel}>QA</label>
                  <select className={cls.select} value={form.qaStatus} onChange={(e) => onChange('qaStatus', e.target.value)}>
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                  </select>
                </div>
              </div>
            )}

            {/* Salida: destino */}
            {activeTab === "ISSUE" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={cls.fieldLabel} htmlFor="qty2">Cantidad</label>
                  <input id="qty2" type="number" step="0.01" className={`${cls.input} ${errors.qty ? 'ring-2 ring-red-400' : ''}`} placeholder="0" value={form.qty} onChange={(e) => onChange('qty', e.target.value)} />
                  {errors.qty && <p className="text-red-300 text-xs mt-1">{errors.qty}</p>}
                </div>
                <div>
                  <label className={cls.fieldLabel} htmlFor="flight">Flight ID (opcional)</label>
                  <input id="flight" className={cls.input} placeholder="Ej. MX123" value={form.flightId} onChange={(e) => onChange('flightId', e.target.value)} />
                </div>
                <div>
                  <label className={cls.fieldLabel} htmlFor="dest">Destino (área si no es vuelo)</label>
                  <input id="dest" className={`${cls.input} ${errors.destinationArea ? 'ring-2 ring-red-400' : ''}`} placeholder="Cocina fría / Embarque / ..." value={form.destinationArea} onChange={(e) => onChange('destinationArea', e.target.value)} />
                  {errors.destinationArea && <p className="text-red-300 text-xs mt-1">{errors.destinationArea}</p>}
                </div>
              </div>
            )}

            {/* Ajuste: motivo */}
            {activeTab === "ADJUST" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={cls.fieldLabel} htmlFor="qty3">Cantidad (+ / -)</label>
                  <input id="qty3" type="number" step="0.01" className={`${cls.input} ${errors.qty ? 'ring-2 ring-red-400' : ''}`} placeholder="0" value={form.qty} onChange={(e) => onChange('qty', e.target.value)} />
                  {errors.qty && <p className="text-red-300 text-xs mt-1">{errors.qty}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={cls.fieldLabel} htmlFor="notes2">Motivo</label>
                  <input id="notes2" className={cls.input} placeholder="Inventario físico, corrección, etc." value={form.notes} onChange={(e) => onChange('notes', e.target.value)} />
                </div>
              </div>
            )}
          </section>

          {/* BLOQUE: Ubicación / comunes */}
          <section className="mb-6">
            <h2 className={`${cls.sectionTitle} mb-3`}>Ubicación</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={cls.fieldLabel}>Planta</label>
                <select className={`${cls.select} ${errors.plantId ? 'ring-2 ring-red-400' : ''}`} value={form.plantId} onChange={(e) => onChange('plantId', e.target.value)}>
                  {MOCK_PLANTS.map((pl) => (<option key={pl.id} value={pl.id}>{pl.name}</option>))}
                </select>
                {errors.plantId && <p className="text-red-300 text-xs mt-1">{errors.plantId}</p>}
              </div>
              <div>
                <label className={cls.fieldLabel}>Cajón</label>
                <select className={`${cls.select} ${errors.drawerId ? 'ring-2 ring-red-400' : ''}`} value={form.drawerId} onChange={(e) => onChange('drawerId', e.target.value)}>
                  <option value="">Selecciona...</option>
                  {MOCK_DRAWERS.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                </select>
                {errors.drawerId && <p className="text-red-300 text-xs mt-1">{errors.drawerId}</p>}
              </div>
              <div>
                <label className={cls.fieldLabel} htmlFor="notes3">Notas</label>
                <input id="notes3" className={cls.input} placeholder="Observaciones" value={form.notes} onChange={(e) => onChange('notes', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3">
            <button type="button" className={cls.btnGhost} onClick={() => {
              setProduct(null); setQuery(""); setErrors({});
              setForm({
                productId: "", sku: "", productName: "", unit: "",
                lotNumber: "", expiryDate: "", qty: "", unitCost: "",
                plantId: "PL-01", drawerId: "",
                temperature: "", qaStatus: "PASS",
                supplier: "", flightId: "", flightDate: "", destinationArea: "",
                notes: "",
              });
            }}>Limpiar</button>
            <button onClick={onSubmit} disabled={submitting} className={cls.btnPrimary}>
              {submitting ? "Guardando..." : "Guardar movimiento"}
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div role="status" className={`fixed bottom-4 right-4 rounded-xl px-4 py-3 shadow-xl text-sm ${toast.type === 'success' ? 'bg-emerald-500 text-white' : toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-white text-slate-900'}`}
            onAnimationEnd={() => { setTimeout(() => setToast(null), 2200); }}>
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}

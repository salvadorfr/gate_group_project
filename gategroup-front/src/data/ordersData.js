/**
 * Mock de base de datos: Órdenes de producción / catering
 * Usado para desarrollo offline o pruebas de UI.
 */

export const MOCK_ORDERS = [
  { id: "ORD-1001", date: "2025-10-01", customer: "AeroMex Catering", items: 42, total: 12850.75, status: "NEW" },
  { id: "ORD-1002", date: "2025-10-01", customer: "SkyFoods",        items: 18, total:  3450.00, status: "PICKING" },
  { id: "ORD-1003", date: "2025-10-02", customer: "Gate Express",     items: 67, total: 21340.10, status: "READY" },
  { id: "ORD-1004", date: "2025-10-02", customer: "Lounge Premium",   items: 12, total:  1890.00, status: "SHIPPED" },
  { id: "ORD-1005", date: "2025-10-03", customer: "AeroMex Catering", items: 25, total:  7250.99, status: "CANCELLED" },
  { id: "ORD-1006", date: "2025-10-04", customer: "SkyFoods",        items: 31, total:  9700.50, status: "READY" },
  { id: "ORD-1007", date: "2025-10-04", customer: "Gate Express",    items: 10, total:  1899.99, status: "NEW" },
  { id: "ORD-1008", date: "2025-10-05", customer: "AeroMex Catering", items: 14, total:  4850.00, status: "PICKING" },
  { id: "ORD-1009", date: "2025-10-06", customer: "SkyFoods",        items: 22, total:  6850.25, status: "SHIPPED" },
  { id: "ORD-1010", date: "2025-10-06", customer: "Gate Express",    items: 50, total: 15820.75, status: "READY" },
];

/**
 * Diccionario de estados disponibles (para tabs, filtros o color-coding)
 */
export const ORDER_STATUSES = [
  { key: "",          label: "Todas" },
  { key: "NEW",       label: "Nuevo" },
  { key: "PICKING",   label: "Pick & Pack" },
  { key: "READY",     label: "Listo" },
  { key: "SHIPPED",   label: "Despachado" },
  { key: "CANCELLED", label: "Cancelado" },
];

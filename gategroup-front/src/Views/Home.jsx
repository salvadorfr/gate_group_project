import React from "react";
import Sidebar from "../componentes/SideBar";

function Home() {
  const menuItems = [
    { key: "inicio", label: "Inicio", href: "#", active: true },
    { key: "reportes", label: "Reportes", href: "#reportes" },
    { key: "config", label: "Configuración", href: "#config" },
  ];

  return (
    <div className="home-container">
      <Sidebar items={menuItems} header="Panel Principal" />
      <main className="home-content">
        <h1>Bienvenido a la vista Home</h1>
        <p>Selecciona una opción en el menú lateral.</p>
      </main>
    </div>
  );
}

export default Home;

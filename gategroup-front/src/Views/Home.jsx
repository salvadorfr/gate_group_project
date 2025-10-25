import React from "react";
import Sidebar from "../componentes/SideBar";

function Home() {
  const menuItems = [
    { key: "inventory", label: "Inventory", href: "#", active: true },
    { key: "orders", label: "Orders", href: "#reportes" },
    { key: "leftovers", label: "Leftovers", href: "#config" },
  ];

  return (
    <div className="home-layout">
      <Sidebar items={menuItems}/>
      <main className="home-content">
        <h1>Bienvenido a la vista Home</h1>
        <p>Selecciona una opción en el menú lateral.</p>
      </main>
    </div>
  );
}

export default Home;

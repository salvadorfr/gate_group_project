import React from "react";
import Sidebar from "../componentes/SideBar";
import { Routes, Route, Navigate } from "react-router-dom";
import Orders from "./Orders";

function HomeWelcome() {
  return (
    <>
      <h1>Bienvenido a la vista Home</h1>
      <p>Selecciona una opción en el menú lateral.</p>
    </>
  );
}
function Inventory() { return <h2>Inventory Inventory Inventory</h2>; }
function Leftovers() { return <h2>Leftovers Leftovers Leftovers</h2>; }

function Home() {
  const menuItems = [ 
    { key: "inventory", label: "Inventory", to: "inventory" },
    { key: "orders",    label: "Orders",    to: "orders" },
    { key: "leftovers", label: "Leftovers", to: "leftovers" },
  ];

  return (
    <div className="home-layout">
      <Sidebar items={menuItems}/>  
      <main className="home-content">
        <Routes>
          <Route index element={<HomeWelcome />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/leftovers" element={<Leftovers />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default Home;

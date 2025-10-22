import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ClientInfo() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-6">
        <h2 className="text-xl font-semibold mb-4">2. informação do cliente</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nombre" className="border p-2" />
          <input type="text" placeholder="Apellido" className="border p-2" />
          <input type="email" placeholder="Correo" className="border p-2" />
          <input type="tel" placeholder="Teléfono" className="border p-2" />
        </form>
        <button className="mt-4 bg-indigo-900 text-white px-4 py-2">Ir a envio</button>
      </main>
      <Footer />
    </div>
  );
}
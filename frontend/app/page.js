"use client";

import { useState } from "react";

const materials = [
  { id: 1, name: "palu arit", image: "foto1", vendor: "Vendor A", price: "100", category: "Tools" },
  { id: 2, name: "sekop", image: "foto2", vendor: "Vendor B", price: "200", category: "Tools" },
  { id: 3, name: "keriting", image: "foto3", vendor: "Vendor C", price: "300", category: "Materials" },
  { id: 4, name: "wajik", image: "foto4", vendor: "Vendor D", price: "300", category: "Materials" }
]

export default function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeContent, setActiveContent] = useState("home"); // Default ke "home"

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`flex flex-col h-screen bg-gray-800 text-white ${
          isMinimized ? "w-20" : "w-70"
        } transition-all duration-300 overflow-hidden`}
      >
        {/* Sidebar Logo */}
        <div className="flex items-center px-4 py-4 bg-gray-900">
          <img
            src="/logo1.png"
            alt="Logo"
            className="w-12 h-12 flex-shrink-0"
          />
          {!isMinimized && (
            <div className="ml-4 flex-1 overflow-hidden">
              <h1 className="text-sm font-bold whitespace-nowrap truncate">
                PT. REKA CIPTA INOVASI
              </h1>
              <p className="text-xs whitespace-nowrap truncate">
                Construction Engineering Services
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Collapse Button */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          {!isMinimized && <h1 className="text-lg font-bold">Procurement</h1>}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded hover:bg-gray-700 focus:outline-none"
          >
            {isMinimized ? "<>" : "<>"}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2 px-2 mt-4">
            <li>
              <button
                onClick={() => setActiveContent("home")}
                className="flex items-center w-full px-4 py-2 text-left rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">🏠</span>
                {!isMinimized && <span className="ml-4">Home</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveContent("permintaan-lapangan")}
                className="flex items-center w-full px-4 py-2 text-left rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">📋</span>
                {!isMinimized && <span className="ml-4">Permintaan Lapangan</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveContent("purchase-order")}
                className="flex items-center w-full px-4 py-2 text-left rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">🛒</span>
                {!isMinimized && <span className="ml-4">Purchase Order</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveContent("confirmation-order")}
                className="flex items-center w-full px-4 py-2 text-left rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">✔</span>
                {!isMinimized && (
                  <span className="ml-4">Confirmation Order</span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveContent("material")}
                className="flex items-center w-full px-4 py-2 text-left rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">📦</span>
                {!isMinimized && <span className="ml-4">Material</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveContent("setting")}
                className="flex items-center w-full px-4 py-2 text-left rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">⚙</span>
                {!isMinimized && <span className="ml-4">Setting</span>}
              </button>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={() => alert("Logout clicked!")}
            className="flex items-center w-full px-4 py-2 text-left rounded bg-red-600 hover:bg-red-700"
          >
            <span className="flex-shrink-0">🔒</span>
            {!isMinimized && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeContent === "home" && (
          <h1 className="text-4xl font-bold mb-4"> Procurement</h1>
        )}
        {activeContent === "permintaan-lapangan" && (
          <h1 className="text-4xl font-bold mb-4">Permintaan Lapangan</h1>
        )}
        {activeContent === "purchase-order" && (
          <h1 className="text-4xl font-bold mb-4">Purchase Order</h1>
        )}
        {activeContent === "confirmation-order" && (
          <h1 className="text-4xl font-bold mb-4">Confirmation Order</h1>
        )}
        {activeContent === "material" && (
          <div>
            <h1 className="text-4xl font-bold mb-4">Material</h1>
            <table className="table-auto border-collapse border border-gray-400 w-full">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">No</th>
                  <th className="border border-gray-300 px-4 py-2">Nama</th>
                  <th className="border border-gray-300 px-4 py-2">Gambar</th>
                  <th className="border border-gray-300 px-4 py-2">Vendor</th>
                  <th className="border border-gray-300 px-4 py-2">Harga</th>
                  <th className="border border-gray-300 px-4 py-2">Kategori</th>
                  <th className="border border-gray-300 px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material, index) => (
                  <tr key={material.id}>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {material.name || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {material.vendor || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {material.price || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {material.price || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {material.price || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {material.price || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeContent === "setting" && (
          <h1 className="text-4xl font-bold mb-4">Setting</h1>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function Sidebar({ setActiveContent }) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      className={`flex flex-col h-screen bg-gray-800 text-white ${
        isMinimized ? "w-20" : "w-70"
      } transition-all duration-300 overflow-hidden`}
    >
      
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

     
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        {!isMinimized && <h1 className="text-lg font-bold">Procurement</h1>}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-2 rounded hover:bg-gray-700 focus:outline-none"
        >
          {isMinimized ? "<>" : "<>"}
        </button>
      </div>

      
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2 px-2 mt-4">
          {[
            { id: "home", label: "Home", icon: "🏠" },
            { id: "permintaan-lapangan", label: "Permintaan Lapangan", icon: "📋" },
            { id: "purchase-order", label: "Purchase Order", icon: "🛒" },
            { id: "confirmation-order", label: "Confirmation Order", icon: "✔" },
            { id: "material", label: "Material", icon: "📦" },
            { id: "setting", label: "Setting", icon: "⚙" },
          ].map((menu) => (
            <li key={menu.id}>
              <button
                onClick={() => setActiveContent(menu.id)}
                className="flex items-center w-full px-4 py-2 text-left rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">{menu.icon}</span>
                {!isMinimized && <span className="ml-4">{menu.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

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
  );
}

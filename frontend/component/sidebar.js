"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Gunakan next/navigation

export default function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const router = useRouter();

  const handleNavigation = (page) => {
    router.push(`/?page=${page}`); // ✅ Gunakan query parameter "page"
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-100 text-gray-800 shadow-lg transition-all duration-300 ease-in-out ${isMinimized ? "w-20" : "w-72"}`}>
      <div className="flex items-center px-4 py-4 bg-white border-b">
        <img src="/logo1.png" alt="Logo" className={`w-10 h-10 flex-shrink-0 ${isMinimized ? "mx-auto" : ""}`} />
        {!isMinimized && (
          <div className="ml-4">
            <h1 className="text-sm font-bold text-blue-500 truncate">PT. REKA CIPTA INOVASI</h1>
            <p className="text-xs font-medium truncate">Construction Engineering Services</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mt-4 px-4">
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            {!isMinimized && <h2 className="text-xs font-bold text-gray-500">PROCUREMENT</h2>}
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 rounded-full bg-white shadow hover:bg-gray-200 focus:outline-none">
              {isMinimized ? "➡️" : "⬅️"}
            </button>
          </div>

          <ul className="space-y-1 mt-2">
            {[
              { id: "home", label: "Home", icon: "🏠", page: "home" },
              { id: "permintaan-lapangan", label: "Permintaan Lapangan", icon: "📄", page: "permintaan-lapangan" },
              { id: "purchase-order", label: "Purchase Order", icon: "🛒", page: "purchase-order" },
              { id: "confirmation-order", label: "Confirmation Order", icon: "✔️", page: "confirmation-order" },
              { id: "material", label: "Material", icon: "📦", page: "material" }
            ].map((menu) => (
              <li key={menu.id}>
                <button
                  onClick={() => handleNavigation(menu.page)}
                  className="flex items-center w-full px-4 py-2 text-sm rounded hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                >
                  <span className="text-lg">{menu.icon}</span>
                  {!isMinimized && <span className="ml-3 text-gray-800 font-medium">{menu.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-4 py-4 border-t">
        <button
          onClick={() => alert("Keluar clicked")}
          className="flex items-center w-full px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
        >
          <span className="text-lg">🔓</span>
          {!isMinimized && <span className="ml-3 text-gray-800 font-medium">Keluar</span>}
        </button>
      </div>
    </div>
  );
}

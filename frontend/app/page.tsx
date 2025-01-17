"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`flex flex-col h-screen bg-gray-800 text-white ${
          isMinimized ? "w-16" : "w-64"
        } transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          {!isMinimized && <h1 className="text-lg font-bold">Menu</h1>}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded hover:bg-gray-700 focus:outline-none"
          >
            {isMinimized ? "➤" : "⬅"}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2 px-2 mt-4">
            <li>
              <Link
                href="/permintaan-lapangan"
                className="flex items-center px-4 py-2 rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">📋</span>
                {!isMinimized && <span className="ml-4">Permintaan Lapangan</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/purchase-order"
                className="flex items-center px-4 py-2 rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">🛒</span>
                {!isMinimized && <span className="ml-4">Purchase Order</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/confirmation-order"
                className="flex items-center px-4 py-2 rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">✔</span>
                {!isMinimized && <span className="ml-4">Confirmation Order</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/material"
                className="flex items-center px-4 py-2 rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">📦</span>
                {!isMinimized && <span className="ml-4">Material</span>}
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={() => alert("Logout clicked!")}
            className="flex items-center w-full px-4 py-2 text-left rounded bg-red-600 hover:bg-red-700"
          >
            <span className="flex-shrink-0">🚪</span>
            {!isMinimized && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold"></h1>
      </div>
    </div>
  );
}

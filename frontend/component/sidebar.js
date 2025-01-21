import { useState } from "react";

export default function Sidebar({ setActiveContent }) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      className={`flex flex-col h-screen bg-white-800 text-blue ${
        isMinimized ? "w-20" : "w-70"
      } transition-all duration-500 ease-in-out overflow-hidden`} // Durasi diperpanjang
    >
      
      <div className="flex items-center px-4 py-4 bg-white-900">
        <img src="/logo1.png" alt="Logo" className="w-12 h-12 flex-shrink-0" />
        {!isMinimized && (
          <div className="ml-4 flex-1 overflow-hidden">
            <h1 className="text-sm font-extrabold text-blue-500 whitespace-nowrap truncate">
              PT. REKA CIPTA INOVASI
            </h1>
            <p className="text-xs font-bold whitespace-nowrap truncate">
              Construction Engineering Services
            </p>
          </div>
        )}
      </div>

     
      <div className="flex items-center justify-between px-4 py-3 bg-white-900">
        {!isMinimized && (
          <h1 className="text-lg font-bold text-blue-500">Procurement</h1>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-2 rounded text-blue-500 hover:text-white hover:bg-blue-700 focus:outline-none"
        >
          {isMinimized ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2 px-2 mt-4">
          {[
            { id: "home", label: "Home", icon: "🏠" },
            { id: "permintaan-lapangan", label: "Permintaan Lapangan", icon: "📋" },
            { id: "purchase-order", label: "Purchase Order", icon: "🛒" },
            { id: "confirmation-order", label: "Confirmation Order", icon: "✔️" },
            { id: "material", label: "Material", icon: "📦" },
            { id: "setting", label: "Setting", icon: "⚙️" },
          ].map((menu) => (
            <li key={menu.id}>
              <button
                onClick={() => setActiveContent(menu.id)}
                className="flex items-center w-full px-4 py-2 text-left rounded hover:bg-gray-700"
              >
                <span className="flex-shrink-0">{menu.icon}</span>
                {!isMinimized && (
                  <span className="ml-4 text-blue-500 font-bold">
                    {menu.label}
                  </span>
                )}
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
          <span className="flex-shrink-0 font-bold">🔒</span>
          {!isMinimized && <span className="ml-4 font-bold">Logout</span>}
        </button>
      </div>
    </div>
  );
}

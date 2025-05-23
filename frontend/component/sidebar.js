"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [userRole, setUserRole] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) setUserRole(role);
  }, []);

  const handleNavigation = (page) => {
    router.push(`/${page}`);
  };

  const menuItems = [
    { id: "home", label: "Home", icon: "🏠", page: "home", roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"] },
    { id: "material", label: "Material", icon: "📦", page: "material", roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"] },
    { id: "permintaan-lapangan", label: "Permintaan Lapangan", icon: "📄", page: "permintaan-lapangan", roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"] },
    { id: "confirmation-order", label: "Confirmation Order", icon: "✔️", page: "confirmation-order", roles: ["USER_PURCHASE", "ADMIN", "USER_LAPANGAN"] },
    { id: "purchase-order", label: "Purchase Order", icon: "🛒", page: "purchase-order", roles: ["USER_PURCHASE", "ADMIN"] },
    { id: "vendor", label: "Vendor", icon: "🏭", page: "vendor", roles: ["ADMIN", "USER_PURCHASE"] },
    { id: "kategori", label: "Kategori", icon: "🏷️", page: "kategori", roles: ["ADMIN", "USER_PURCHASE"] },
    { id: "user-control", label: "Users Control", icon: "👤", page: "usercontrol", roles: ["ADMIN"] },
  ];

  const filteredMenus = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <div
      className={`flex flex-col h-screen bg-gray-100 text-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
        isMinimized ? "w-20" : "w-72"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center px-4 py-4 bg-white border-b">
        <img src="/logo1.png" alt="Logo" className={`w-10 h-10 flex-shrink-0 ${isMinimized ? "mx-auto" : ""}`} />
        {!isMinimized && (
          <div className="ml-4">
            <h1 className="text-sm font-bold text-blue-500 truncate">PT. REKA CIPTA INOVASI</h1>
            <p className="text-xs font-medium truncate">Construction Engineering Services</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className="mt-4 px-4">
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            {!isMinimized && <h2 className="text-xs font-bold text-gray-500">MENU</h2>}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-full focus:outline-none"
            >
              {isMinimized ? "➡️" : "⬅️"}
            </button>
          </div>

          <ul className="space-y-1 mt-2">
            {filteredMenus.map((menu) => {
              const isActive = pathname.includes(menu.page);
              return (
                <li key={menu.id}>
                  <button
                    onClick={() => handleNavigation(menu.page)}
                    className={`flex items-center w-full px-4 py-2 text-sm rounded transition
                      ${isActive ? "bg-blue-100 font-semibold text-blue-800" : "hover:bg-blue-100"}
                      focus:outline-none`}
                    title={isMinimized ? menu.label : ""}
                  >
                    <span className="text-lg">{menu.icon}</span>
                    {!isMinimized && <span className="ml-3">{menu.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

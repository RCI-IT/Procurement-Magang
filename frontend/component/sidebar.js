"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar({ isMinimized, setIsMinimized }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setTimeout(() => router.push("/login"), 800);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error("User JSON parse error:", error);
      router.push("/login");
    }
  }, [router]);
  const handleNavigation = (page) => {
    router.push(`/${page}`);
  };

  const menuItems = [
    {
      group: "Manajemen Proyek",
      roles: ["ADMIN", "USER_PURCHASE", "USER_LAPANGAN"],
      children: [
        {
          id: "proyek-saya",
          label: "Proyek Saya",
          icon: "🏗️",
          page: "proyek",
          roles: ["ADMIN","USER_PURCHASE", "USER_LAPANGAN"],
        },
        {
          id: "manajemen-proyek",
          label: "Manajemen Proyek",
          icon: "🗂️",
          page: "admin/proyek",
          roles: ["ADMIN"],
        },
        {
          id: "penugasan-tim",
          label: "Penugasan Tim",
          icon: "👥",
          page: "admin/penugasan",
          roles: ["ADMIN"],
        },
        {
          id: "manajemen-tim",
          label: "Manajemen Tim",
          icon: "👷",
          page: "admin/karyawan",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      group: "Transaksi",
      roles: ["ADMIN", "USER_PURCHASE", "USER_LAPANGAN"],
      children: [
        {
          id: "permintaan-lapangan",
          label: "Permintaan Lapangan",
          icon: "📄",
          page: "permintaan-lapangan",
          roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"],
        },
        {
          id: "confirmation-order",
          label: "Confirmation Order",
          icon: "✔️",
          page: "confirmation-order",
          roles: ["USER_PURCHASE", "ADMIN", "USER_LAPANGAN"],
        },
        {
          id: "purchase-order",
          label: "Purchase Order",
          icon: "🛒",
          page: "purchase-order",
          roles: ["USER_PURCHASE", "ADMIN", "USER_LAPANGAN"],
        },
      ],
    },
    {
      group: "Anggaran",
      roles: ["ADMIN", "USER_PURCHASE"],
      children: [
        {
          id: "rencana-anggaran",
          label: "Rencana Anggaran (RAB)",
          icon: "📑",
          page: "anggaran/rab",
          roles: ["ADMIN", "USER_PURCHASE"],
        },
        {
          id: "realisasi-anggaran",
          label: "Realisasi & Kas",
          icon: "💰",
          page: "anggaran/realisasi",
          roles: ["ADMIN", "USER_PURCHASE"],
        },
      ],
    },
    {
      group: "Data Master",
      roles: ["ADMIN", "USER_PURCHASE", "USER_LAPANGAN"],
      children: [
        {
          id: "kategori",
          label: "Kategori",
          icon: "🏷️",
          page: "kategori",
          roles: ["ADMIN", "USER_PURCHASE"],
        },
        {
          id: "vendor",
          label: "Vendor",
          icon: "🏭",
          page: "vendor",
          roles: ["ADMIN", "USER_PURCHASE"],
        },
        {
          id: "material",
          label: "Material",
          icon: "📦",
          page: "material",
          roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"],
        },
      ],
    },
    {
      group: "Laporan",
      roles: ["ADMIN", "USER_PURCHASE"],
      children: [
        {
          id: "laporan-pengadaan",
          label: "Laporan Pengadaan",
          icon: "📊",
          page: "laporan/pengadaan",
          roles: ["ADMIN", "USER_PURCHASE"],
        },
        {
          id: "laporan-anggaran",
          label: "Laporan Anggaran",
          icon: "📉",
          page: "laporan/anggaran",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      group: "Lainnya",
      roles: ["ADMIN", "USER_PURCHASE", "USER_LAPANGAN"],
      children: [
        {
          id: "user-control",
          label: "Users Control",
          icon: "👤",
          page: "usercontrol",
          roles: ["ADMIN"],
        },
        {
          id: "petunjuk-lapangan",
          label: "Petunjuk Penggunaan",
          icon: "📘",
          page: "petunjuk/user-lapangan",
          roles: ["USER_LAPANGAN"],
        },
        {
          id: "petunjuk-purchase",
          label: "Petunjuk Penggunaan",
          icon: "📘",
          page: "petunjuk/user-purchasing",
          roles: ["USER_PURCHASE"],
        },
      ],
    },
  ];
  
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-screen bg-gray-100 text-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
        isMinimized ? "w-20" : "w-72"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center px-4 py-4 bg-white border-b no-print">
        <Image
          src={`/assets/logo1.png`}
          alt="Logo"
          width={200}
          height={200}
          className="w-10 h-10 object-contain"
          unoptimized
          priority
        />
        {!isMinimized && (
          <div className="ml-4">
            <h1 className="text-sm font-bold text-blue-500 truncate">
              PT. REKA CIPTA INOVASI
            </h1>
            <p className="text-xs font-medium truncate">
              Construction Engineering Services
            </p>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className="mt-4 px-4">
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            {!isMinimized && (
              <h2 className="text-xs font-bold text-gray-500">MENU</h2>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-full focus:outline-none"
            >
              {isMinimized ? "➡️" : "⬅️"}
            </button>
          </div>

          <ul className="space-y-1 mt-2">
            {menuItems.map((group, groupIndex) => {
              // Filter grup berdasarkan role
              if (!group.roles.includes(user?.role)) return null;

              const visibleChildren = group.children.filter((item) =>
                item.roles.includes(user?.role)
              );

              if (visibleChildren.length === 0) return null;

              return (
                <li key={groupIndex}>
                  {!isMinimized && (
                    <h3 className="text-xs font-semibold text-gray-500 mb-1 ml-2 mt-4">
                      {group.group}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {visibleChildren.map((menu) => {
                      const isActive = pathname.includes(menu.page);
                      return (
                        <li key={menu.id}>
                          <button
                            onClick={() => handleNavigation(menu.page)}
                            className={`flex items-center w-full px-4 py-2 text-sm rounded transition
                    ${
                      isActive
                        ? "bg-blue-100 font-semibold text-blue-800"
                        : "hover:bg-blue-100"
                    }
                    focus:outline-none`}
                            title={isMinimized ? menu.label : ""}
                          >
                            <span className="text-lg">{menu.icon}</span>
                            {!isMinimized && (
                              <span className="ml-3">{menu.label}</span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>

        </div>
      </div>
    </div>
  );
}

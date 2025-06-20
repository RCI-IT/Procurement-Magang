"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingIcon from "../../component/LoadingIcon";

const menuGroups = [
  {
    title: "Data Master",
    roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"],
    items: [
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
    title: "Transaksi",
    roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"],
    items: [
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
        roles: ["USER_PURCHASE", "ADMIN"],
      },
    ],
  },
  {
    title: "Lainnya",
    roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"],
    items: [
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

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  return (
    <div className="p-6 min-h-screen bg-white text-blue-500 flex flex-col items-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <LoadingIcon />
          <p className="text-gray-500 mt-4">Tetap Sabar ... :)</p>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-extrabold mb-10 tracking-wide text-black bg-clip-text">
            Procurement
          </h1>

          {menuGroups.map((group) => {
            if (!group.roles.includes(user?.role)) return null;

            const visibleItems = group.items.filter((item) =>
              item.roles.includes(user?.role)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="mb-10 w-full max-w-6xl ">
                <h2 className="text-center text-2xl font-bold text-black mb-4">
                  {group.title}
                </h2>
                <div className="flex flex-wrap gap-6 justify-center">
                  {visibleItems.map((menu) => (
                    <Link
                      key={menu.id}
                      href={`/${menu.page}`}
                      className="w-full sm:w-1/2 lg:w-1/4"
                    >
                      <div className="flex flex-col items-center justify-center bg-blue-500 p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 hover:bg-blue-400 text-white cursor-pointer w-full h-44">
                        <span className="text-6xl mb-4">{menu.icon}</span>
                        <span className="text-xl font-semibold text-center">
                          {menu.label}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

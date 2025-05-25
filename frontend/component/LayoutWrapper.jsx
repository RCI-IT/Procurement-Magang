"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Header from "./Header";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [username, setUsername] = useState("");

  // Ambil username dari localStorage saat komponen mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); // Dependensi kosong untuk hanya berjalan sekali saat mount

  const isLogin = pathname === "/login";
  const isHome = pathname === "/home";

  if (isLogin) {
    return <div>{children}</div>; // Tidak tampilkan layout sama sekali
  }

   if (isHome) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header username={username} />
        </div>
        <main className="mt-16 p-6">{children}</main> {/* mt-16 = tinggi header */}
      </div>
    );
  }

  return (
   <div className="flex min-h-screen">
      {/* Sidebar tetap */}
      <div className="fixed left-0 top-0 h-full w-64 z-50">
        <Sidebar />
      </div>

      {/* Konten utama geser ke kanan menyesuaikan sidebar */}
      <div className="flex-1 ml-64">
        {/* Header tetap */}
        <div className="fixed top-0 left-72 right-0 z-40">
          <Header username={username} />
        </div>

        {/* Konten dengan margin top untuk offset header */}
        <div className="mt-16 p-6">{children}</div>
      </div>
    </div>
  );
}

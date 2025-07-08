"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Header from "./Header";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const sidebarWidth = isMinimized ? 80 : 288; // 20rem = 288px

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
        <main className="mt-16 p-6">{children}</main>{" "}
        {/* mt-16 = tinggi header */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar isMinimized={isMinimized} setIsMinimized={setIsMinimized} />

      {/* Main Area */}
      <div
        className="flex flex-col flex-1"
        // style={{ marginLeft: sidebarWidth }}
      >
        <div
          className="sticky top-0 z-40 flex items-center bg-white border-b"
          style={{ left: sidebarWidth, right: 0 }}
        >
          <Header username={username} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

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
        <Header username={username} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header username={username} />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

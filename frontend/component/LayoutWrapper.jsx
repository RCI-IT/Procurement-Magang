"use client";

import Sidebar from "./sidebar";
import Header from "./Header";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isNoLayout = pathname === "/login" || pathname === "/home";

  if (isNoLayout) {
    return <div>{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header />
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

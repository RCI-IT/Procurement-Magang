"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header({ username }) {
  const router = useRouter();
  const pathname = usePathname(); // Mendapatkan path dari URL
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log("Current Path:", pathname);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // Definisi nama untuk menu utama
  const breadcrumbMap = {
    "permintaan-lapangan": "Permintaan Lapangan",
    "purchase-order": "Purchase Order",
    "material": "Material",
    "vendor": "Vendor",
  };

  // Ambil path sebagai array
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Buat breadcrumbs
  let breadcrumbs = [{ label: "Home", path: "/home" }];
  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    let label = breadcrumbMap[segment] || segment;

    // Jika ini adalah halaman utama, pastikan ditampilkan di breadcrumb
    if (breadcrumbMap[segment]) {
      breadcrumbs.push({ label, path: currentPath });
    } else if (segment.match(/^\d+$/)) {
      label = "Detail";
      breadcrumbs.push({ label, path: currentPath });
    } else if (segment === "edit") {
      label = "Edit";
      breadcrumbs.push({ label, path: currentPath });
    } else if (segment === "add") {
      label = "Tambah";
      breadcrumbs.push({ label, path: currentPath });
    }
  });

  return (
    <div className="w-full flex flex-col p-4 shadow-md bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-600 mb-2">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            <button onClick={() => router.push(crumb.path)} className="hover:underline">
              {crumb.label}
            </button>
          </span>
        ))}
      </nav>

      {/* User Dropdown */}
      <div className="flex justify-end">
        <div className="relative">
          <button
            className="flex items-center bg-white p-2 rounded-2xl shadow-md hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="mr-2 font-semibold">{username || "User"}</span>
            <span>▼</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-md min-w-[150px] z-10 border">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-600 hover:text-white rounded-md transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

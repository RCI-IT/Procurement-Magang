"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa"; 

export default function Header({ username }) {
  const router = useRouter();
  const pathname = usePathname(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log("Current Path:", pathname);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const breadcrumbMap = {
    "permintaan-lapangan": "Permintaan Lapangan",
    "purchase-order": "Purchase Order",
    "material": "Material",
    "vendor": "Vendor",
  };

  const pathSegments = pathname.split("/").filter((segment) => segment);
  let breadcrumbs = [];
  let currentPath = "";

  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    let label = breadcrumbMap[segment] || segment;

    // Menambahkan segment breadcrumb ke array breadcrumbs
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
    } else {
      breadcrumbs.push({ label, path: currentPath });
    }
  });

  return (
    <div className="w-full flex flex-col p-4 shadow-md bg-white">
      <nav className="flex items-center justify-between text-lg text-gray-800 font-semibold mb-4">
        <div className="flex items-center">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-500">/</span>}
              <button
                onClick={() => router.push(crumb.path)}
                className="text-blue-600 hover:underline"
                disabled={pathname === crumb.path}  // Disable button if already on this page
              >
                {crumb.label}
              </button>
            </span>
          ))}
        </div>

        <div className="relative">
          <button
            className="flex items-center bg-blue-600 p-3 rounded-2xl shadow-md hover:bg-blue-700 text-white transition-colors duration-200 ease-in-out"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaUserCircle size={24} className="mr-2" />
            <span className="mr-2 font-semibold">{username || "User"}</span>
            <span>▼</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-md min-w-[150px] z-10 border border-gray-300">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-600 hover:text-white rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

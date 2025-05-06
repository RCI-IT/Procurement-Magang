"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

export default function Header({ username }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const breadcrumbMap = {
    "permintaan-lapangan": "Permintaan Lapangan",
    "purchase-order": "Purchase Order",
    "material": "Material",
    "vendor": "Vendor",
    "confirmation-order": "Confirmation Order",
    "kategori": "Kategori",
    "login": "Login",
    "usercontrol": "User Control",
    "home": "Home",
  };

  const pathSegments = pathname.split("/").filter((segment) => segment);
  let breadcrumbs = [];
  let currentPath = "";

  // Tambahkan breadcrumb Home
  breadcrumbs.push({ label: "Home", path: "/home" });

  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    let label = "";

    if (breadcrumbMap[segment]) {
      label = breadcrumbMap[segment];
    } else if (segment.match(/^\d+$/)) {
      label = "Detail";
    } else if (segment === "edit") {
      label = "Edit";
    } else if (segment === "add") {
      label = "Tambah";
    } else if (segment === "[id]") {
      label = "ID";
    } else {
      label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    breadcrumbs.push({ label, path: currentPath });
  });

  const handleBreadcrumbClick = (path) => {
    if (pathname !== path) {
      router.push(path);
    }
  };

  return (
    <div className="w-full shadow-md bg-white">
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Breadcrumbs */}
        <div className="flex-1 flex items-center space-x-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              <button
                onClick={() => handleBreadcrumbClick(crumb.path)}
                className={`hover:underline ${
                  pathname === crumb.path
                    ? "text-gray-600 cursor-default"
                    : "text-blue-600"
                }`}
                disabled={pathname === crumb.path}
              >
                {crumb.label}
              </button>
            </span>
          ))}
        </div>

        <div className="relative flex items-center">
          <button
            className="flex items-center bg-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-blue-700 text-white transition duration-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaUserCircle size={20} className="mr-2" />
            <span className="mr-2 font-semibold">{username || "User"}</span>
            <span>▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-md shadow-md min-w-[150px] z-10 border border-gray-300 overflow-hidden animate-fade-in">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-600 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

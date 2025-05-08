"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ambil username dari localStorage saat pertama kali render
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const breadcrumbMap = {
    "home": "Home",
    "permintaan-lapangan": "Permintaan Lapangan",
    "purchase-order": "Purchase Order",
    "material": "Material",
    "vendor": "Vendor",
    "confirmation-order": "Confirmation Order",
    "kategori": "Kategori",
    "usercontrol": "User Control",
    "login": "Login",
  };

  const pathSegments = pathname.split("/").filter(Boolean);
  let breadcrumbs = [];
  let currentPath = "";

  // Menambahkan breadcrumb untuk Home secara default
  breadcrumbs.push({ label: "Home", path: "/home" });

  // Membuat breadcrumbs berdasarkan path
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;

    let label = "";
    if (breadcrumbMap[segment]) {
      label = breadcrumbMap[segment];
    } else if (segment === "add") {
      label = "Tambah";
    } else if (segment === "edit") {
      label = "Edit";
    } else if (/^\d+$/.test(segment)) {
      label = "Detail";
    } else {
      label = segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    }

    breadcrumbs.push({ label, path: currentPath });
  });

  // Menangani klik di breadcrumb
  const handleBreadcrumbClick = (path) => {
    if (path !== pathname && path !== breadcrumbs[breadcrumbs.length - 1]?.path) {
      router.push(path);
    }
  };

  // Menangani klik di luar dropdown untuk menutupnya
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full shadow-md bg-white">
      <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 gap-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 flex gap-2 flex-wrap items-center">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {idx !== 0 && <span>/</span>}
              {idx === breadcrumbs.length - 1 ? (
                // Breadcrumb yang aktif, tidak bisa diklik
                <span className="font-semibold text-blue-700">{crumb.label}</span>
              ) : (
                // Breadcrumb yang bukan aktif bisa diklik
                <button
                  onClick={() => handleBreadcrumbClick(crumb.path)}
                  className="hover:underline hover:text-blue-600 transition"
                >
                  {crumb.label}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* User Dropdown */}
        <div className="relative user-dropdown">
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

      {/* CSS untuk animasi dropdown */}
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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingIcon from "../../component/LoadingIcon"; // Import LoadingIcon

const navigationItems = [
  { id: "permintaan-lapangan", label: "Permintaan Lapangan", icon: "📄", page: "/?page=permintaan-lapangan" },
  { id: "purchase-order", label: "Purchase Order", icon: "🛒", page: "/?page=purchase-order" },
  { id: "material", label: "Material", icon: "📦", page: "/?page=material" },
];

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State loading

  useEffect(() => {
    const fetchData = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      const storedUsername = localStorage.getItem("username");
      const storedRole = localStorage.getItem("role");

      if (!loggedIn) {
        router.push("/login");
      } else {
        setUsername(storedUsername);
        setRole(storedRole);
      }

      setTimeout(() => {
        setIsLoading(false); // Matikan loading setelah data user diambil
      }, 950); // Simulasi loading 1 detik
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const filterNavigationItems = () => {
    switch (role) {
      case "ADMIN":
        return navigationItems;
      case "USER_LAPANGAN":
        return navigationItems.filter(item => item.id === "permintaan-lapangan");
      case "USER_PURCHASE":
        return navigationItems.filter(item => item.id === "material" || item.id === "purchase-order");
      default:
        return [];
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white text-blue-500 flex flex-col items-center">
      {/* Loading */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <LoadingIcon />
          <p className="text-gray-500 mt-4">Tetap Sabar ... :)</p>
        </div>
      ) : (
        <>
          {/* Header dengan Dropdown Profil */}
          <div className="w-full flex justify-end mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="flex items-center bg-white p-2 rounded-2xl shadow-md hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="mr-2 font-semibold">{username || "User"}</span>
                  <span>▼</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-md w-full">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-red-700 rounded-md hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Judul */}
          <h1 className="text-5xl font-extrabold mb-10 tracking-wide text-black bg-clip-text ">Procurement</h1>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-6 w-full max-w-md items-center">
            {filterNavigationItems().map((item) => (
              <Link key={item.id} href={item.page}>
                <div className="flex flex-col items-center justify-center bg-blue-500 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 hover:bg-blue-300 text-white cursor-pointer w-full h-32 min-w-[300px]">
                  <span className="text-5xl mb-4">{item.icon}</span>
                  <span className="text-lg font-semibold">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

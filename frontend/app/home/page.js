"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingIcon from "../../component/LoadingIcon";
import Header from "../../component/Header"; // Import Header

// Menu items yang sudah ada di Sidebar
const menuItems = [
  { id: "home", label: "Home", icon: "🏠", page: "home", roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"] },
  { id: "permintaan-lapangan", label: "Permintaan Lapangan", icon: "📄", page: "permintaan-lapangan", roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"] },
  { id: "purchase-order", label: "Purchase Order", icon: "🛒", page: "purchase-order", roles: ["USER_PURCHASE", "ADMIN"] },
  { id: "material", label: "Material", icon: "📦", page: "material", roles: ["USER_LAPANGAN", "USER_PURCHASE", "ADMIN"] },
  { id: "confirmation-order", label: "Confirmation Order", icon: "✔️", page: "confirmation-order", roles: ["USER_PURCHASE", "ADMIN", "USER_LAPANGAN"] },
  { id: "vendor", label: "Vendor", icon: "🏭", page: "vendor", roles: ["USER_PURCHASE", "ADMIN"] },
  { id: "kategori", label: "Kategori", icon: "🏷️", page: "kategori", roles: ["ADMIN", "USER_PURCHASE"] },
  { id: "user-control", label: "Users Control", icon: "👤", page: "user-control", roles: ["ADMIN"] },
];

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }, 950);
    };

    fetchData();
  }, [router]);

  // Filter menu berdasarkan role user
  const filteredMenus = menuItems.filter((item) => item.roles.includes(role));

  return (
    <div className="p-6 min-h-screen bg-white text-blue-500 flex flex-col items-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <LoadingIcon />
          <p className="text-gray-500 mt-4">Tetap Sabar ... :)</p>
        </div>
      ) : (
        <>
          <Header username={username} />

          <h1 className="text-5xl font-extrabold mb-10 tracking-wide text-black bg-clip-text">Procurement</h1>

          <div className="flex flex-col gap-6 w-full max-w-md items-center">
            {filteredMenus.map((menu) => (
              <Link key={menu.id} href={`/?page=${menu.page}`}>
                <div className="flex flex-col items-center justify-center bg-blue-500 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 hover:bg-blue-300 text-white cursor-pointer w-full h-32 min-w-[300px]">
                  <span className="text-5xl mb-4">{menu.icon}</span>
                  <span className="text-lg font-semibold">{menu.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

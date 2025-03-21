"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingIcon from "../../component/LoadingIcon";
import Header from "../../component/Header"; // Import Header

const navigationItems = [
  { id: "permintaan-lapangan", label: "Permintaan Lapangan", icon: "📄", page: "/?page=permintaan-lapangan" },
  { id: "purchase-order", label: "Purchase Order", icon: "🛒", page: "/?page=purchase-order" },
  { id: "material", label: "Material", icon: "📦", page: "/?page=material" },
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

  const filterNavigationItems = () => {
    switch (role) {
      case "ADMIN":
        return navigationItems;
      case "USER_LAPANGAN":
        return navigationItems.filter(item => item.id === "material" || item.id === "permintaan-lapangan");
      case "USER_PURCHASE":
        return navigationItems.filter(item => item.id === "material" || item.id === "purchase-order");
      default:
        return [];
    }
  };

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

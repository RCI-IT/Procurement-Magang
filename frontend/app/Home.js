"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navigationItems = [
  { id: "permintaan-lapangan", label: "Permintaan Lapangan", icon: "📄", page: "/?page=permintaan-lapangan" },
  { id: "purchase-order", label: "Purchase Order", icon: "🛒", page: "/?page=purchase-order" },
  { id: "material", label: "Material", icon: "📦", page: "/?page=material" },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("http://192.168.110.204:5000/users")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const handleLogin = () => {
    const validUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (validUser) {
      setIsLoggedIn(true);
      setRole(validUser.role);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setRole("");
    setIsDropdownOpen(false);
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-blue-500">
        <div className="p-8 bg-blue-500 text-white rounded-2xl shadow-lg w-80">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 rounded-md text-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 rounded-md text-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-white text-blue-500 p-2 rounded-md hover:bg-blue-100"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-white text-blue-500 flex flex-col items-center">
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
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ username }) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="w-full flex justify-end mb-6 p-4 shadow-md bg-white">
      <div className="relative">
        <button
          className="flex items-center bg-white p-2 rounded-2xl shadow-md hover:bg-gray-100"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="mr-2 font-semibold">{username || "User"}</span>
          <span>▼</span>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white rounded-md w-full shadow-md">
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
  );
}

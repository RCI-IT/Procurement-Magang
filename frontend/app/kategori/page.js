/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../component/sidebar.js";
import Header from "../../component/Header.js";

export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!res.ok) throw new Error("Gagal fetch kategori");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1 overflow-auto">
          <Header username={username} />
          <h1 className="text-3xl font-bold mb-4">Kategori</h1>

          <div className="mb-4 flex justify-between space-x-2">
            <input
              type="text"
              placeholder="Cari Kategori"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama Kategori</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .filter((c) => c.name.toLowerCase().includes(searchQuery))
                .map((category, index) => (
                  <tr key={category.id}>
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2 text-center">{category.name}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

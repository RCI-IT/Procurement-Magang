"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../component/sidebar.js";
import Header from "../../component/Header.js";

export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (!res.ok) throw new Error("Gagal fetch kategori");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan kategori");
      setNewCategoryName("");
      setShowModal(false);
      fetchCategories(); // Refresh data
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1 overflow-auto">
          <Header username={username} />
          <h1 className="text-3xl font-bold mb-4">Kategori</h1>

          <div className="mb-4 flex justify-end items-center gap-x-5">
            <input
              type="text"
              placeholder="Cari Kategori"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Tambah
            </button>
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

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="mb-4 flex justify-end items-cente gap-x-5">
                <h2 className="text-l font-bold mb-4">Tambah Kategori</h2>
                <input
                  type="text"
                  placeholder="Nama kategori"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

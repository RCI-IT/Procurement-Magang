"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../component/sidebar.js";
import Header from "../../component/Header.js";
import Swal from "sweetalert2";
import { Eye, Trash2 } from "lucide-react";

export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [username, setUsername] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

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
    if (!newCategoryName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama kategori kosong",
        text: "Silakan masukkan nama kategori terlebih dahulu.",
      });
      return;
    }

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
      fetchCategories();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil ditambahkan!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Kategori gagal ditambahkan.",
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Gagal menghapus kategori");

        fetchCategories();
        Swal.fire("Dihapus!", "Kategori telah dihapus.", "success");
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "Gagal menghapus kategori.", "error");
      }
    }
  };

  const handleDetail = (id) => {
    router.push(`/kategori/${id}`);
  };
  

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1 overflow-auto">
          <Header username={username} /><br></br>
          <h1 className="text-3xl font-bold mb-4">Kategori</h1>
          <div className="mb-4 flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">

            </div>
            <div className="flex items-center space-x-4">
            <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>

              <input
                type="text"
                placeholder="Cari Kategori"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value.toLowerCase());
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 w-48"
              />
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                + Kategori
              </button>
            </div>
          </div>

          <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama Kategori</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category, index) => (
                <tr key={category.id}>
                  <td className="border px-4 py-2 text-center">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="border px-4 py-2 text-center">{category.name}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                  <button
  onClick={() => handleDetail(category.id)}
  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-green-600"
>
  <Eye className="text-white" />
</button>

                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <Trash2 className="text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Tambah Kategori</h2>
                <input
                  type="text"
                  placeholder="Nama kategori"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="border border-gray-300 w-full rounded px-3 py-2 mb-4"
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

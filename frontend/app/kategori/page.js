"use client";

import React, { useState, useEffect } from "react";
import { fetchWithToken } from "../../services/fetchWithToken";
import { fetchWithAuth } from "../../services/apiClient";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Eye, Trash2 } from "lucide-react";

export default function KategoriPage() {
  const [categories, setCategories] = useState([]);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const router = useRouter();

  const getData = async () => {
    const data = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      token,
      setToken,
      () => router.push("/login")
    );

    if (data) setCategories(data);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = () => {
    getData();
  };

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim().toLowerCase();
    if (!trimmedName) {
      Swal.fire({
        icon: "warning",
        title: "Nama kategori kosong",
        text: "Silakan masukkan nama kategori terlebih dahulu.",
      });
      return;
    }

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newCategoryName }),
        }
      );

      if (!res) throw new Error("Gagal menambahkan kategori");

      setNewCategoryName("");
      setShowModal(false);
      fetchData();

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res) throw new Error("Gagal menghapus kategori");

        fetchData();
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

  const sortedCategories = [...categories]
    .filter((c) => c.name.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "terbaru") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "terlama") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  const totalPages = Math.ceil(sortedCategories.length / rowsPerPage);
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) setCurrentPage(currentPage - 1);
  // };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <main className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-4">Kategori</h1>
          <div className="mb-4 flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <label className="mr-2">Urutkan :</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="name">Nama</option>
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                </select>

                <label className="mr-2">Tampilkan :</label>

                <select
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
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Cari Kategori"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value.toLowerCase());
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-4 py-2 w-48"
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
                  <td className="border px-4 py-2 text-center">
                    {category.name}
                  </td>
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

          <div className="flex justify-center mt-6">
            <nav
              className="inline-flex rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 text-blue-600 hover:bg-gray-100 disabled:text-gray-400"
              >
                «
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border border-gray-300 ${
                      currentPage === page
                        ? "text-white bg-blue-500"
                        : "text-blue-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 text-blue-600 hover:bg-gray-100 disabled:text-gray-400"
              >
                »
              </button>
            </nav>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Tambah Kategori</h2>
                <input
                  type="text"
                  placeholder="Nama kategori"
                  value={newCategoryName}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewCategoryName(name);

                    const exists = categories.some(
                      (cat) =>
                        cat.name.toLowerCase() === name.trim().toLowerCase()
                    );

                    setIsDuplicate(exists);
                  }}
                  className={`border w-full rounded px-3 py-2 mb-1 ${
                    isDuplicate ? "border-red-500" : "border-gray-300"
                  }`}
                  // className="border border-gray-300 w-full rounded px-3 py-2 mb-4"
                />
                {isDuplicate ? (
                  <p className="text-red-500 text-sm mb-2">
                    Nama kategori sudah ada.
                  </p>
                ) : (
                  <></>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setNewCategoryName(""); // reset input
                      setIsDuplicate(false); // reset status duplikat
                    }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddCategory}
                    disabled={isDuplicate}
                    className={`px-4 py-2 rounded text-white transition 
                      ${
                        isDuplicate
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
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

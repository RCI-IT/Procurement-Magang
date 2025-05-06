"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";
import Header from "../../../component/Header";
import Swal from "sweetalert2";

export default function KategoriDetailPage() {
  const params = useParams();
  const id = params.id;

  const [category, setCategory] = useState(null);
  const [username, setUsername] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (id) {
      fetchCategoryDetail();
    }
  }, [id]);

  const fetchCategoryDetail = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`);
      if (!res.ok) throw new Error("Gagal mengambil data kategori");
      const data = await res.json();
      setCategory(data);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Tidak dapat memuat data kategori.",
      });
    }
  };

  if (!category) return <div className="p-10">Memuat data...</div>;

  const totalPages = category?.materials ? Math.ceil(category.materials.length / rowsPerPage) : 1;

  const paginatedMaterials = category?.materials
    ? category.materials.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header username={username} />
        <br />

        <div className="bg-white shadow-md p-6 rounded-md">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        </div>
        <br />

        <div className="bg-white shadow-md p-6 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Material yang sama</h2>
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
          </div>

          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama Material</th>
                <th className="border px-4 py-2">Vendor</th>
                <th className="border px-4 py-2">Harga</th>
                <th className="border px-4 py-2">Gambar</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMaterials.length > 0 ? (
                paginatedMaterials.map((material, index) => (
                  <tr key={material.id}>
                    <td className="border px-4 py-2 text-center">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="border px-4 py-2 text-center">{material.name}</td>
                    <td className="border px-4 py-2 text-center">{material.vendor?.name || "-"}</td>
                    <td className="border px-4 py-2 text-center">
                      Rp{material.price.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 flex justify-center items-center">
                      {material.image ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${material.image}`}
                          alt={material.image}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">Tidak ada gambar</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    Tidak ada material dalam kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="mt-6 bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="mt-6 bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div>
          <button onClick={() => router.back()} className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">
            Kembali
          </button>
        </div>
        </div>
      </main>
    </div>
  );
}

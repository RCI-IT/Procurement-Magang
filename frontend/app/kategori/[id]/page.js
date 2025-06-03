"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchWithToken } from "../../../services/fetchWithToken";

export default function KategoriDetailPage() {
  const params = useParams();
  const id = params.id;

  const [category, setCategory] = useState(null);
  const [material, setMaterial] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [sortBy, setSortBy] = useState("name");

  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (id) {
      fetchCategoryDetail();
    }
  }, [id]);

  const fetchCategoryDetail = async () => {
    try {
      const res = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        token,
        setToken,
        () => router.push("/login")
      );
      const material = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/materials?categoryId=${id}`,
        token,
        setToken,
        () => router.push("/login")
      )
      if (!res) throw new Error("Gagal mengambil data kategori");
      setCategory(res);
      setMaterial(material)
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

  const totalPages = category?.materials
    ? Math.ceil(category.materials.length / rowsPerPage)
    : 1;

  const sortedMaterials = category?.materials
    ? [...category.materials].sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "harga") {
          return a.price - b.price;
        } else if (sortBy === "terbaru") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === "terlama") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0;
      })
    : [];

  const paginatedMaterials = sortedMaterials.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <br />

        <div className="bg-white shadow-md p-6 rounded-md">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        </div>
        <br />

        <div className="bg-white shadow-md p-6 rounded-md">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-2xl font-bold">Material yang sama</h2>
            <div className="flex items-center gap-2">
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

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="name">Nama</option>
                <option value="harga">Harga</option>
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
              </select>
            </div>
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
              {material.length > 0 ? (
                paginatedMaterials.map((material, index) => (
                  <tr key={material.id}>
                    <td className="border px-4 py-2 text-center">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {material.name}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {material.vendor?.name || "-"}
                    </td>
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

          <div>
            <button
              onClick={() => router.back()}
              className="mt-6 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Kembali
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

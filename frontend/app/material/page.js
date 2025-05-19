"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function Material() {
  const token = localStorage.getItem("token")
  const [materials, setMaterials] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("terbaru");
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialRes, vendorRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!materialRes.ok || !vendorRes.ok)
          throw new Error("Gagal mengambil data");

        const [materialData, vendorData] = await Promise.all([
          materialRes.json(),
          vendorRes.json(),
        ]);

        setMaterials(materialData);
        setVendors(vendorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setUserRole(storedRole);
  }, []);

  const handleVendorClick = (vendorId) => {
    if (vendorId) router.push(`/vendor/${vendorId}`);
  };

  const handleMaterialClick = (materialId) => {
    localStorage.setItem("selectedMaterialId", materialId);
    router.push(`/material/${materialId}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Material ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Gagal menghapus material");

      setMaterials((prev) => prev.filter((material) => material.id !== id));
      Swal.fire("Berhasil!", "Material berhasil dihapus.", "success");
    } catch (error) {
      console.error("Error deleting material:", error);
      Swal.fire(
        "Gagal!",
        `Gagal menghapus material: ${error.message}`,
        "error"
      );
    }
  };

  const sortedMaterials = [...materials]
    .filter((m) => m.name.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      const vendorA = vendors.find((v) => v.id === a.vendorId)?.name || "";
      const vendorB = vendors.find((v) => v.id === b.vendorId)?.name || "";
      switch (sortBy) {
        case "nama":
          return a.name.localeCompare(b.name);
        case "vendor":
          return vendorA.localeCompare(vendorB);
        case "harga":
          return a.price - b.price;
        case "terbaru":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "terlama":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(sortedMaterials.length / rowsToShow);
  const currentData = sortedMaterials.slice(
    (currentPage - 1) * rowsToShow,
    currentPage * rowsToShow
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
        <main className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold my-4">Material</h1>

          <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
            <div className="flex space-x-2 items-center">
              <label className="mr-2">Urutkan:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="nama">Nama</option>
                <option value="vendor">Vendor</option>
                <option value="harga">Harga</option>
              </select>
              <label className="mr-2">Tampilkan:</label>
              <select
                value={rowsToShow}
                onChange={(e) => setRowsToShow(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[5, 10, 15].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Cari Material"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              {userRole !== "USER_LAPANGAN" && (
              <button
                onClick={() => router.push("/material/add")}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                + Material
              </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full mt-2">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Nama</th>
                  <th className="border px-4 py-2">Gambar</th>
                  <th className="border px-4 py-2">Vendor</th>
                  <th className="border px-4 py-2">Harga</th>
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((material, index) => {
                    const vendor = vendors.find(
                      (v) => v.id === material.vendorId
                    );
                    return (
                      <tr key={material.id}>
                        <td className="border px-4 py-2 text-center">
                          {(currentPage - 1) * rowsToShow + index + 1}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {material.name}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${material.image}`}
                            alt={material.image}
                            className="w-16 h-16 object-cover mx-auto"
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {vendor ? (
                            <button
                              onClick={() =>
                                handleVendorClick(material.vendorId)
                              }
                              className="text-blue-500 underline"
                            >
                              {vendor.name}
                            </button>
                          ) : (
                            "Tidak Ada Vendor"
                          )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          Rp{" "}
                          {new Intl.NumberFormat("id-ID").format(
                            material.price
                          )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => handleMaterialClick(material.id)}
                            className="bg-blue-500 text-white rounded px-2 py-1"
                          >
                            <Eye className="text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(material.id)}
                            className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                          >
                            <Trash2 className="text-white" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        </main>
      </div>
    </div>
  );
}

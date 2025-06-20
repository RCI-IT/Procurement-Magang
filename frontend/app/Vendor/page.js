"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";
import Pagination from "@/component/Pagination";

export default function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [rowsToShow, setRowsToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const router = useRouter();

  const getData = async () => {
    const data = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/vendors`,
      token,
      setToken,
      () => router.push("/login")
    );
    if (data) setVendors(data);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = () => {
    getData();
  };

  const handleVendorClick = (vendorId) => {
    if (!vendorId) return;
    router.push(`/vendor/${vendorId}`);
  };

  const handleDelete = async (vendorId) => {
    const result = await Swal.fire({
      title:
        "Yakin ingin hapus vendor ini dan seluruh material terkait vendor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const message =
          errorData.error || errorData.message || "Gagal menghapus permintaan.";

        Swal.fire("Gagal!", message, "error");
        return;
      }

      Swal.fire({
        title: "Berhasil!",
        text: "Vendor berhasil dihapus.",
        icon: "success",
        confirmButtonText: "OK",
      });

      fetchData();
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menghapus vendor.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const filteredVendors = Array.isArray(vendors)
    ? vendors
        .filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
          if (sortBy === "created_desc") {
            return new Date(b.createdAt) - new Date(a.createdAt);
          } else if (sortBy === "created_asc") {
            return new Date(a.createdAt) - new Date(b.createdAt);
          } else {
            const aVal = a[sortBy]?.toLowerCase() || "";
            const bVal = b[sortBy]?.toLowerCase() || "";
            return aVal.localeCompare(bVal);
          }
        })
    : [];

  const totalPages = Math.ceil(filteredVendors.length / rowsToShow);

  const displayedVendors = filteredVendors.slice(
    (currentPage - 1) * rowsToShow,
    currentPage * rowsToShow
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <main className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-4">Vendor</h1>

          <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-4 items-center">
              <div>
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
                  <option value="city">Kota</option>
                  <option value="created_desc">Terbaru</option>
                  <option value="created_asc">Terlama</option>
                </select>
              </div>
              <div>
                <label className="mr-2">Tampilkan</label>
                <select
                  value={rowsToShow}
                  onChange={(e) => {
                    setRowsToShow(Number(e.target.value));
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

            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Cari Vendor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <button
                onClick={() => router.push("/vendor/add")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                + Vendor
              </button>
            </div>
          </div>

          <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama</th>
                <th className="border px-4 py-2">Alamat</th>
                <th className="border px-4 py-2">Kota</th>
                <th className="border px-4 py-2">No Telepon</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedVendors.map((vendor, index) => (
                <tr key={vendor.id}>
                  <td className="border px-4 py-2 text-center">
                    {(currentPage - 1) * rowsToShow + index + 1}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {vendor.name}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {vendor.address}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {vendor.city}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {vendor.phone}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleVendorClick(vendor.id)}
                      className="bg-blue-500 text-white rounded px-2 py-1"
                    >
                      <Eye className="text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                    >
                      <Trash2 className="text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
}

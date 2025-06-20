/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";
import Pagination from "@/component/Pagination";

const ConfirmationOrderTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [rowsToShow, setRowsToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState("terbaru");
  const [token, setToken] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setTimeout(() => router.push("/login"), 800);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error("User JSON parse error:", error);
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/confirmation`,
          token,
          setToken,
          () => router.push("/login")
        );
        if (!response) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = Array.isArray(data)
      ? data.filter(
          (item) =>
            item.nomorCO?.toLowerCase().includes(search.toLowerCase()) ||
            item.lokasiCO?.toLowerCase().includes(search.toLowerCase())
        )
      : [];

    if (sortBy === "terbaru") {
      filtered.sort((a, b) => new Date(a.tanggalCO) - new Date(b.tanggalCO));
    } else {
      filtered.sort((a, b) => new Date(b.tanggalCO) - new Date(a.tanggalCO));
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, search, sortBy]);

  const totalPages = Math.ceil(filteredData.length / rowsToShow);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsToShow,
    currentPage * rowsToShow
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/confirmation/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message || "Gagal menghapus data!";

        if (response.status === 400) {
          throw new Error(`Terdapat Data PO terkait! ${message}`);
        }

        throw new Error(message);
      }

      await Swal.fire("Data berhasil dihapus!", "", "success");

      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      Swal.fire("Terjadi kesalahan!", err.message, "error");
    }
  };

  const ActionButtons = ({ onView, onDelete }) => (
    <div className="flex justify-center gap-4">
      <button
        onClick={onView}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center"
      >
        <Eye />
      </button>
      <button
        onClick={onDelete}
        className="bg-red-500 hover:bg-red-600 text-white rounded-xl w-12 h-12 flex items-center justify-center"
      >
        <Trash2 />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen">
      <div className="p-4 flex-1 bg-white shadow-md rounded-md overflow-auto">
        <h1 className="text-3xl font-bold mb-4 mt-4">Confirmation Order</h1>
        <div className="mb-4 flex justify-between items-end flex-wrap gap-2">
          <div className="flex space-x-2">
            <label className="mr-2">Urutkan:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
            </select>
            <label className="mr-2">Tampilkan:</label>
            <select
              value={rowsToShow}
              onChange={(e) => setRowsToShow(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Cari CO..."
              className="border border-gray-300 rounded px-4 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {user?.role !== "USER_LAPANGAN" && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                onClick={() => router.push("/confirmation-order/add")}
              >
                + Tambah
              </button>
            )}
          </div>
        </div>
        {isLoading ? (
          <p className="text-center">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2">No.</th>
                <th className="border p-2">Nomor</th>
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Lokasi</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((co, index) => (
                  <tr key={co.id} className="text-center border">
                    <td className="border p-2">
                      {(currentPage - 1) * rowsToShow + index + 1}
                    </td>
                    <td className="border p-2">{co.nomorCO}</td>
                    <td className="border p-2">
                      {co.tanggalCO
                        ? new Date(co.tanggalCO).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="border p-2">{co.lokasiCO}</td>
                    <td className="border p-2">
                      <ActionButtons
                        onView={() =>
                          router.push(`/confirmation-order/${co.id}`)
                        }
                        onDelete={() => handleDelete(co.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ConfirmationOrderTable;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";
import Pagination from "@/component/Pagination";

const PurchaseOrderTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("terbaru");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/purchase`,
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
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data.filter(
      (item) =>
        item.nomorPO?.toLowerCase().includes(search.toLowerCase()) ||
        item.lokasiPO?.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "terbaru") {
      filtered.sort((a, b) => new Date(a.tanggalPO) - new Date(b.tanggalPO));
    } else if (sortBy === "terlama") {
      filtered.sort((a, b) => new Date(b.tanggalPO) - new Date(a.tanggalPO));
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, data, sortBy]);

  const totalPages = Math.ceil(filteredData.length / rowsToShow);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsToShow,
    currentPage * rowsToShow
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus Purchase Order ini?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/purchase/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Gagal menghapus Purchase Order");
        }

        Swal.fire("Dihapus!", "Purchase Order berhasil dihapus.", "success");
        setData(data.filter((item) => item.id !== id));
      } catch (err) {
        Swal.fire("Gagal", err.message, "error");
      }
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
        <h1 className="text-3xl font-bold mb-4 mt-4">Purchase Order</h1>

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
            <label className="mr-2">Tampilkan :</label>
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

          <input
            type="text"
            placeholder="Cari PO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm"
          />
        </div>

        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2">No.</th>
                <th className="border p-2">Nomor PO</th>
                <th className="border p-2">Tanggal PO</th>
                <th className="border p-2">Lokasi</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((po, index) => (
                  <tr key={po.id} className="text-center border">
                    <td className="border p-2">
                      {(currentPage - 1) * rowsToShow + index + 1}
                    </td>
                    <td className="border p-2">{po.nomorPO}</td>
                    <td className="border p-2">
                      {po.tanggalPO
                        ? new Date(po.tanggalPO).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="border p-2">{po.lokasiPO}</td>
                    <td className="border p-2">
                      <ActionButtons
                        onView={() => router.push(`/purchase-order/${po.id}`)}
                        onDelete={() => handleDelete(po.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    Tidak ada data Purchase Order
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

export default PurchaseOrderTable;

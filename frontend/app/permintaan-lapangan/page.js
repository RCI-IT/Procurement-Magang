/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function PermintaanLapangan({}) {
  const [rowsToShow, setRowsToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatedData, setUpdatedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (storedToken) setToken(storedToken);
    if (role) setUserRole(role);
  }, []);

  const getMonthName = (monthNumber) => months[monthNumber - 1];

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  };

  const getStatus = (status) => status;

  useEffect(() => {
    const fetchPermintaanLapangan = async () => {
      try {
        const data = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/permintaan`,
          token,
          setToken,
          () => router.push("/login")
        );

        if (Array.isArray(data)) setUpdatedData(data);
      } catch (error) {
        console.error("Gagal mengambil data permintaan lapangan:", error);
      }
    };
    fetchPermintaanLapangan();
  }, []);

  const handleDetail = async (id) => {
    if (userRole === "USER_PURCHASE" || userRole === "ADMIN") {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "READ" }),
          }
        );

        if (!response) throw new Error("Gagal memperbarui status ke READ");

        setUpdatedData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, status: "READ" } : item
          )
        );

        router.push(`/permintaan-lapangan/${id}`);
      } catch (error) {
        console.error("Gagal memperbarui status:", error);
        alert("Terjadi kesalahan saat memperbarui status.");
      }
    } else {
      router.push(`/permintaan-lapangan/${id}`);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan permintaan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message || "Gagal menghapus data!";
    
        if (response.status === 400) {
          throw new Error(`Terdapat Data CO terkait! ${message}`);
        }
    
        throw new Error(message);
      }

      setUpdatedData((prevData) => prevData.filter((item) => item.id !== id));
      Swal.fire("Dihapus!", "Permintaan berhasil dihapus.", "success");
    } catch (error) {
      console.error("Gagal menghapus permintaan lapangan:", error);
      Swal.fire(
        "Terjadi kesalahan!",
        "Terjadi kesalahan saat menghapus permintaan.",
        "error"
      );
    }
  };

  const sortedData = [...updatedData].sort((a, b) => {
    const dateA = new Date(a.tanggal);
    const dateB = new Date(b.tanggal);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const filteredData = sortedData.filter((item) =>
    item.nomor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / rowsToShow));
  }, [filteredData.length, rowsToShow]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsToShow,
    currentPage * rowsToShow
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex h-screen">
      <div className="p-6 bg-white flex-1 h-screen shadow-md rounded-lg overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2 mt-4">Permintaan Lapangan</h1>

        <div className="mb-4 flex justify-between items-end">
          <div className="flex space-x-2">
            <label className="mr-2">Urutkan:</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
            <label className="mr-2">Tampilkan:</label>
            <select
              value={rowsToShow}
              onChange={(e) => {
                setCurrentPage(1);
                setRowsToShow(Number(e.target.value));
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[5, 10, 20, 30].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Cari nomor..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-4 py-2 text-sm"
            />
            {userRole !== "USER_PURCHASE" && (
              <button
                onClick={() => router.push("/permintaan-lapangan/add")}
                className="bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600"
              >
                + Permintaan
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">No.</th>
                <th className="border px-4 py-2">Nomor</th>
                <th className="border px-4 py-2">Tanggal</th>
                <th className="border px-4 py-2">Lokasi</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const { day, month, year } = parseDate(item.tanggal);
                  return (
                    <tr key={item.id} className="hover:bg-gray-100 text-center">
                      <td className="border px-4 py-2">
                        {(currentPage - 1) * rowsToShow + index + 1}
                      </td>
                      <td className="border px-4 py-2">{item.nomor}</td>
                      <td className="border px-4 py-2">
                        {day} {getMonthName(month)} {year}
                      </td>
                      <td className="border px-4 py-2">{item.lokasi}</td>
                      <td className="border px-4 py-2">
                        {getStatus(item.status)}
                      </td>
                      <td className="border px-4 py-2 flex justify-center gap-2">
                        <button
                          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                          onClick={() => handleDetail(item.id)}
                        >
                          <Eye className="text-white" />
                        </button>
                        <button
                          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="text-white" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border px-4 py-2 text-center text-gray-500"
                  >
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
      </div>
    </div>
  );
}

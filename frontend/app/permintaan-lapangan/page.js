/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";
import Pagination from "@/component/Pagination";
import { sortData } from "@/utils/sortUtils"; // <-- Tambahan

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

export default function PermintaanLapangan() {
  const [rowsToShow, setRowsToShow] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatedData, setUpdatedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "tanggal",
    direction: "desc",
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      setTimeout(() => router.push("/login"), 800);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error("User JSON parse error:", error);
      router.push("/login");
    }
  }, [router]);

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
    if (!token) return;

    const fetchPermintaanLapangan = async () => {
      try {
        const data = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/permintaan`,
          token,
          setToken,
          () => router.push("/login")
        );
        if (Array.isArray(data)) {
          setUpdatedData(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data permintaan lapangan:", error);
      }
    };
    fetchPermintaanLapangan();
  }, [token, router]);

  const handleDetail = async (id) => {
    if (user?.role === "USER_PURCHASE" || user?.role === "ADMIN") {
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
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire(
          "Gagal!",
          errorData.message || "Gagal menghapus permintaan.",
          "error"
        );
        return;
      }
      setUpdatedData((prevData) => prevData.filter((item) => item.id !== id));
      Swal.fire("Dihapus!", "Permintaan berhasil dihapus.", "success");
    } catch (error) {
      console.error("Gagal menghapus permintaan lapangan:", error);
      Swal.fire("Terjadi kesalahan!", "Gagal menghapus permintaan.", "error");
    }
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const sortedData = sortData(updatedData, sortConfig);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="p-6 bg-white flex-1 h-screen shadow-md rounded-lg overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2 mt-4">Permintaan Lapangan</h1>

        <div className="mb-4 flex justify-between items-end">
          <div className="flex space-x-2">
            <label className="mr-2">Urutkan:</label>
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
            {user?.role !== "USER_PURCHASE" && (
              <button
                onClick={() => router.push("/permintaan-lapangan/add")}
                className="bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600"
              >
                + Permintaan
              </button>
            )}
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
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">No.</th>
                <th
                  className="border px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("nomor")}
                >
                  Nomor {getSortIcon("nomor")}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("tanggal")}
                >
                  Tanggal {getSortIcon("tanggal")}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("lokasi")}
                >
                  Lokasi {getSortIcon("lokasi")}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIcon("status")}
                </th>
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
                      <td
                        className={`border px-4 py-2 ${
                          item.status.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-800 font-semibold"
                            : ""
                        }`}
                      >
                        {getStatus(item.status)}
                      </td>
                      <td className="border px-4 py-2 flex justify-center gap-2">
                        <button
                          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                          onClick={() => handleDetail(item.id)}
                        >
                          <Eye className="text-white" />
                        </button>
                        {user?.role !== "USER_PURCHASE" && (
                          <button
                            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="text-white" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border px-4 py-2 text-center text-gray-500"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

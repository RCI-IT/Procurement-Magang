"use client";

import { Eye, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { fetchWithAuth } from "@/services/apiClient";
import { useState } from "react";
import Pagination from "@/component/Pagination";
import { sortData } from "@/utils/sortUtils";
import Swal from "sweetalert2";

export default function Proyek() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsToShow, setRowsToShow] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "tanggal",
    direction: "desc",
  });

  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/projects`,
    fetchWithAuth
  );
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Gagal mengambil data.</p>;
  const projects = Array.isArray(data) ? data : data?.data ?? [];

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };
  const sortedData = sortData(projects, sortConfig);
  const filteredData = sortedData.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / rowsToShow) || 1;

  // Pastikan currentPage tidak melebihi totalPages
  const safePage = Math.min(currentPage, totalPages);

  // Data yang dipotong sesuai rowsToShow dan halaman
  const paginatedData = filteredData.slice(
    (safePage - 1) * rowsToShow,
    safePage * rowsToShow
  );

  const handleProyek = async (id) => {
    try {
      router.push(`/proyek/${id}`);
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
      alert("Terjadi kesalahan saat memperbarui status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data yang dihapus tidak dapat dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (result.isConfirmed) {
        const deleted = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
          {
            method: "DELETE",
          }
        );
        if (deleted?.message?.includes("budget")) {
          await Swal.fire("Gagal!", deleted.message, "error");
        }
        await mutate(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal menghapus proyek: ${error.message}`,
        "error"
      );
    }
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <main className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold my-4">Proyek</h1>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push(`/proyek/add`)}
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              Tambah Proyek
            </button>
            <div>
              <label className="mr-2 font-medium">Rows per page:</label>
              <select
                value={rowsToShow}
                onChange={(e) => {
                  setRowsToShow(Number(e.target.value));
                  setCurrentPage(1); // reset ke halaman 1 kalau ubah rowsToShow
                }}
                className="border px-2 py-1 rounded"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Cari Material"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full mt-2">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border px-4 py-2">No</th>
                  <th
                    className="border px-4 py-2"
                    onClick={() => handleSort("name")}
                  >
                    Nama Proyek {getSortIcon("name")}
                  </th>
                  <th className="border px-4 py-2">Kode Proyek</th>
                  <th className="border px-4 py-2">Lokasi</th>

                  {/* 
                  Untuk Admin 
                    <th className="border px-4 py-2">Manager</th>
                    <th className="border px-4 py-2">Jumlah Tim</th> 
                  */}

                  <th className="border px-4 py-2">Status Proyek</th>
                  {/* 
                  Untuk Employee
                  <th className="border px-4 py-2">Peran Saya</th>
                   */}
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((project, index) => (
                  <tr key={project.id}>
                    <td className="border px-4 py-2 text-center">
                      {(safePage - 1) * rowsToShow + index + 1}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {project.name}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {project.code}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {project.location}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {project.status}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleProyek(project.id)}
                        className="bg-blue-500 text-white rounded px-2 py-1"
                      >
                        <Eye className="text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                      >
                        <Trash2 className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

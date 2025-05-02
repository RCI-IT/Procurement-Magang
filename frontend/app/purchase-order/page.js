/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/component/sidebar";
import Header from "@/component/Header";
import { Eye, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

const PurchaseOrderTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchase`);
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const handleDelete = async (id) => {
    // Gunakan SweetAlert untuk konfirmasi penghapusan
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus Purchase Order ini?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    });
  
    // Jika pengguna mengklik "Hapus", lanjutkan penghapusan
    if (result.isConfirmed) {
      try {
        // Menghapus PurchaseOrder dan terkait PurchaseDetails melalui backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchase/${id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("Gagal menghapus Purchase Order");
        }
  
        // Setelah berhasil menghapus, arahkan kembali ke halaman Purchase Orders
        Swal.fire('Dihapus!', 'Purchase Order berhasil dihapus.', 'success');
        router.push('/purchase-order'); // Kembali ke halaman daftar Purchase Order
      } catch (err) {
        Swal.fire('Gagal', err.message, 'error');
      }
    }
  };

  const ActionButtons = ({ onView, onDelete }) => (
    <div className="flex justify-center gap-4">
      <button onClick={onView} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
        <Eye className="text-white" />
      </button>
      <button onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
        <Trash2 className="text-white" />
      </button>
    </div>
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-4 flex-1 bg-white shadow-md rounded-md overflow-auto">
        <div>
          <Header username={username} />
        </div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Purchase Order</h1>
          <div className="flex gap-2">
          <div className="flex space-x-2">
              <label htmlFor="rowsToShow" className="text-sm">Tampilkan</label>
              <select
                id="rowsToShow"
                value={rowsToShow}
                onChange={(e) => setRowsToShow(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-sm">baris</span>
            </div>

            <input
              type="text"
              placeholder="Cari PO..."
              className="border p-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
              {filteredData.length > 0 ? (
                filteredData.map((po, index) => (
                  <tr key={po.id} className="text-center border">
                    <td className="border p-2">{index + 1}</td>
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
                  <td colSpan="6" className="text-center p-4">
                    Tidak ada data Purchase Order
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
 <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

      </div>
    </div>
  );
};

export default PurchaseOrderTable;

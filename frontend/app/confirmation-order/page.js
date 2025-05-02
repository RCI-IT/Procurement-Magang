"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Sidebar from "@/component/sidebar";
import Header from "../../component/Header";
import { Eye, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

const ConfirmationOrderTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirmation`);
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
  const { value: confirmDelete } = await Swal.fire({
    title: 'Yakin ingin menghapus data ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  });

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirmation/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Gagal menghapus data");
    }

    await Swal.fire({
      title: 'Data berhasil dihapus!',
      icon: 'success',
      confirmButtonText: 'OK',
    });

    router.push('/confirmation-order');
  } catch (err) {
    Swal.fire({
      title: 'Terjadi kesalahan!',
      text: err.message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};


  const ActionButtons = ({ onView, onDelete}) => (
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
          <h1 className="text-3xl font-bold">Confirmation Order</h1>
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
          {userRole !== "USER_LAPANGAN" && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => router.push("/confirmation-order/add")}
            >
              + Tambah
            </button>
          )}
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
                <th className="border p-2">Nomor</th>
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Lokasi</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((co, index) => (
                  <tr key={co.id} className="text-center border">
                    <td className="border p-2">{index + 1}</td>
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
                        onView={() => router.push(`/confirmation-order/${co.id}`)}
                        onDelete={() => handleDelete(co.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Tidak ada data
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

export default ConfirmationOrderTable;

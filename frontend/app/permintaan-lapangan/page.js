"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddPermintaanLapanganForm from "./add/page";  
import Sidebar from "../../component/sidebar";
import Header from "../../component/Header.js";
import { Eye, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function PermintaanLapangan({ setActiveContent }) {
  const [rowsToShow, setRowsToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFormVisible] = useState(false);
  const [updatedData, setUpdatedData] = useState([]);
  const router = useRouter();
  const [userRole, setUserRole] = useState(null); 
  const [username, setUsername] = useState("");

  const getMonthName = (monthNumber) => months[monthNumber - 1];

  const filteredData = updatedData.filter((item) =>
    item.nomor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAddForm = () => {
    router.push("/permintaan-lapangan/add");
  };

  const handleAddPermintaan = (newData) => {
    setUpdatedData((prevData) => [...prevData, newData]);
    setActiveContent("permintaan-lapangan");
  };

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

  useEffect(() => {
    const fetchPermintaanLapangan = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan`);
        const data = await response.json();
        setUpdatedData(data);
      } catch (error) {
        console.error("Gagal mengambil data permintaan lapangan:", error);
      }
    };

    fetchPermintaanLapangan();
  }, []);


  const handleDetail = async (id) => {
    if (userRole === "USER_PURCHASE") {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "READ" }),
        });
  
        if (!response.ok) throw new Error("Gagal memperbarui status ke READ");
  
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
  const handlePending = async (id) => {
    const confirmPending = window.confirm("Apakah Anda yakin ingin mengembalikan status ke Pending?");
    if (!confirmPending) return;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "PENDING" }),
      });
  
      if (!response.ok) throw new Error("Gagal mengubah status");
  
      setUpdatedData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: "PENDING" } : item
        )
      );
  
      alert("Status berhasil dikembalikan ke Pending.");
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      alert("Terjadi kesalahan saat mengubah status.");
    }
  };
  const handleApprove = async (id) => {
    const confirmApprove = window.confirm("Apakah Anda yakin ingin menyetujui permintaan ini?");
    if (!confirmApprove) return;
  
    try {
      console.log("Mengirim request ke backend dengan ID:", id);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "APPROVED" }),
      });
  
      console.log("Response status:", response.status);
      console.log("Response data:", await response.json());
  
      if (!response.ok) throw new Error("Gagal mengubah status");
  
      setUpdatedData((prevData) =>
        prevData.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item))
      );
  
      alert("Permintaan berhasil disetujui!");
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      alert("Terjadi kesalahan saat mengubah status.");
    }
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda tidak dapat mengembalikan permintaan ini!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Gagal menghapus permintaan');
  
      setUpdatedData((prevData) => prevData.filter((item) => item.id !== id));
      Swal.fire('Dihapus!', 'Permintaan berhasil dihapus.', 'success');
    } catch (error) {
      console.error('Gagal menghapus permintaan lapangan:', error);
      Swal.fire('Terjadi kesalahan!', 'Terjadi kesalahan saat menghapus permintaan.', 'error');
    }
  };
  
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  };
  const getStatus = (status) => {
    return status;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex h-screen">
     <Sidebar />
    <div className={`p-6 bg-white flex-1 h-screen shadow-md rounded-lg transition-all duration-300 ${isAddFormVisible ? 'min-h-screen' : 'h-auto'}`}>
    <div>
    <Header username={username} />
    </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Permintaan Lapangan</h1>  
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Cari nomor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
          {userRole !== "USER_PURCHASE" && (
  <button
    onClick={() => router.push("/permintaan-lapangan/add")}
    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
  >
    Tambah Permintaan
  </button>
)}


        </div>
      </div>

      {isAddFormVisible && (
        <AddPermintaanLapanganForm
          onAddPermintaan={handleAddPermintaan}
          toggleAddForm={toggleAddForm}
        />
      )}

      <div className="mb-4 flex items-center">
        <label htmlFor="rowsToShow" className="mr-2 font-medium">
          Tampilkan
        </label>
        <select
          id="rowsToShow"
          value={rowsToShow}
          onChange={(e) => setRowsToShow(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {[10, 20, 30].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
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
  {filteredData.length > 0 ? (
    filteredData.slice(0, rowsToShow).map((item, index) => {
      const { day, month, year } = parseDate(item.tanggal);
      return (
        <tr key={item.id} className="hover:bg-gray-100 text-center">
          <td className="border px-4 py-2">{index + 1}</td>
          <td className="border px-4 py-2">{item.nomor}</td>
          <td className="border px-4 py-2">
            {day} {getMonthName(month)} {year}
          </td>
          <td className="border px-4 py-2">{item.lokasi}</td>
          <td className="border px-4 py-2">{getStatus(item.status)}</td>
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
      <td colSpan="6" className="border px-4 py-2 text-center text-gray-500">
        Tidak ada data ditemukan.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
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
}

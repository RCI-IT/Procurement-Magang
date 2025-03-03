"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../component/sidebar";  // Mengimpor Sidebar
import AddPermintaanLapanganForm from "./AddPermintaanLapanganForm";  // Formulir untuk menambah permintaan lapangan

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function PermintaanLapangan({ setActiveContent }) {
  const [rowsToShow, setRowsToShow] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [updatedData, setUpdatedData] = useState([]);  // Menggunakan array kosong untuk data awal
  const router = useRouter();

  const getMonthName = (monthNumber) => {
    return months[monthNumber - 1];
  };

  const filteredData = Array.isArray(updatedData)
    ? updatedData.filter((item) =>
        item.nomor?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const toggleAddForm = () => {
    setIsAddFormVisible(!isAddFormVisible);
  };

  const handleAddPermintaan = (newData) => {
    setUpdatedData((prevData) => [...prevData, newData]);
    setActiveContent("permintaan-lapangan");
  };

  // Mengambil data dari API menggunakan useEffect
  useEffect(() => {
    const fetchPermintaanLapangan = async () => {
      try {
        const response = await fetch('http://192.168.110.204:5000/permintaan'); // URL API yang benar
        const data = await response.json();
        setUpdatedData(data);  // Menyimpan data ke state
      } catch (error) {
        console.error("Gagal mengambil data permintaan lapangan:", error);
      }
    };

    fetchPermintaanLapangan();  // Panggil fungsi untuk mengambil data
  }, []);

  // Fungsi untuk menghapus permintaan lapangan
  const handleDelete = async (id) => {
    try {
      await fetch(`http://192.168.110.204:5000/permintaan/${id}`, {
        method: "DELETE",
      });
      setUpdatedData(updatedData.filter(item => item.id !== id));  // Menghapus data dari state
    } catch (error) {
      console.error("Gagal menghapus permintaan lapangan:", error);
    }
  };

  // Parsing Tanggal untuk menampilkan dengan format yang benar
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() mulai dari 0, jadi +1
    const year = date.getFullYear();
    return { day, month, year };
  };

  return (
    <div className="flex">
      {/* Konten utama */}
      <div className="flex-1 p-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Permintaan Lapangan</h1>
            <div className="flex space-x-4 items-center">
              <input
                type="text"
                placeholder="Cari nomor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <button
                onClick={toggleAddForm}
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
              >
                Tambah Permintaan
              </button>
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
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
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
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.slice(0, rowsToShow).map((item, index) => {
                    const { day, month, year } = parseDate(item.tanggal);  // Parsing tanggal
                    return (
                      <tr key={item.nomor || `row-${index}`} className="hover:bg-gray-100">
                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                        <td className="border px-4 py-2">{item.nomor}</td>
                        <td className="border px-4 py-2">
                          {day} {getMonthName(month)} {year}
                        </td>
                        <td className="border px-4 py-2">{item.lokasi}</td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                            onClick={() => router.push(`/permintaan-lapangan/${item.id}`)}  // Mengarahkan ke halaman detail
                          >
                            Lihat
                          </button>
                          <button
                            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 ml-2"
                            onClick={() => handleDelete(item.id)}  // Menghapus permintaan lapangan
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="border px-4 py-2 text-center text-gray-500">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

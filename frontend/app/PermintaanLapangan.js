"use client"; 

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import AddPermintaanLapanganForm from "./AddPermintaanLapanganForm";

export default function PermintaanLapangan({ data, setActiveContent }) {
  const [rowsToShow, setRowsToShow] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFormVisible, setIsAddFormVisible] = useState(false); // State untuk menampilkan form
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null until the component is mounted to avoid SSR issues
  if (!isMounted) return null;

  // Filter data based on the search query
  const filteredData = Array.isArray(data) ? data.filter((item) =>
    item.nomor?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []; 

  // Toggle tampilan form tambah permintaan
  const toggleAddForm = () => {
    setIsAddFormVisible(!isAddFormVisible); // Menyembunyikan atau menampilkan form
  };

  return (
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
            onClick={toggleAddForm} // Fungsi untuk toggle form
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Tambah Permintaan
          </button>
        </div>
      </div>

      {isAddFormVisible && ( // Menampilkan form tambah jika state isAddFormVisible true
        <AddPermintaanLapanganForm 
          onAddPermintaan={(newData) => { 
            // Fungsi untuk menangani data baru
            setActiveContent("permintaan-lapangan"); // Kembali ke halaman permintaan lapangan
          }} 
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
              filteredData.slice(0, rowsToShow).map((item, index) => (
                <tr key={item.nomor || `row-${index}`} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{item.nomor}</td>
                  <td className="border px-4 py-2">{item.tanggal}</td>
                  <td className="border px-4 py-2">{item.lokasi}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                      onClick={() => router.push(`/detail-permintaan/${item.id}`)}
                    >
                      Lihat
                    </button>
                  </td>
                </tr>
              ))
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
  );
}

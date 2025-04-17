/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../component/sidebar.js";
import Header from "../../component/Header.js";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PurchaseOrder() {
  const [username, setUsername] = useState("");
  const [orderData, setOrderData] = useState(null); // State untuk menyimpan data yang disalin
  const router = useRouter();

  // Mengambil username dari localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Mengambil data order dari localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem("selectedOrder");
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder)); // Menyimpan data yang disalin ke state
    }
  }, []);

  const handleView = () => {
    // Aksi untuk melihat detail
    alert("Tombol Lihat diklik");
  };

  const handleDelete = () => {
    // Aksi untuk menghapus data
    const confirmDelete = confirm("Yakin ingin menghapus data ini?");
    if (confirmDelete) {
      alert("Data telah dihapus");
    }
  };

  if (!orderData) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <Header username={username} />
          <h1 className="text-xl font-semibold text-gray-800">Purchase Order</h1>
          <p className="mt-4 text-gray-600">Data tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header username={username} />
        <h1 className="text-xl font-semibold text-gray-800">Purchase Order</h1>

        {/* Tabel untuk menampilkan data order */}
        <div className="mt-4">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2">No.</th>
                <th className="border p-2">Nomor CO</th>
                <th className="border p-2">Tanggal CO</th>
                <th className="border p-2">Lokasi CO</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center border">
                <td className="border p-2">1</td>
                <td className="border p-2">{orderData.nomorCO}</td>
                <td className="border p-2">
                  {new Date(orderData.tanggalCO).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="border p-2">{orderData.lokasiCO}</td>
                <td className="border p-2">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleView}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center"
                    >
                      <Eye className="text-white" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-xl w-12 h-12 flex items-center justify-center"
                    >
                      <Trash2 className="text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

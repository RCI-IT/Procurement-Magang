// app/permintaan-lapangan/[id]/page.js

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../component/sidebar"; // Mengimpor Sidebar dengan jalur relatif

export default function DetailPermintaanLapangan() {
  const { id } = useParams();  // Mengambil ID dari URL
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    // Mengambil data dari localStorage berdasarkan ID
    const permintaanData = JSON.parse(localStorage.getItem('permintaanData')) || [];
    const foundData = permintaanData.find(item => item.id === id);  // Mencari data berdasarkan ID
    
    if (foundData) {
      setData(foundData);  // Menyimpan data yang ditemukan
    } else {
      // Jika data tidak ditemukan, arahkan kembali ke halaman utama
      router.push("/permintaan-lapangan");
    }
  }, [id, router]);

  // Jika data belum tersedia
  if (!data) return <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <Sidebar />
      </div>

      {/* Konten utama */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Detail Permintaan Lapangan</h1>
            <div className="space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Cetak</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Simpan PDF</button>
            </div>
          </div>

          <div className="text-center font-semibold text-lg text-gray-700 border-b-2 border-blue-600 pb-2">
            {data.company ? data.company.toUpperCase() : "Perusahaan Tidak Ditemukan"}
          </div>
          <div className="grid grid-cols-2 gap-4 border-b py-3 text-sm">
            <div><strong>Tanggal:</strong> {data.tanggal.day} {data.tanggal.month} {data.tanggal.year}</div>
            <div><strong>Nomor:</strong> {data.nomor}</div>
          </div>

          <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border p-2">No.</th>
                <th className="border p-2">Nama Barang / Jasa</th>
                <th className="border p-2">Spesifikasi</th>
                <th className="border p-2">QTY</th>
                <th className="border p-2">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="text-center border-b">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.nama}</td>
                  <td className="border p-2">{item.spesifikasi}</td>
                  <td className="border p-2">{item.qty}</td>
                  <td className="border p-2">{item.satuan}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-6">
            <button
              onClick={() => router.push("/permintaan-lapangan")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

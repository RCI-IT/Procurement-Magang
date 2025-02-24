"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailPermintaan() {
  const params = useParams();
  const id = params?.id; // Ambil ID dari URL
  const router = useRouter();
  const [data, setData] = useState(null);

  // Debugging untuk melihat apakah id ada atau tidak
  useEffect(() => {
    console.log("Params:", params);
  }, [params]);

  // Data dummy sementara
  const permintaanData = [
    {
      id: "1",
      company: "PT. Reka Cipta Inovasi",
      tanggal: "13 Februari 2025",
      nomor: "PO/RCI-SBA/23/VII/10",
      items: [
        { nama: "Pull Handle Onassis PH/ONS 633x500 SS", spesifikasi: "Dimensi: 63cm x 50cm x 63cm", qty: 1, satuan: "Pcs" },
        { nama: "Mata Bor Besi Nachi", spesifikasi: "-", qty: 1, satuan: "Pcs" },
      ],
    },
    {
      id: "2",
      company: "PT. Cipta Mandiri",
      tanggal: "15 Februari 2025",
      nomor: "PO/CM-SBA/24/VII/15",
      items: [
        { nama: "Baut Baja Stainless", spesifikasi: "Anti-karat, 12mm", qty: 10, satuan: "Set" },
        { nama: "Cat Tembok Dulux", spesifikasi: "Warna putih, 5L", qty: 2, satuan: "Kaleng" },
      ],
    },
  ];

  useEffect(() => {
    if (!id) return;
    const foundData = permintaanData.find((item) => item.id === id);
    setData(foundData || null);
  }, [id]);

  if (!data) return <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Header & Tombol */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Permintaan Lapangan</h1>
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Cetak</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Simpan PDF</button>
          </div>
        </div>

        {/* Nama Perusahaan */}
        <div className="text-center font-semibold text-lg text-gray-700 border-b-2 border-blue-600 pb-2">
          {data.company.toUpperCase()}
        </div>

        {/* Detail Informasi */}
        <div className="grid grid-cols-2 gap-4 border-b py-3 text-sm">
          <div><strong>Tanggal:</strong> {data.tanggal}</div>
          <div><strong>Nomor:</strong> {data.nomor}</div>
        </div>

        {/* Tabel Barang */}
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

        {/* Tombol Kembali */}
        <div className="text-right mt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

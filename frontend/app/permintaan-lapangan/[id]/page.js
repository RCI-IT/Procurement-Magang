"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../component/sidebar";  // Mengimpor Sidebar

export default function DetailPermintaanLapangan() {
  const { id } = useParams();  // Mengambil ID dari URL
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    // Mengambil data dari API atau localStorage berdasarkan ID permintaan
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.110.204:5000/permintaan/${id}`); // Mengambil data permintaan berdasarkan ID dari API
        const result = await response.json();
        
        if (result) {
          setData(result);  // Menyimpan data yang ditemukan
        } else {
          // Jika data tidak ditemukan, arahkan kembali ke halaman utama
          router.push("/?page=permintaan-lapangan");
        }
      } catch (error) {
        console.error("Gagal mengambil data permintaan lapangan:", error);
        router.push("/?page=permintaan-lapangan");  // Redirect jika terjadi error
      }
    };

    fetchData(); // Memanggil fungsi fetchData
  }, [id, router]);

  // Jika data belum tersedia, tampilkan pesan "Data tidak ditemukan"
  if (!data) return <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>;

  // Parsing tanggal string "2025-02-26" menjadi objek Date
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() mulai dari 0, jadi +1
    const year = date.getFullYear();
    return { day, month, year };
  };

  // Mendapatkan tanggal yang telah diparsing
  const { day, month, year } = parseDate(data.tanggal);

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
            {data.picLapangan ? data.picLapangan.toUpperCase() : "PIC Tidak Ditemukan"}
          </div>
          <div className="grid grid-cols-2 gap-4 border-b py-3 text-sm">
            <div><strong>Tanggal:</strong> {day} {month} {year}</div>
            <div><strong>Nomor:</strong> {data.nomor}</div>
            <div><strong>Lokasi:</strong> {data.lokasi}</div>
            <div><strong>Status:</strong> {data.status}</div>
          </div>

          <div className="my-4">
            <strong>Keterangan:</strong>
            <p>{data.keterangan}</p>
          </div>

          {/* Menampilkan Detail Permintaan berdasarkan permintaanId */}
          <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border p-2">No.</th>
                <th className="border p-2">Material</th>
                <th className="border p-2">Spesifikasi</th>
                <th className="border p-2">QTY</th>
                <th className="border p-2">Satuan</th>
                <th className="border p-2">Code</th>
              </tr>
            </thead>
            <tbody>
              {data.detail && data.detail.length > 0 ? (
                data.detail.map((item, index) => (
                  <tr key={index} className="text-center border-b">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.materialId}</td>
                    <td className="border p-2">{item.mention}</td>
                    <td className="border p-2">{item.qty}</td>
                    <td className="border p-2">{item.satuan}</td>
                    <td className="border p-2">{item.code}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="border px-4 py-2 text-center text-gray-500">
                    Tidak ada detail permintaan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="text-right mt-6">
            <button
              onClick={() => router.push("/?page=permintaan-lapangan")}
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

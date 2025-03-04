"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../component/sidebar";

// Halaman Detail Permintaan Lapangan
export default function DetailPermintaanLapangan() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.110.204:5000/permintaan/${id}`);
        const result = await response.json();
        
        if (result) {
          setData(result);  
        } else {
          // Jika data tidak ditemukan, kembali ke halaman permintaan lapangan
          router.push("/?page=permintaan-lapangan");
        }
      } catch (error) {
        console.error("Gagal mengambil data permintaan lapangan:", error);
        router.push("/?page=permintaan-lapangan");
      }
    };

    fetchData(); 
  }, [id, router]);

  if (!data) return <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>;

  // Fungsi untuk parsing tanggal
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    return { day, month, year };
  };

  const { day, month, year } = parseDate(data.tanggal);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-end space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-32">Edit</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-32">Cetak</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-32">Simpan PDF</button>
        </div>
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Detail Permintaan Lapangan</h1>
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

          {/* Tabel untuk detail permintaan tanpa garis border tebal */}
          <table className="w-full border-collapse mt-4 text-sm border-none">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border-none p-2 text-center">No.</th>
                <th className="border-none p-2 text-center">Nama Barang / Jasa</th>
                <th className="border-none p-2 text-center">Spesifikasi</th>
                <th className="border-none p-2 text-center">Code</th>
                <th className="border-none p-2 text-center">Permintaan</th>
                <th className="border-none p-2 text-center">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {data.detail && data.detail.length > 0 ? (
                data.detail.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.materialId}</td>
                    <td className="p-2">{item.mention}</td>
                    <td className="p-2">{item.code}</td>
                    <td className="p-2">{item.qty} {item.satuan}</td>
                    <td className="p-2">{item.keterangan}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                    Tidak ada detail permintaan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Tabel untuk informasi tambahan dengan garis yang hilang */}
          <div className="mt-6">
  <div className="flex justify-between space-x-4">
    {/* Kolom Kiri */}
    <div className="w-1/2">
      <table className="w-full border-collapse text-sm border-none">
        <tbody>
          <tr>
            <td className="border-none p-2"><strong>Tanggal Delivery:</strong></td>
            <td className="border-none p-2">{data.tanggalDelivery || "-"}</td>
          </tr>
          <tr>
            <td className="border-none p-2"><strong>Lokasi Delivery:</strong></td>
            <td className="border-none p-2">{data.lokasiDelivery || "-"}</td>
          </tr>
          <tr>
            <td className="border-none p-2"><strong>Catatan:</strong></td>
            <td className="border-none p-2">{data.catatan || "-"}</td>
          </tr>
          <tr>
            <td className="border-none p-2"><strong>PIC Lapangan:</strong></td>
            <td className="border-none p-2">{data.picLapangan || "-"}</td>
          </tr>
          <tr>
            <td className="border-none p-2"><strong>Note:</strong></td>
            <td className="border-none p-2">{data.note || "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Kolom Kanan */}
    <div className="w-1/2">
      <table className="w-full border-collapse text-sm border-none">
        <tbody>
          {/* Baris Header */}
          <tr>
            <td className="border-none p-2 font-bold text-center">Diperkisa</td>
            <td className="border-none p-2 font-bold text-center">Diketahui</td>
            <td className="border-none p-2 font-bold text-center">Dibuat</td>
          </tr>
          {/* Baris Kosong */}
          <tr>
            <td className="border-none p-2 text-center">Nama</td>
            <td className="border-none p-2 text-center">Nama</td>
            <td className="border-none p-2 text-center">Nama</td>
          </tr>
          {/* Baris Kosong dengan Label */}
          <tr>
            <td className="border-none p-2 text-center">Project Manager</td>
            <td className="border-none p-2 text-center">Site Manager</td>
            <td className="border-none p-2 text-center">Logistik</td>
          </tr>
        </tbody>
      </table>
    </div>

            </div>
          </div>

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

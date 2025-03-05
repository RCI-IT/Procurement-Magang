"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../component/sidebar";


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

          <table className="w-full border-collapse mt-4 text-sm border border-gray-300">
          <thead className="bg-blue-700 text-white">
          <tr>
            <th className="border border-white p-2 text-center" rowSpan="2">No.</th>
            <th className="border border-white p-2 text-center" rowSpan="2">Nama Barang / Jasa</th>
            <th className="border border-white p-2 text-center" rowSpan="2">Spesifikasi</th>
            <th className="border border-white p-2 text-center" rowSpan="2">Code</th>
            <th className="border border-white p-2 text-center" colSpan="2">Permintaan</th>
            <th className="border border-white p-2 text-center" rowSpan="2">Keterangan</th>
          </tr>

          <tr>
            <th className="border border-white p-2 text-center">QTY</th>
            <th className="border border-white p-2 text-center">Satuan</th>
          </tr>
          </thead>

          <tbody>
          {data.detail && data.detail.length > 0 ? (
          data.detail.map((item, index) => (
          <tr key={index} className="text-center">
            <td className="border border-gray-300 p-2">{index + 1}</td>
            <td className="border border-gray-300 p-2">{item.materialId}</td>
            <td className="border border-gray-300 p-2">{item.mention}</td>
            <td className="border border-gray-300 p-2">{item.code}</td>
            <td className="border border-gray-300 p-2">{item.qty}</td>
            <td className="border border-gray-300 p-2">{item.satuan}</td>
            <td className="border border-gray-300 p-2">{item.keterangan}</td>
          </tr>
          ))
          ) : (
          <tr>
            <td colSpan="7" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
              Tidak ada detail permintaan ditemukan.
            </td>
          </tr>
          )}
{/* Baris untuk informasi tambahan */}
<tr>
  {/* Kolom Informasi Tambahan */}
  <td className="border border-gray-300 p-2 text-left" colSpan="2">
    <table className="w-full">
      <tbody>
        <tr>
          <td className="p-1 font-semibold w-1/3">Tanggal Delivery</td>
          <td className="p-1 w-1">:</td>
          <td className="p-1">{data.tanggalDelivery || "-"}</td>
          {/* Tabel untuk detail permintaan tanpa garis border tebal */}
          <table className="w-full border-collapse mt-4 text-sm border-none">
  <thead className="bg-blue-600 text-white">
    <tr>
      <th className="border-none p-2 text-center">No.</th>
      <th className="border-none p-2 text-center">Nama Barang / Jasa</th>
      <th className="border-none p-2 text-center">Spesifikasi</th>
      <th className="border-none p-2 text-center">Code</th>
      <th className="border-none p-2 text-center" colSpan="2">Permintaan</th>
      <th className="border-none p-2 text-center">Keterangan</th>
    </tr>
    <tr>
      <th className="border-none p-2 text-center">x</th>
      <th className="border-none p-2 text-center">x</th>
      <th className="border-none p-2 text-center">x</th>
      <th className="border-none p-2 text-center">x</th>
      <th className="border-none p-2 text-center">Qty</th>
      <th className="border-none p-2 text-center">Satuan</th>
      <th className="border-none p-2 text-center">x</th>
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
          <td className="p-2">{item.qty}</td>
          <td className="p-2">{item.satuan}</td>
          <td className="p-2">{item.keterangan}</td>
        </tr>
        <tr>
          <td className="p-1 font-semibold">Lokasi Delivery</td>
          <td className="p-1">:</td>
          <td className="p-1">{data.lokasiDelivery || "-"}</td>
        </tr>
        <tr>
          <td className="p-1 font-semibold">Catatan</td>
          <td className="p-1">:</td>
          <td className="p-1">{data.catatan || "-"}</td>
        </tr>
        <tr>
          <td className="p-1 font-semibold">PIC Lapangan</td>
          <td className="p-1">:</td>
          <td className="p-1">{data.picLapangan || "-"}</td>
        </tr>
        <tr>
          <td className="p-1 font-semibold">Note</td>
          <td className="p-1">:</td>
          <td className="p-1">{data.note || "-"}</td>
        </tr>
      </tbody>
    </table>
  </td>
  <tr>
  {/* Kolom Tanda Tangan */}
  <td className="border border-gray-300 p-2 text-left" colSpan="5">
    <table className="w-full text-center">
      <thead>
        <tr>
          <th className="p-2 border-r border-black">Diperiksa</th>
          <th className="p-2 border-r border-black">Diketahui</th>
          <th className="p-2">Dibuat</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-8 border-b border-black border-r border-black"></td>
          <td className="py-8 border-b border-black border-r border-black"></td>
          <td className="py-8 border-b border-black"></td>
        </tr>
        <tr>
          <td className="p-2 border-r border-black">Nama</td>
          <td className="p-2 border-r border-black">Nama</td>
          <td className="p-2">Nama</td>
        </tr>
        <tr className="bg-gray-200">
          <td className="p-2 border-r border-black">Project Manager</td>
          <td className="p-2 border-r border-black">Site Manager</td>
          <td className="p-2">Logistik</td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>

</tr>





</tbody>
</table>



          <div className="mt-6">
          <div className="flex justify-between space-x-4">
          <div className="w-1/2">
    </div>

    <div className="w-1/2 mx-auto">
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

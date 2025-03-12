"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../../component/sidebar";

export default function PurchaseOrderDetail() {
  const { id } = useParams();
  const [poDetail, setPoDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// Fungsi untuk mengonversi angka menjadi teks bahasa Indonesia
const terbilang = (angka) => {
  const satuan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];
  const belasan = ["Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas", "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas"];
  const puluhan = ["", "", "Dua Puluh", "Tiga Puluh", "Empat Puluh", "Lima Puluh", "Enam Puluh", "Tujuh Puluh", "Delapan Puluh", "Sembilan Puluh"];
  const ribuan = ["", "Ribu", "Juta", "Miliar", "Triliun"];

  if (angka === 0) return "Nol Rupiah";

  const konversi = (num) => {
    if (num < 10) return satuan[num];
    if (num < 20) return belasan[num - 10];
    if (num < 100) return puluhan[Math.floor(num / 10)] + " " + satuan[num % 10];
    if (num < 1000) return satuan[Math.floor(num / 100)] + " Ratus " + konversi(num % 100);
    return "";
  };

  let hasil = "";
  let i = 0;

  while (angka > 0) {
    let bagian = angka % 1000;
    if (bagian > 0) {
      hasil = konversi(bagian) + " " + ribuan[i] + " " + hasil;
    }
    angka = Math.floor(angka / 1000);
    i++;
  }

  return hasil.trim() + " Rupiah";
};

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.110.204:5000/purchase/${id}`);
        if (!response.ok) throw new Error("Gagal mengambil data dari server");

        const data = await response.json();
        setPoDetail(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const totalHarga =
  poDetail?.permintaan?.detail?.reduce((sum, item) => sum + (item.material.price * item.qty), 0) || 0;

  return (
    <div className="flex h-screen">
      <div> <Sidebar /></div>
      <div className="w-full max-w-6xl mx-auto px-8">
        <br></br>     <br></br>
      {/* Header dengan Tombol Aksi */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-600">COMPANY NAME</h2>
        <h2 className="text-xl font-bold text-gray-800">PURCHASE ORDER</h2>
        <div className="space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Cetak</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Simpan PDF</button>
        </div>
      </div>

      {/* Informasi PO & PL */}
      <div className="flex justify-end mt-4">
        <table className="border text-sm">
          <tbody>
            <tr className="border">
              <td className="border px-4 py-2 font-semibold">Nomor</td>
              <td className="border px-4 py-2">{poDetail?.nomorPO || "N/A"}</td>
            </tr>
            <tr className="border">
              <td className="border px-4 py-2 font-semibold">Tanggal</td>
              <td className="border px-4 py-2">{poDetail?.tanggalPO? new Date(poDetail.tanggalPO).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",}) : "N/A"}
              </td>
            </tr>
            <tr className="border">
              <td className="border px-4 py-2 font-semibold">Nomor PL</td>
              <td className="border px-4 py-2">{poDetail?.permintaan?.nomor || "N/A"}</td>
            </tr>
            <tr className="border">
              <td className="border px-4 py-2 font-semibold">Tanggal PL</td>
              <td className="border px-4 py-2">{poDetail?.permintaan?.tanggal? new Date(poDetail.permintaan.tanggal).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",}) : "N/A"}
              </td>

            </tr>
            <tr className="border">
              <td className="border px-4 py-2 font-semibold">Proyek</td>
              <td className="border px-4 py-2">{poDetail?.keterangan || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-b-4 border-blue-600 mt-4"></div>
<div className=" p-4 bg-white mt-4">
  <h3 className="text-gray-600 text-sm">Vendor :</h3>
  
  <div className="flex justify-between items-center">
  <p className="text-lg font-bold text-gray-900 flex-1">{poDetail?.permintaan?.detail?.[0]?.material?.vendor?.name || "Nama Vendor"}</p>

    <div className="flex items-center space-x-6 text-gray-600 text-sm">
    <div className="flex flex-col items-end text-gray-600 text-sm">
    <div className="flex items-center space-x-1">
    <span className="text-green-500">📞</span>
    <span>{poDetail?.permintaan?.detail?.[0]?.material?.vendor?.phone || "-"}</span>
  </div>
  <div className="flex items-center space-x-1 mt-1">
    <span className="text-red-500">📍</span>
    <span>{poDetail?.permintaan?.detail?.[0]?.material?.vendor?.address|| "Alamat tidak tersedia"}</span>
  </div>
</div>

    </div>
  </div>
</div>
<div className="border-b-4 border-blue-600 mt-2"></div>
<table className="w-full border mt-4 text-center rounded-md">
  <thead className="bg-blue-600 text-white">
    <tr>
      <th className="border p-2" rowSpan={2}>No.</th>
      <th className="border p-2" rowSpan={2}>Kode</th>
      <th className="border p-2" rowSpan={2}>Nama Barang</th>
      <th className="border p-2" rowSpan={2}>Harga</th>
      <th className="border p-2 w-12 " colSpan="2">Permintaan</th>
      <th className="border p-2 w-35" rowSpan={2}>Total</th>
    </tr>
    <tr className="bg-blue-600 text-white">
      <th className="border p-2 w-12">QTY</th>
      <th className="border p-2 w-12">Satuan</th>
    </tr>
  </thead>
  <tbody>
    {poDetail?.permintaan?.detail?.length > 0 ? (
      poDetail.permintaan.detail.map((item, index) => (
        <tr key={index} className="border">
        <td className="border p-2">{index + 1}</td>
        <td className="border p-2">{item.code || "N/A"}</td>
        <td className="border p-2 text-center">{item.material.name || "N/A"}</td>
        <td className="border p-2">Rp{item.material.price?.toLocaleString() || "0"}</td>
        <td className="border p-2">{item.qty || "0"}</td>
        <td className="border p-2">{item.satuan || "N/A"}</td>
        <td className="border p-2 font-bold text-right">
          Rp{((item.material.price || 0) * (item.qty || 0)).toLocaleString()}
        </td>
      </tr>
      ))
    ) : (
      <tr>
        <td colSpan={7} className="text-center p-4 text-gray-500">Tidak ada item</td>
      </tr>
    )}
    
    {/* Baris Terbilang */}
    <tr className="font-semibold">
      <td colSpan="4" className="bg-blue-600 text-white p-2 text-left">Terbilang</td>
      <td colSpan="2" rowSpan={2} className="p-2 text-center border">TOTAL</td>
      <td colSpan="1" rowSpan={2} className="p-2 text-right border">Rp{totalHarga.toLocaleString()}</td>
    </tr>
<tr>
<td colSpan="4" className="border p-2 text-gray-800 bg-white italic text-left">
        {terbilang(totalHarga) || "-"}
      </td>
</tr>
    {/* Baris Total */}
    <tr className="bg-white font-bold">
      

    </tr>
  </tbody>
</table>


<table className="w-full border mt-6">
  <tbody>

    {/* Baris Keterangan & Header Tanda Tangan */}
    <tr className="text-center ">
      <td rowSpan={4} className="border p-4 text-left align-top">Keterangan :</td>
      <td className="bg-gray-300 font-semibold border p-2">Diperiksa</td>
      <td className="bg-gray-300 font-semibold border p-2 ">Diketahui</td>
      <td className="bg-gray-300 font-semibold border p-2">Dibuat</td>
    </tr>

    {/* Baris Ruang Kosong untuk Tanda Tangan */}
    <tr>
      <td className="border h-16"></td>
      <td className="border h-16"></td>
      <td className="border h-16"></td>
    </tr>

    {/* Baris Nama */}
    <tr className="text-center">
      <td className="border p-2 font-semibold">Nama</td>
      <td className="border p-2 font-semibold">Nama</td>
      <td className="border p-2 font-semibold">Nama</td>
    </tr>

    {/* Baris Jabatan */}
    <tr className="text-center bg-gray-300">
      <td className="border p-2">Project Manager</td>
      <td className="border p-2">Site Manager</td>
      <td className="border p-2">Logistik</td>
    </tr>

  </tbody>
</table>
<br></br>

    </div>
    </div>
  );
}

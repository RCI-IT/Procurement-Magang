"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const PurchaseOrderDetail = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const [poDetail, setPoDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = searchParams.get("id") || params.id;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const dataPO = [
      { 
        id: "1", nomor: "ESPO-190225", tanggal: "13 Februari 2025", lokasi: "SERINDIT MERAH",
        vendor: "PT. Maju Selalu", noPL: "PO/RCI-SBA/23/v1/10", tanggalPL: "PO/RCI-SBA/23/v1/10",
        proyek: "SERINDIT MERAH", kontak: "+6281370383621", alamat: "Jl. Sutomo Ujung 35 B, Kec. Medan Timur, Kota Medan, Sumatera Utara",
        items: [{ kode: "Handle - 011", nama: "Pull Handle Onassis PH/ONS 633x500 SS", harga: 300000, qty: 1, satuan: "Pcs" }]
      },
    ];
    
    const foundPO = dataPO.find(po => po.id === id);
    setPoDetail(foundPO);
    setLoading(false);
  }, [id]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!poDetail) return <p className="text-center mt-4 text-red-500">Data tidak ditemukan!</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-center w-full">PURCHASE ORDER</h2>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Cetak</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Simpan PDF</button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border p-4">
        <p><strong>Nomor:</strong> {poDetail.nomor}</p>
        <p><strong>Tanggal:</strong> {poDetail.tanggal}</p>
        <p><strong>Nomor PL:</strong> {poDetail.noPL}</p>
        <p><strong>Tanggal PL:</strong> {poDetail.tanggalPL}</p>
        <p><strong>Proyek:</strong> {poDetail.proyek}</p>
      </div>

      <div className="mt-4 border p-4 bg-blue-100">
        <h3 className="font-bold text-lg">Vendor:</h3>
        <p className="font-bold text-xl">{poDetail.vendor}</p>
        <p>📞 {poDetail.kontak}</p>
        <p>📍 {poDetail.alamat}</p>
      </div>

      <table className="w-full border mt-4 text-center">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border p-2">No.</th>
            <th className="border p-2">Kode</th>
            <th className="border p-2">Nama Barang</th>
            <th className="border p-2">Harga</th>
            <th className="border p-2">QTY</th>
            <th className="border p-2">Satuan</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {poDetail.items.map((item, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{item.kode}</td>
              <td className="border p-2">{item.nama}</td>
              <td className="border p-2">Rp{item.harga.toLocaleString()}</td>
              <td className="border p-2">{item.qty}</td>
              <td className="border p-2">{item.satuan}</td>
              <td className="border p-2 font-bold">Rp{(item.harga * item.qty).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 p-4 border bg-gray-100">
        <p className="font-bold bg-blue-600 text-white p-2">Terbilang</p>
        <p className="p-2">Tiga ratus ribu rupiah</p>
        <p className="text-right font-bold text-lg">TOTAL: Rp{poDetail.items.reduce((sum, item) => sum + item.harga * item.qty, 0).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-3 text-center mt-4 border">
        <div className="p-4">
          <p>Diperiksa</p>
          <p className="mt-8 font-bold">Nama</p>
          <p>Project Manager</p>
        </div>
        <div className="p-4">
          <p>Diketahui</p>
          <p className="mt-8 font-bold">Nama</p>
          <p>Site Manager</p>
        </div>
        <div className="p-4">
          <p>Dibuat</p>
          <p className="mt-8 font-bold">Nama</p>
          <p>Logistik</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetail;

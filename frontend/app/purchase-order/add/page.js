"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";

export default function AddPurchaseOrder() {
  const [formData, setFormData] = useState({
    tanggal: "",
    nomor: "",
    proyek: "",
    vendor: "",
    noPL: "",
    tanggalPL: "",
    kodeBarang: "",
    namaBarang: "",
    harga: "",
    qty: "",
    satuan: "",
  });

  const [total, setTotal] = useState(0);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "harga" || name === "qty") {
      const harga = name === "harga" ? parseFloat(value) || 0 : parseFloat(formData.harga) || 0;
      const qty = name === "qty" ? parseInt(value) || 0 : parseInt(formData.qty) || 0;
      setTotal(harga * qty);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://192.168.110.204:5000/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      router.push("/purchase-order");
    } catch (error) {
      console.error("Gagal menambah PO:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Purchase Order</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <label className="block font-medium">Tanggal PO:</label>
              <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">No. PL:</label>
              <input type="text" name="noPL" value={formData.noPL} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Nomor PO:</label>
              <input type="text" name="nomor" value={formData.nomor} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Proyek:</label>
              <input type="text" name="proyek" value={formData.proyek} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <label className="block font-medium">Kode Barang:</label>
              <input type="text" name="kodeBarang" value={formData.kodeBarang} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div className="flex space-x-2">
            </div>
          </div>

          {/* Tombol Selesai dan Kembali */}
          <div className="flex flex-col gap-2 mt-4">
          <button
    type="button"
    onClick={() => window.history.back()}
    className="bg-gray-500 text-white px-4 py-2 rounded text-base w-40"
  >
    Kembali
  </button>

  <button
    type="submit"
    className="bg-blue-500 text-white px-4 py-2 rounded text-base w-40"
  >
    Selesai
  </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD

const AddPurchaseOrder = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tanggal: "",
    nomor: "",
    noPL: "",
    tanggalPL: "",
    proyek: "",
    vendor: "",
    kode: "",
=======
export default function AddPurchaseOrder() {
  const [formData, setFormData] = useState({
    tanggal: "",
    nomor: "",
    proyek: "",
    vendor: "",
    noPL: "",
    tanggalPL: "",
    kodeBarang: "",
>>>>>>> acfd8c4f465f439c6e911929b376f9f9c234f25e
    namaBarang: "",
    harga: "",
    qty: "",
    satuan: "",
  });

<<<<<<< HEAD
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data PO Ditambahkan:", formData);
    router.push("/?page=purchase-order");
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md w-full max-w-2xl mx-auto">
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => router.push("/?page=purchase-order")}>
        &#8592; Kembali
      </button>
      <h2 className="text-xl font-bold mb-4">Purchase Order</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label>Tanggal:</label>
            <input type="date" name="tanggal" className="border p-2 w-full rounded" onChange={handleInputChange} required />
          </div>
          <div>
            <label>No. PL:</label>
            <input type="text" name="noPL" className="border p-2 w-full rounded" onChange={handleInputChange} />
          </div>
          <div>
            <label>Tanggal PL:</label>
            <input type="date" name="tanggalPL" className="border p-2 w-full rounded" onChange={handleInputChange} />
          </div>
        </div>
        <div>
          <label>Nomor:</label>
          <input type="text" name="nomor" className="border p-2 w-full rounded" onChange={handleInputChange} required />
        </div>
        <div>
          <label>Proyek:</label>
          <input type="text" name="proyek" className="border p-2 w-full rounded" onChange={handleInputChange} />
        </div>
        <div>
          <label>Vendor:</label>
          <input type="text" name="vendor" className="border p-2 w-full rounded" onChange={handleInputChange} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label>Kode:</label>
            <input type="text" name="kode" className="border p-2 w-full rounded" onChange={handleInputChange} />
          </div>
          <div>
            <label>Nama Barang:</label>
            <input type="text" name="namaBarang" className="border p-2 w-full rounded" onChange={handleInputChange} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label>Harga:</label>
            <input type="number" name="harga" className="border p-2 w-full rounded" onChange={handleInputChange} />
          </div>
          <div>
            <label>Qty:</label>
            <input type="number" name="qty" className="border p-2 w-full rounded" onChange={handleInputChange} />
          </div>
          <div>
            <label>Satuan:</label>
            <input type="text" name="satuan" className="border p-2 w-full rounded" onChange={handleInputChange} />
          </div>
        </div>
        <div className="font-bold text-lg">Total: Rp0</div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded w-full">Selesai</button>
      </form>
    </div>
  );
};

export default AddPurchaseOrder;
=======
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Hitung total harga otomatis
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
      {/* Sidebar */}
      <Sidebar />

      {/* Konten Utama */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Purchase Order</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
          {/* Informasi Umum */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <label className="block font-medium">Tanggal:</label>
              <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">No. PL:</label>
              <input type="text" name="noPL" value={formData.noPL} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Nomor:</label>
              <input type="text" name="nomor" value={formData.nomor} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Tanggal PL:</label>
              <input type="date" name="tanggalPL" value={formData.tanggalPL} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Proyek:</label>
              <input type="text" name="proyek" value={formData.proyek} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Vendor:</label>
              <input type="text" name="vendor" value={formData.vendor} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
          </div>

          {/* Detail Barang */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <label className="block font-medium">Kode Barang:</label>
              <input type="text" name="kodeBarang" value={formData.kodeBarang} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Harga:</label>
              <input type="number" name="harga" value={formData.harga} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Nama Barang:</label>
              <input type="text" name="namaBarang" value={formData.namaBarang} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block font-medium">Qty:</label>
                <input type="number" name="qty" value={formData.qty} onChange={handleChange} className="border px-4 py-2 w-full" required />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Satuan:</label>
                <input type="text" name="satuan" value={formData.satuan} onChange={handleChange} className="border px-4 py-2 w-full" required />
              </div>
            </div>
          </div>

          {/* Total Harga */}
          <div className="text-lg font-semibold mt-4">
            Total: <span className="text-blue-600">Rp{total.toLocaleString("id-ID")}</span>
          </div>

          {/* Tombol Submit */}
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md w-full hover:bg-blue-600">
            Selesai
          </button>
        </form>
      </div>
    </div>
  );
}
>>>>>>> acfd8c4f465f439c6e911929b376f9f9c234f25e

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    namaBarang: "",
    harga: "",
    qty: "",
    satuan: "",
  });

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
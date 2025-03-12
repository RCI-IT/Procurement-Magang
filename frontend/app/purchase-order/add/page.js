"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";

export default function AddPurchaseOrder() {
  const [formData, setFormData] = useState({
    tanggalPO: "",
    nomorPO: "",
    proyek: "",
    noPL: "",
  });

  const [items, setItems] = useState([{ kodeBarang: "" }]);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { kodeBarang: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://192.168.110.204:5000/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, items }),
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
              <input type="date" name="tanggalPO" value={formData.tanggalPO} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">No. PL:</label>
              <input type="text" name="noPL" value={formData.noPL} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Nomor PO:</label>
              <input type="text" name="nomorPO" value={formData.nomorPO} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Proyek:</label>
              <input type="text" name="proyek" value={formData.proyek} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
          </div>

          {/* Daftar Barang */}
          <div className="border-b pb-4">
            <label className="block font-medium">Barang:</label>
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 mt-4">
                <div className="flex-1">
                  <label className="block font-medium">Kode Barang {index + 1}:</label>
                  <input
                    type="text"
                    name="kodeBarang"
                    value={item.kodeBarang}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border px-4 py-2 w-full"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 border border-red-500 px-3 py-2 rounded hover:bg-red-500 hover:text-white transition"
                >
                  Hapus Detail
                </button>
              </div>
            ))}

            {/* Tombol Tambah Barang */}
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-green-500 text-white px-4 py-2 rounded text-base mt-2"
            >
              Tambah Barang
            </button>
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

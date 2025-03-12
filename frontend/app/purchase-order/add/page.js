"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";

export default function AddPurchaseOrder() {
  const [formData, setFormData] = useState({
    tanggal: { day: "", month: "", year: "" },
    nomorPO: "",
    proyek: "",
    noPL: "",
  });

  const [items, setItems] = useState([{ kodeBarang: "" }]);
  const [permintaanLapangan, setPermintaanLapangan] = useState([]);
  const router = useRouter();

  // Fetch data Permintaan Lapangan saat komponen dimuat
  useEffect(() => {
    const fetchPermintaanLapangan = async () => {
      try {
        const response = await fetch("http://192.168.110.204:5000/permintaan-lapangan");
        const data = await response.json();
        console.log("Data Permintaan Lapangan:", data); // Debugging
        setPermintaanLapangan(data);
      } catch (error) {
        console.error("Gagal mengambil data Permintaan Lapangan:", error);
      }
    };
  
    fetchPermintaanLapangan();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    console.log(`Field diubah: ${name}, Nilai: ${value}`); 
  
    setFormData((prevState) => {
      if (name.startsWith("tanggal.")) {
        const field = name.split(".")[1];
        return {
          ...prevState,
          tanggal: { ...prevState.tanggal, [field]: value },
        };
      }
      return { ...prevState, [name]: value };
    });
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
    
    console.log("Data yang dikirim:", { ...formData, items }); // Debugging
  
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
              <label className="block font-medium mb-2">Tanggal:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="tanggal.day"
                  placeholder="day"
                  value={formData.tanggal.day}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-16"
                />
                <span>/</span>
                <select
                  name="tanggal.month"
                  value={formData.tanggal.month}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-auto min-w-[80px]"
                >
                  <option value="">month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                    </option>
                  ))}
                </select>
                <span>/</span>
                <select
                  name="tanggal.year"
                  value={formData.tanggal.year}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-24"
                >
                  <option value="">year</option>
                  {Array.from({ length: new Date().getFullYear() - 2018 }, (_, i) => (
                    <option key={2019 + i} value={2019 + i}>
                      {2019 + i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dropdown untuk memilih No. PL */}
            <select
  name="noPL"
  value={formData.noPL}
  onChange={handleChange}
  className="border px-4 py-2 w-full"
  required
>
  <option value="">Pilih Nomor PL</option>
  {permintaanLapangan.length > 0 ? (
    permintaanLapangan.map((pl) => (
      <option key={pl.id} value={pl.nomor}>
        {pl.nomor}
      </option>
    ))
  ) : (
    <option disabled>Data PL tidak ditemukan</option>
  )}
</select>


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

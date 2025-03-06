"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddPermintaanLapanganForm({ onAddPermintaan, toggleAddForm }) {
  const router = useRouter();
  const [materials, setMaterials] = useState([]); // Data material dari database
  const [formData, setFormData] = useState({
    nomor: "",
    tanggal: { day: "", month: "", year: "" },
    lokasi: "",
    picLapangan: "",
    keterangan: "",
    detail: [
      { id: Date.now(), materialId: "", qty: "", satuan: "", mention: "", code: "" }, // 1 detail default
    ],
  });

  useEffect(() => {
    fetch("http://192.168.110.204:5000/materials")
      .then((res) => res.json())
      .then((data) => setMaterials(data))
      .catch((error) => console.error("Gagal mengambil data material:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("tanggal")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        tanggal: { ...prev.tanggal, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDetailChange = (field, value) => {
    const updatedDetails = [...formData.detail];
    updatedDetails[0][field] = value;
    setFormData((prev) => ({ ...prev, detail: updatedDetails }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.nomor || !formData.tanggal.day || !formData.tanggal.month || !formData.tanggal.year || !formData.lokasi || !formData.picLapangan) {
      alert("Harap lengkapi semua kolom!");
      return;
    }
  
    const finalData = {
      ...formData,
      tanggal: `${formData.tanggal.year}-${formData.tanggal.month}-${formData.tanggal.day}`,
      detail: formData.detail.map((d) => ({
        materialId: Number(d.materialId),
        qty: Number(d.qty),
        satuan: d.satuan,
        mention: d.mention,
        code: d.code,
      })),
    };
  
    try {
      const response = await fetch("http://192.168.110.204:5000/permintaan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
  
      let result;
      try {
        result = await response.json();
      } catch (err) {
        console.error("Gagal parsing response JSON", err);
        throw new Error("Server tidak mengembalikan response yang valid.");
      }
  
      if (!response.ok) {
        console.error("Server Response Error:", result);
        throw new Error(result.message || "Gagal menambahkan permintaan lapangan");
      }
  
      alert("Permintaan berhasil ditambahkan!");
      
      // Reset state formData setelah submit
      setFormData({
        nomor: "",
        tanggal: { day: "", month: "", year: "" },
        lokasi: "",
        picLapangan: "",
        keterangan: "",
        detail: [{ id: Date.now(), materialId: "", qty: "", satuan: "", mention: "", code: "" }],
      });
  
      //onAddPermintaan();
      toggleAddForm();
      router.push("/?page=permintaan-lapangan");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan data. Cek log untuk detail.");
    }
  };
  
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Tambah Permintaan Lapangan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Tanggal:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="tanggal.day"
                placeholder="Tanggal"
                value={formData.tanggal.day}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-1/3"
              />
              <select
                name="tanggal.month"
                value={formData.tanggal.month}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-1/3"
              >
                <option value="">Bulan</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                  </option>
                ))}
              </select>
              <select
  name="tanggal.year"
  value={formData.tanggal.year}
  onChange={handleChange}
  className="border border-gray-300 rounded px-2 py-1 w-full"
>
  <option value="">Tahun</option>
  {Array.from({ length: new Date().getFullYear() - 2018 }, (_, i) => (
    <option key={2019 + i} value={2019 + i}>
      {2019 + i}
    </option>
  ))}
</select>

            </div>
          </div>
          <div>
            <label className="block font-medium">PIC Lapangan:</label>
            <input
              type="text"
              name="picLapangan"
              value={formData.picLapangan}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Nomor:</label>
            <input
              type="text"
              name="nomor"
              value={formData.nomor}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Lokasi:</label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Keterangan:</label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full h-24"
          />
        </div>

        <h2 className="text-xl font-bold mt-6">Detail Permintaan</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Nama Barang:</label>
            <select
              value={formData.detail[0].materialId}
              onChange={(e) => handleDetailChange("materialId", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full h-8"
            >
              <option value="">Pilih Material</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Spesifikasi:</label>
            <input
              type="text"
              value={formData.detail[0].mention}
              onChange={(e) => handleDetailChange("mention", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Code:</label>
            <input
              type="text"
              value={formData.detail[0].code}
              onChange={(e) => handleDetailChange("code", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full h-8 "
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Qty"
              value={formData.detail[0].qty}
              onChange={(e) => handleDetailChange("qty", e.target.value)}
              className="border border-gray-300  rounded px-2 py-1 w-full "
            />
            <input
              type="text"
              placeholder="Satuan"
              value={formData.detail[0].satuan}
              onChange={(e) => handleDetailChange("satuan", e.target.value)}
              className="border border-gray-300  rounded px-2 py-1 w-full" />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button type="button" className="text-red-500">Batal</button>
          <button type="submit" className="bg-blue-500 text-white rounded px-6 py-2">Selesai</button>
        </div>
      </form>
    </div>
  );
}

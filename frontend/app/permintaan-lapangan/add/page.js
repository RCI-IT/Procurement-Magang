"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar.js";
import Header from "../../../component/Header.js";
import Swal from 'sweetalert2';

export default function AddPermintaanLapanganForm({  }) {
  const router = useRouter();
  const [materials, setMaterials] = useState([]);
  const [username, setUsername] = useState(""); 
  const [formData, setFormData] = useState({
    nomor: "",
    tanggal: { day: "", month: "", year: "" },
    lokasi: "",
    picLapangan: "",
    keterangan: "",
    detail: [
      { id: Date.now(), materialId: "", qty: "", satuan: "", mention: "", code: "", keterangan: "" }, 
    ],
  });

      useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
      }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`)
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

  const handleDetailChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedDetails = [...prev.detail];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: value,
      };
      return { ...prev, detail: updatedDetails };
    });
  };

  const addDetail = () => {
    setFormData((prev) => ({
      ...prev,
      detail: [
        ...prev.detail,
        { id: Date.now(), materialId: "", qty: "", satuan: "", mention: "", code: "", keterangan: "" },
      ],
    }));
  };

  const removeDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      detail: prev.detail.filter((_, i) => i !== index),
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.nomor || !formData.tanggal.day || !formData.tanggal.month || !formData.tanggal.year || !formData.lokasi || !formData.picLapangan) {
      Swal.fire({
        icon: 'warning',
        title: 'Harap lengkapi semua kolom!',
        confirmButtonText: 'Ok',
      });
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
        keterangan: d.keterangan, 
      })),
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambahkan permintaan lapangan");
      }
  
      Swal.fire({
        icon: 'success',
        title: 'Permintaan berhasil ditambahkan!',
        confirmButtonText: 'Ok',
      });
  
      setFormData({
        nomor: "",
        tanggal: { day: "", month: "", year: "" },
        lokasi: "",
        picLapangan: "",
        keterangan: "",
        detail: [{ id: Date.now(), materialId: "", qty: "", satuan: "", mention: "", code: "", keterangan: "" }],
      });
  
      router.back();
  
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi kesalahan!',
        text: 'Cek log untuk detail.',
        confirmButtonText: 'Ok',
      });
    }
  };
  
  return (
<div className="flex px-10 py-6 w-full">
  <Sidebar />
  <div className="w-full max-w-10xl p-8 bg-white-100 rounded-lg shadow-md overflow-x-auto">
  <Header username={username} /><br></br>
      <h1 className="text-3xl font-bold mb-6">Tambah Permintaan Lapangan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
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

          <div className="grid grid-cols-2 gap-4">
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

        {formData.detail.map((item, index) => (
          <div key={item.id} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block font-medium">Nama Barang / Jasa:</label>
              <select
                value={item.materialId}
                onChange={(e) => handleDetailChange(index, "materialId", e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              >
                <option value="">Pilih Material</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <br />

              <div className="flex flex-col">
                <label className="block font-medium">Spesifikasi:</label>
                <input
                  type="text"
                  value={item.mention}
                  onChange={(e) => handleDetailChange(index, "mention", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
                <br />
                <div className="flex flex-col">
                  <label className="block font-medium">Code:</label>
                  <input
                    type="text"
                    value={item.code}
                    onChange={(e) => handleDetailChange(index, "code", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block font-medium">Keterangan Detail:</label>
              <textarea
                value={item.keterangan}
                onChange={(e) => handleDetailChange(index, "keterangan", e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="block font-medium">Qty:</label>
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) => handleDetailChange(index, "qty", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="block font-medium">Satuan:</label>
                <input
                  type="text"
                  placeholder="Satuan"
                  value={item.satuan}
                  onChange={(e) => handleDetailChange(index, "satuan", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </div>
            </div>
            <div>
          <button
            type="button"
            onClick={addDetail}
            className="mt-6 bg-gray-500 text-white rounded px-4 py-2 rounded"
          >
            Tambah Detail
          </button>
        </div>
            {formData.detail.length > 1 && (
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => removeDetail(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Hapus Detail
                </button>
              </div>
              
            )}
          </div>
    
        ))}
        <div className="flex justify-between mt-4">
        <button type="button"
  onClick={() => router.back()} 
  className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
>
  Batal
</button>

          <button type="submit" className="mt-6 bg-green-500 text-white rounded px-4 py-2 rounded">
            Selesai
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

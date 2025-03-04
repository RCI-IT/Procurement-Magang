import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPermintaanLapanganForm({ onAddPermintaan, toggleAddForm }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    tanggal: { day: "", month: "", year: "" },
    nomor: "",
    picLapangan: "",
    lokasi: "",
    namaBarang: "",
    spesifikasi: "",
    code: "",
    qty: "",
    satuan: "",
    keterangan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["day", "month", "year"].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        tanggal: { ...prevData.tanggal, [name]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!formData.nomor || !formData.tanggal.day || !formData.tanggal.month || !formData.tanggal.year) {
      alert("Harap lengkapi semua kolom!");
      return;
    }
  
    const newPermintaan = {
      id: Date.now(),  // Generate ID unik untuk setiap permintaan
      nomor: formData.nomor,
      tanggal: {
        day: formData.tanggal.day,
        month: formData.tanggal.month,
        year: formData.tanggal.year
      },
      lokasi: formData.lokasi,
      namaBarang: formData.namaBarang,
      spesifikasi: formData.spesifikasi,
      code: formData.code,
      qty: formData.qty,
      satuan: formData.satuan,
      keterangan: formData.keterangan,
      items: []  // Data items bisa disesuaikan
    };
  
    const existingData = JSON.parse(localStorage.getItem('permintaanData')) || [];
    existingData.push(newPermintaan);
    localStorage.setItem('permintaanData', JSON.stringify(existingData));
    router.push(`/permintaan-lapangan/${newPermintaan.id}`); // Redirect ke halaman detail setelah submit
  

    onAddPermintaan(newPermintaan);

    toggleAddForm();

    router.push("/?page=permintaan-lapangan");
  };

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = ["2025", "2024", "2023", "2022", "2021", "2020", "2019"];

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Tambah Permintaan Lapangan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Tanggal:</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="day"
                placeholder="Tanggal"
                value={formData.tanggal.day}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-1/3"
              />
              <select
                name="month"
                value={formData.tanggal.month}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-1/3"
              >
                <option value="">Bulan</option>
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="year"
                value={formData.tanggal.year}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-1/3"
              >
                <option value="">Tahun</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
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

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium">Nama Barang:</label>
            <input
              type="text"
              name="namaBarang"
              value={formData.namaBarang}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            <label className="block font-medium mt-2">Spesifikasi:</label>
            <input
              type="text"
              name="spesifikasi"
              value={formData.spesifikasi}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
            <label className="block font-medium mt-2">Code:</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            />
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
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex space-x-2">
            <div>
              <label className="block font-medium">Qty:</label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium">Satuan:</label>
              <input
                type="text"
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-6 py-2"
          >
            Selesai
          </button>
        </div>
      </form>
      <button
        onClick={toggleAddForm}
        className="mt-4 text-red-500 hover:text-red-700"
      >
        Batal
      </button>
    </div>
  );
}

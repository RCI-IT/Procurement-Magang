import React, { useState } from "react";

export default function AddPermintaanLapanganForm({ setActiveContent }) {
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
    console.log("Data Tersimpan:", formData);
    setActiveContent("permintaan-lapangan");
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Tambah Permintaan Lapangan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Baris 1: Tanggal & PIC Lapangan */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Tanggal:</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="day"
                placeholder="day"
                value={formData.tanggal.day}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-1/4"
              />
              <input
                type="number"
                name="month"
                placeholder="month"
                value={formData.tanggal.month}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-1/4"
              />
              <input
                type="number"
                name="year"
                placeholder="year"
                value={formData.tanggal.year}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 w-1/3"
              />
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

        {/* Baris 2: Nomor & Lokasi */}
        <div className="grid grid-cols-2 gap-4">
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

        {/* Baris 3: Nama Barang/Jasa & Keterangan */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Nama Barang / Jasa:</label>
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

        {/* Baris 4: Qty & Satuan */}
        <div className="grid grid-cols-2 gap-4">
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

        {/* Tombol Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-6 py-2"
          >
            Selesai
          </button>
        </div>
      </form>
    </div>
  );
}

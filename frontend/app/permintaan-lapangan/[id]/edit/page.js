"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPermintaanLapangan() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomor: "",
    tanggal: "",
    lokasi: "",
    picLapangan: "",
    status: "",
    isConfirmed: false,
    isReceived: false,
    keterangan: "",
    detail: [],
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.110.204:5000/permintaan/${id}`);
        const result = await response.json();
        if (result) {
          setFormData(result);
        } else {
          router.push("/?page=permintaan-lapangan");
        }
      } catch (error) {
        console.error("Gagal mengambil data permintaan lapangan:", error);
      }
    };

    fetchData();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDetailChange = (index, field, value) => {
    const newDetail = [...formData.detail];
    if (field === "qty") {
      newDetail[index][field] = parseInt(value) || 0; 
    } else {
      newDetail[index][field] = value;
    }
    setFormData({ ...formData, detail: newDetail });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://192.168.110.204:5000/permintaan/${id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data berhasil diperbarui!");
        router.push("/?page=permintaan-lapangan");
      } else {
        alert("Gagal memperbarui data.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  if (!formData.nomor) return <p className="text-red-500 text-center mt-10">Memuat data...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-lg font-bold text-blue-900 mb-4">Edit Permintaan Lapangan</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Nomor</label>
          <input
            type="text"
            name="nomor"
            value={formData.nomor}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold">Tanggal</label>
          <input
            type="date"
            name="tanggal"
            value={formData.tanggal?.split("T")[0] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold">Keterangan</label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <h2 className="text-md font-semibold mt-4 mb-2">Detail Permintaan</h2>
        <table className="w-full border-collapse text-sm border border-gray-300">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="border border-white p-2 text-center">Nama Barang / Jasa</th>
              <th className="border border-white p-2 text-center">Spesifikasi</th>
              <th className="border border-white p-2 text-center">QTY</th>
              <th className="border border-white p-2 text-center">Satuan</th>
            </tr>
          </thead>
          <tbody>
            {formData.detail.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={item.materialId || ""}
                    onChange={(e) => handleDetailChange(index, "materialId", e.target.value)}
                    className="w-full border border-gray-300 p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={item.mention || ""}
                    onChange={(e) => handleDetailChange(index, "mention", e.target.value)}
                    className="w-full border border-gray-300 p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={item.qty || ""}
                    onChange={(e) => handleDetailChange(index, "qty", parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={item.satuan || ""}
                    onChange={(e) => handleDetailChange(index, "satuan", e.target.value)}
                    className="w-full border border-gray-300 p-1 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Kembali
          </button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}

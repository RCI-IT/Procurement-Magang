"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../.../../../../component/sidebar";
import Swal from "sweetalert2";

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
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}`);
        const result = await response.json();
        if (result) {
          setFormData(result);
          await fetchMaterialNames(); 
        } else {
          router.push("/?page=permintaan-lapangan");
        }
      } catch (error) {
        console.error("Gagal mengambil data permintaan lapangan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const fetchMaterialNames = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`);
      const data = await response.json();
      const materialMap = data.reduce((acc, material) => {
        acc[material.id] = material.name;
        return acc;
      }, {});
      setMaterials(materialMap);
    } catch (error) {
      console.error("Gagal mengambil nama material:", error);
    }
  };

  //const handleChange = (e) => {
    //const { name, value } = e.target;
   //setFormData({
      //...formData,
      //[name]: value,
    //});
  //};

  const handleDetailChange = (index, field, value) => {
    const newDetail = [...formData.detail];
    newDetail[index][field] = field === "qty" ? parseInt(value) || 0 : value;
    setFormData({ ...formData, detail: newDetail });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nomor: formData.nomor,
      tanggal: formData.tanggal,
      lokasi: formData.lokasi,
      picLapangan: formData.picLapangan,
      status: formData.status,
      isConfirmed: formData.isConfirmed,
      isReceived: formData.isReceived,
      keterangan: formData.keterangan,
      detail: formData.detail.map((item) => ({
        id: item.id, 
        materialId: item.materialId,
        qty: item.qty,
        satuan: item.satuan,
        mention: item.mention,
        code: item.code,
        keterangan: item.keterangan,
        status: item.status,
      })),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log("Respon server:", responseText);

      if (response.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil diperbarui.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#2563eb",
        }).then(() => {
          router.back();
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal memperbarui data.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  if (loading) return <p className="text-red-500 text-center mt-10">Memuat data...</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-lg font-bold text-blue-900 mb-4">Edit Permintaan Lapangan</h1>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
  <label className="block text-sm font-semibold">Nomor</label>
  <div className="w-full border p-2 rounded bg-gray-100">{formData.nomor}</div>
</div>

<div className="mb-4">
  <label className="block text-sm font-semibold">Tanggal</label>
  <div className="w-full border p-2 rounded bg-gray-100">
    {formData.tanggal ? formData.tanggal.split("T")[0] : ""}
  </div>
</div>

<div className="mb-4">
  <label className="block text-sm font-semibold">Lokasi</label>
  <div className="w-full border p-2 rounded bg-gray-100">{formData.lokasi}</div>
</div>

          <h2 className="text-md font-semibold mt-4 mb-2">Detail Permintaan</h2>
          <table className="w-full border-collapse text-sm border border-gray-300">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="border border-white p-2 text-center">Nama Material</th>
                <th className="border border-white p-2 text-center">Spesifikasi</th>
                <th className="border border-white p-2 text-center">QTY</th>
                <th className="border border-white p-2 text-center">Satuan</th>
                <th className="border border-white p-2 text-center">Code</th> 
                <th className="border border-white p-2 text-center">Keterangan</th> 
              </tr>
            </thead>
            <tbody>
    {formData.detail.map((item, index) => (
      <tr key={index} className="text-center">
        <td className="border border-gray-300 p-2">{materials[item.materialId] || "Memuat..."}</td>
        <td className="border border-gray-300 p-2">
          <input
            type="text"
            value={item.mention || ""}
            onChange={(e) => handleDetailChange(index, "mention", e.target.value)}
            className="w-full border p-1 rounded"
          />
        </td>
        <td className="border border-gray-300 p-2">
          <input
            type="number"
            value={item.qty}
            onChange={(e) => handleDetailChange(index, "qty", e.target.value)}
            className="w-full border p-1 rounded"
          />
        </td>
        <td className="border border-gray-300 p-2">
          <input
            type="text"
            value={item.satuan}
            onChange={(e) => handleDetailChange(index, "satuan", e.target.value)}
            className="w-full border p-1 rounded"
          />
        </td>
        <td className="border border-gray-300 p-2">
          <input
            type="text"
            value={item.code || ""}
            onChange={(e) => handleDetailChange(index, "code", e.target.value)}
            className="w-full border p-1 rounded"
          />
        </td>
        <td className="border border-gray-300 p-2">
          <input
            type="text"
            value={item.keterangan || ""}
            onChange={(e) => handleDetailChange(index, "keterangan", e.target.value)}
            className="w-full border p-1 rounded"
          />
        </td>
      </tr>
    ))}
  </tbody>
          </table>

          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => router.back()} className="bg-gray-500 text-white px-4 py-2 rounded">
              Kembali
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

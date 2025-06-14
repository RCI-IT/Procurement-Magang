"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchWithAuth } from "@/services/apiClient";
// import Select from "react-select";

export default function AddPermintaanLapanganForm({}) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nomor: "",
    tanggal: { day: "", month: "", year: "" },
    lokasi: "",
    picLapangan: "",
    keterangan: "",
    detail: [
      {
        id: Date.now(),
        materialName: "",
        qty: "",
        satuan: "",
        mention: "",
        code: "",
        keterangan: "",
      },
    ],
  });

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

  // Fungsi helper untuk cari code berdasarkan materialId
  // const getCodeByMaterialId = (id) => {
  //   const m = materials.find((mat) => mat.id.toString() === id.toString());
  //   return m ? m.code : "";
  // };

  // Modifikasi handleDetailChange untuk otomatis isi code material jika materialId berubah
  const handleDetailChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedDetails = [...prev.detail];
      let newDetail = { ...updatedDetails[index], [field]: value };

      // if (field === "materialName") {
      //   const newCode = getCodeByMaterialId(value);
      //   // Jika code kosong atau sama dengan kode sebelumnya, update otomatis
      //   if ( !newDetail.code ||
      //     newDetail.code === updatedDetails[index].code ||
      //     newDetail.code === ""
      //   ) {
      //     newDetail.code = newCode;
      //   }
      // }

      updatedDetails[index] = newDetail;
      return { ...prev, detail: updatedDetails };
    });
  };

  const addDetail = () => {
    setFormData((prev) => ({
      ...prev,
      detail: [
        ...prev.detail,
        {
          id: Date.now(),
          materialName: "",
          qty: "",
          satuan: "",
          mention: "",
          code: "",
          keterangan: "",
        },
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

    if (
      !formData.nomor ||
      !formData.tanggal.day ||
      !formData.tanggal.month ||
      !formData.tanggal.year ||
      !formData.lokasi ||
      !formData.picLapangan
    ) {
      Swal.fire({
        icon: "warning",
        title: "Harap lengkapi semua kolom!",
        confirmButtonText: "Ok",
      });
      return;
    }

    const finalData = {
      ...formData,
      tanggal: `${formData.tanggal.year}-${formData.tanggal.month}-${formData.tanggal.day}`,
      detail: formData.detail.map((d) => ({
        materialName: d.materialName,
        qty: Number(d.qty),
        satuan: d.satuan,
        mention: d.mention,
        code: d.code,
        keterangan: d.keterangan,
      })),
    };

    console.log(finalData);
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/permintaan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      if (!response) {
        throw new Error("Gagal menambahkan permintaan lapangan");
      }

      Swal.fire({
        icon: "success",
        title: "Permintaan berhasil ditambahkan!",
        confirmButtonText: "Ok",
      });

      setFormData({
        nomor: "",
        tanggal: { day: "", month: "", year: "" },
        lokasi: "",
        picLapangan: "",
        keterangan: "",
        detail: [
          {
            id: Date.now(),
            materialName: "",
            qty: "",
            satuan: "",
            mention: "",
            code: "",
            keterangan: "",
          },
        ],
      });

      router.back();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan!",
        text: "Cek log untuk detail.",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className="flex px-10 py-6 w-full">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Tambah Permintaan Lapangan</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Tanggal</label>
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
                      {new Date(0, i).toLocaleString("id-ID", {
                        month: "long",
                      })}
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
                  {Array.from(
                    { length: new Date().getFullYear() - 2018 },
                    (_, i) => (
                      <option key={2019 + i} value={2019 + i}>
                        {2019 + i}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Nomor</label>
              <input
                type="text"
                name="nomor"
                value={formData.nomor}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">PIC Lapangan</label>
              <input
                type="text"
                name="picLapangan"
                value={formData.picLapangan}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Lokasi</label>
              <textarea
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>

          </div>
          <div className="border rounded p-4">
            <h2 className="text-xl font-semibold">
              Detail Permintaan Lapangan
            </h2>
            {formData.detail.map((item, index) => (
              <div key={item.id} className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block font-medium">
                    Nama Barang / Jasa:
                  </label>

                  <input
                    type="text"
                    value={item.materialName}
                    onChange={(e) =>
                      handleDetailChange(index, "materialName", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                  {/* <Select
                  options={materials.map((material) => ({
                    value: material.id,
                    label: material.name,
                  }))}
                  value={
                    item.materialId
                      ? {
                          value: item.materialId,
                          label: materials.find(
                            (m) => m.id === parseInt(item.materialId)
                          )?.name,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleDetailChange(
                      index,
                      "materialId",
                      selected?.value || ""
                    )
                  }
                  placeholder="Pilih Material"
                  isClearable
                  className="text-sm"
                /> */}

                  <br />

                  <div className="flex flex-col">
                    <label className="block font-medium">Spesifikasi:</label>
                    <input
                      type="text"
                      value={item.mention}
                      onChange={(e) =>
                        handleDetailChange(index, "mention", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    <br />
                    <div className="flex flex-col">
                      <label className="block font-medium">Code:</label>
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) =>
                          handleDetailChange(index, "code", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block font-medium">
                    Keterangan Detail:
                  </label>
                  <textarea
                    value={item.keterangan}
                    onChange={(e) =>
                      handleDetailChange(index, "keterangan", e.target.value)
                    }
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
                      onChange={(e) =>
                        handleDetailChange(index, "qty", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="block font-medium">Satuan:</label>
                    <input
                      type="text"
                      placeholder="Satuan"
                      value={item.satuan}
                      onChange={(e) =>
                        handleDetailChange(index, "satuan", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </div>
                </div>

                <div className="col-span-2 mt-2">
                  <button
                    type="button"
                    onClick={() => removeDetail(index)}
                    className="w-32 h-10 bg-red-500 text-white rounded px-4 py-1 hover:bg-red-700"
                  >
                    Hapus Detail
                  </button>
                </div>
              </div>
            ))}

            <div className="py-4">
              <button
                type="button"
                onClick={addDetail}
                className="w-32 h-10 bg-blue-600 text-white rounded py-2 hover:bg-blue-800"
              >
                Tambah Detail
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-green-600 text-white rounded px-6 py-2 hover:bg-green-800"
            >
              Simpan Permintaan Lapangan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

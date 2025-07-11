"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchWithAuth } from "@/services/apiClient";
import { checkDuplicate } from "@/utils/duplicate-check";
// import Select from "react-select";

export default function AddPermintaanLapanganForm({}) {
  const router = useRouter();
  const [detailErrors, setDetailErrors] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    nomor: "",
    tanggal: today,
    lokasi: "",
    picLapangan: "",
    keterangan: "",
    detail: [
      {
        id: Date.now(),
        materialName: "",
        qty: "",
        satuan: "pcs",
        mention: "",
        code: "",
        keterangan: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Modifikasi handleDetailChange untuk otomatis isi code material jika materialId berubah
  const handleDetailChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedDetails = [...prev.detail];

      let newDetail = { ...updatedDetails[index], [field]: value };

      // Future logic seperti otomatis isi kode material bisa ditambahkan kembali di sini
      // if (field === "materialName") {
      //   const newCode = getCodeByMaterialId(value);
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
          satuan: "pcs",
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
      !formData.tanggal ||
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

    const errors = formData.detail.map((item) => {
      return {
        materialName: !item.materialName.trim(),
        qty: !item.qty,
        satuan: !item.satuan.trim(),
        code: !item.code.trim(),
      };
    });

    const hasErrors = errors.some(
      (err) => err.materialName || err.qty || err.satuan || err.code
    );

    setDetailErrors(errors); // untuk tampilkan error di UI

    if (hasErrors) {
      Swal.fire({
        icon: "warning",
        title: "Detail tidak lengkap",
        text: "Isi semua kolom Nama, Qty, Satuan, dan Kode pada detail.",
      });
      return;
    }

    const finalData = {
      ...formData,
      tanggal: formData.tanggal,
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
    const nomor = formData.nomor;
    console.log(nomor);
    const duplicate = await checkDuplicate("permintaan", { nomor });

    console.log(duplicate.nomor);
    if (duplicate.nomor) {
      Swal.fire({
        icon: "warning",
        title: "Duplikat Data",
        text: "Kode Permintaan Lapangan tersebut sudah terdaftar.",
      });
      return;
    }

    const seenCodes = new Set();
    const duplicateCode = formData.detail.find((item) => {
      const trimmedCode = item.code.trim();
      if (seenCodes.has(trimmedCode)) {
        return true;
      }
      seenCodes.add(trimmedCode);
      return false;
    });

    if (duplicateCode) {
      Swal.fire({
        icon: "error",
        title: "Kode Duplikat",
        text: `Kode "${duplicateCode.code}" muncul lebih dari sekali. Gunakan kode unik.`,
      });
      return;
    }

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
            satuan: "pcs",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300 rounded">
            <div>
              <label className="block font-medium mb-1">Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-60"
              />
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
            {formData.detail.map((item, index) => {
              const codeOccurrences = formData.detail.filter(
                (d, i) =>
                  d.code?.trim() &&
                  d.code.trim() === item.code.trim() &&
                  i !== index
              );
              const isDuplicateCode = codeOccurrences.length > 0;
              return (
                <div key={item.id} className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="block font-medium">
                      Nama Barang / Jasa:
                    </label>

                    <input
                      type="text"
                      value={item.materialName}
                      onChange={(e) =>
                        handleDetailChange(
                          index,
                          "materialName",
                          e.target.value
                        )
                      }
                      className={`border ${
                        detailErrors[index]?.materialName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded px-2 py-1 w-full`}
                    />
                    {detailErrors[index]?.materialName && (
                      <span className="text-red-600 text-sm mt-1">
                        Nama wajib diisi
                      </span>
                    )}
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
                        className={`border ${
                          detailErrors[index]?.mention
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded px-2 py-1 w-full`}
                      />
                      {detailErrors[index]?.mention && (
                        <span className="text-red-600 text-sm mt-1">
                          Spesifikasi wajib diisi
                        </span>
                      )}
                      <br />
                      <div className="flex flex-col">
                        <label className="block font-medium">Code:</label>
                        <input
                          type="text"
                          value={item.code}
                          onChange={(e) =>
                            handleDetailChange(index, "code", e.target.value)
                          }
                          className={`border ${
                            isDuplicateCode || detailErrors[index]?.code
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded px-2 py-1 w-full`}
                        />
                        {detailErrors[index]?.code && (
                          <span className="text-red-600 text-sm mt-1">
                            Code wajib diisi
                          </span>
                        )}
                        {isDuplicateCode && (
                          <span className="text-red-600 text-sm mt-1">
                            Kode duplikat, gunakan kode berbeda
                          </span>
                        )}
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
                        className={`border ${
                          detailErrors[index]?.qty
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded px-2 py-1 w-full`}
                      />
                      {detailErrors[index]?.qty && (
                        <span className="text-red-600 text-sm mt-1">
                          Quantity wajib diisi
                        </span>
                      )}
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
              );
            })}

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

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";
import Swal from "sweetalert2";
import { checkDuplicate } from "@/utils/duplicate-check";
import Select from "react-select";

export default function EditMaterial() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [oldImageUrl, setOldImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [material, setMaterial] = useState(null);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const getData = useCallback(async () => {
    try {
      const [materialData, categoryData, vendorData] = await Promise.all([
        fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`,
          token,
          setToken,
          () => router.push("/login")
        ),
        fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          token,
          setToken,
          () => router.push("/login")
        ),
        fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/vendors`,
          token,
          setToken,
          () => router.push("/login")
        ),
      ]);

      if (materialData) setMaterial(materialData);
      if (categoryData) setCategories(categoryData);
      if (vendorData) setVendors(vendorData);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setInitialLoading(false);
    }
  }, [id, token, setToken, router]);

  useEffect(() => {
    if (token) getData();
  }, [token, getData]);

  useEffect(() => {
    if (material) {
      setCode(material.code || "");
      setName(material.name || "");
      setVendorId(material.vendorId ? String(material.vendorId) : "");
      setCategoryId(material.categoryId ? String(material.categoryId) : "");
      setPrice(material.price ? String(material.price) : "");
      setDescription(material.description || "");
      setOldImageUrl(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads/${material.imageUrl}` ||
          null
      );
    }
  }, [material]);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "File tidak valid",
        text: "Harap unggah file gambar.",
      });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Ukuran terlalu besar",
        text: "Ukuran gambar tidak boleh lebih dari 2MB.",
      });
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    let hasChange = false;
    const formData = new FormData();

    const fields = [
      { key: "code", value: code, original: material.code },
      { key: "name", value: name, original: material.name },
      { key: "vendorId", value: vendorId, original: String(material.vendorId) },
      { key: "price", value: price || "0", original: String(material.price) },
      {
        key: "categoryId",
        value: categoryId,
        original: String(material.categoryId),
      },
      {
        key: "description",
        value: description,
        original: material.description,
      },
    ];

    for (const field of fields) {
      if (field.value !== field.original) {
        formData.append(field.key, field.value);
        hasChange = true;
      }
    }

    if (image) {
      formData.append("image", image);
      hasChange = true;
    }

    if (!hasChange) {
      Swal.fire({
        icon: "warning",
        title: "Oops",
        text: "Harap ubah minimal satu data sebelum menyimpan!",
      });
      setLoading(false);
      return;
    }

    if (code !== material.code) {
      const duplicate = await checkDuplicate("materials", { code });
      if (duplicate.code) {
        Swal.fire({
          icon: "warning",
          title: "Duplikat Data",
          text: "Material dengan kode tersebut sudah terdaftar.",
        });
        setLoading(false);
        return;
      }
    }
    console.log(formData);

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengupdate material");
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Material berhasil diperbarui!",
        timer: 2000,
      }).then(() => router.back());
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Memuat data material...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="p-6 flex-1 bg-white text-black">
        <h2 className="text-3xl font-bold text-center mb-8">Edit Material</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          <div>
            <label className="block text-xl">Gambar:</label>
            <div className="flex items-center gap-4 mb-4">
              {oldImageUrl && !image && (
                <img
                  src={oldImageUrl}
                  alt="Old"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              {image && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <span className="absolute top-0 left-0 bg-black text-white text-xs px-2 py-1 rounded-br-lg">
                    Gambar Baru
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="file:border p-2 rounded-lg"
            />
          </div>

          <InputField label="Kode" value={code} setValue={setCode} required />
          <InputField
            label="Nama Material"
            value={name}
            setValue={setName}
            required
          />
          <InputField
            label="Harga"
            type="number"
            value={price}
            setValue={setPrice}
            required
          />
          <TextAreaField
            label="Deskripsi"
            value={description}
            setValue={setDescription}
            required
          />
          <Select
            options={categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            value={
              categoryId
                ? {
                    value: categoryId,
                    label: categories.find((v) => v.id === parseInt(categoryId))
                      ?.name,
                  }
                : null
            }
            onChange={(selected) => setCategoryId(selected?.value || "")}
            placeholder="Pilih Kategori"
            isClearable
            className="w-full text-sm"
            classNames={{
              control: () => "border border-gray-400 rounded min-h-[38px]",
              menu: () => "bg-white shadow-md text-sm",
              option: ({ isSelected, isFocused }) =>
                `px-2 py-1 ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : isFocused
                    ? "bg-blue-100"
                    : ""
                }`,
            }}
          />
          <div className="mb-4">
            <label className="block font-medium mb-1">Vendor:</label>
            <Select
              options={vendors.map((vendor) => ({
                value: vendor.id,
                label: vendor.name,
              }))}
              value={
                vendorId
                  ? {
                      value: vendorId,
                      label: vendors.find((v) => v.id === parseInt(vendorId))
                        ?.name,
                    }
                  : null
              }
              onChange={(selected) => setVendorId(selected?.value || "")}
              placeholder="Pilih Vendor"
              isClearable
              className="w-full text-sm"
              classNames={{
                control: () => "border border-gray-400 rounded min-h-[38px]",
                menu: () => "bg-white shadow-md text-sm",
                option: ({ isSelected, isFocused }) =>
                  `px-2 py-1 ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : isFocused
                      ? "bg-blue-100"
                      : ""
                  }`,
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full mt-4 bg-gray-600 text-white px-6 py-3 rounded-lg"
          >
            Kembali
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  setValue,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="block text-xl">{label}:</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-3 w-full rounded-lg"
        required={required}
      />
    </div>
  );
}

function TextAreaField({ label, value, setValue, required = false }) {
  return (
    <div>
      <label className="block text-xl">{label}:</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-3 w-full rounded-lg"
        required={required}
      ></textarea>
    </div>
  );
}

// function SelectField({ label, value, setValue, options, required = false }) {
//   return (
//     <div>
//       <label className="block text-xl">{label}:</label>
//       <select
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         className="border p-3 w-full rounded-lg"
//         required={required}
//       >
//         <option value="">Pilih {label}</option>
//         {options.map((opt) => (
//           <option key={opt.id} value={opt.id.toString()}>
//             {opt.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

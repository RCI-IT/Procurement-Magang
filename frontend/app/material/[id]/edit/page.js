"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchWithToken } from "../../../../services/fetchWithToken";
import { fetchWithAuth } from "../../../../services/apiClient";
import Swal from "sweetalert2";

export default function EditMaterial() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [name, setName] = useState("");
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

  const getData = async () => {
    const materialData = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`,
      token,
      setToken,
      () => router.push("/login")
    );
    const categoryData = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      token,
      setToken,
      () => router.push("/login")
    );
    const vendorData = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/vendors`,
      token,
      setToken,
      () => router.push("/login")
    );

    if (materialData) setMaterial(materialData);
    if (vendorData) setVendors(vendorData);
    if (categoryData) setCategories(categoryData);
  };

  useEffect(() => {
    if (token) {
      getData().finally(() => setInitialLoading(false));
    }
  }, [token]);

  useEffect(() => {
    if (material) {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    let hasChange = false;
    const formData = new FormData();

    // Daftar field yang akan dicek
    const fields = [
      { key: "name", value: name, original: material.name },
      { key: "vendorId", value: vendorId, original: String(material.vendorId) },
      { key: "price", value: price, original: String(material.price) },
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

    // Cek perubahan gambar
    if (image) {
      formData.append("image", image);
      hasChange = true;
    }
    
    if (!hasChange) {
      Swal.fire({
        icon: "warning",
        title: "Oops",
        text: "Harap ubah minimal satu data sebelum menyimpan!",
        background: "#fff",
        color: "#000",
        confirmButtonColor: "blue",
      });
      setLoading(false);
      return;
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
        background: "#fff",
        color: "#000",
        confirmButtonColor: "blue",
        timer: 2000,
      }).then(() => {
        router.back();
      });
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: error.message,
        background: "#fff",
        color: "#000",
        confirmButtonColor: "#f44336",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading || categories.length === 0 || vendors.length === 0) {
    return <div className="p-6">Memuat data material...</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="p-6 flex-1 bg-white text-black">
        <h2 className="text-3xl font-bold text-center mb-8">Edit Material</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          <div>
            <label className="block text-xl text-black">Gambar:</label>
            <div className="flex items-center gap-4 mb-4">
              {oldImageUrl && !image && (
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <img
                    src={oldImageUrl}
                    alt="Old Image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
              {image && (
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="New Image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <span className="absolute top-0 left-0 bg-black text-white text-xs px-2 py-1 rounded-br-lg">
                    Gambar Baru
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="file:border file:border-white-600 file:bg-white-800 file:py-2 file:px-4 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xl text-black">Nama Material:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 w-full rounded-lg text-black focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xl text-black">Harga:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-3 w-full rounded-lg text-black focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xl text-black">Deskripsi:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 w-full rounded-lg text-black focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xl text-black">Kategori:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border p-3 w-full rounded-lg text-black focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xl text-black">Vendor:</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="border p-3 w-full rounded-lg text-black focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id.toString()}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 w-full bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600"
          >
            Kembali
          </button>
        </form>
      </div>
    </div>
  );
}

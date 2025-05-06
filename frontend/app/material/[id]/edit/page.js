"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../../../component/sidebar";
import Header from "../../../../component/Header";
import Swal from "sweetalert2";

export default function EditMaterial() {
  const params = useParams();
  const id = params?.id; // gunakan id dari params
  const router = useRouter();

  const [name, setName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [materialRes, vendorRes, categoryRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
        ]);

        if (!materialRes.ok || !vendorRes.ok || !categoryRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const materialData = await materialRes.json();
        const vendorData = await vendorRes.json();
        const categoryData = await categoryRes.json();

        setName(materialData.name || "");
        setVendorId(materialData.vendorId || "");
        setPrice(materialData.price || "");
        setCategoryId(materialData.categoryId || "");
        setDescription(materialData.description || "");
        setVendors(vendorData);
        setCategories(categoryData);
      } catch (error) {
        setError(error.message);
      } finally {
        setInitialLoading(false);
      }
    };

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("vendorId", Number(vendorId));
    formData.append("price", Number(price));
    formData.append("categoryId", Number(categoryId));
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengupdate material");
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Material berhasil diperbarui!",
      });

      router.push("/?page=material");
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
    return <div className="p-6">Memuat data material...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <div className="w-full">
          <Header username={username} />
        </div>

        <h2 className="text-2xl font-bold mb-4">Edit Material</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Gambar:</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div>
            <label className="block">Nama Material:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block">Harga:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border p-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block">Deskripsi:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
              required
            ></textarea>
          </div>

          <div>
            <label className="block">Kategori:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="border p-2 w-full"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block">Vendor:</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(Number(e.target.value))}
              className="border p-2 w-full"
              required
            >
              <option value="">Pilih Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <br />
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Kembali
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../../../component/sidebar";
import Header from "../../../../component/Header";
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

        const matchedVendor = vendorData.find((v) => v.name === materialData.vendor);
        const matchedCategory = categoryData.find((c) => c.name === materialData.category);

        setName(materialData.name || "");
        setVendorId(matchedVendor ? String(matchedVendor.id) : "");
        setCategoryId(matchedCategory ? String(matchedCategory.id) : "");

        const numericPrice = typeof materialData.price === "string"
          ? materialData.price.replace(/[^\d]/g, "")
          : String(materialData.price);
        setPrice(numericPrice || "");

        setDescription(materialData.description || "");
        setOldImageUrl(materialData.imageUrl || null);

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

    const hasChange =
    name !== "" ||
    vendorId !== "" ||
    price !== "" ||
    categoryId !== "" ||
    description !== "" ||
    image !== null;
  
  if (!hasChange) {
    Swal.fire({
      icon: "warning",
      title: "Oops",
      text: "Harap ubah minimal satu data sebelum menyimpan!",
      background: '#fff',
      color: '#000',
      confirmButtonColor: 'blue',
    });
    setLoading(false);
    return;
  }
  
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
        background: '#fff',  
        color: '#000',  
        confirmButtonColor: 'blue',
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
        background: '#fff',  
        color: '#000',  
        confirmButtonColor: '#f44336',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-6">Memuat data material...</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="p-6 flex-1 bg-white text-black">
        <div className="w-full">
          <Header username={username} />
        </div>

        <h2 className="text-3xl font-bold text-center text-black mb-8">Edit Material</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          <div>
            <label className="block text-xl text-white">Gambar:</label>
            <div className="flex items-center gap-4 mb-4">
              {oldImageUrl && (
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
              className="file:border file:border-white-600 file:bg-white-800 file:black-white file:py-2 file:px-4 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xl text-white">Nama Material:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 w-full rounded-lg bg-white-800 text-black focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xl text-white">Harga:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-3 w-full rounded-lg bg-white-800 text-black focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xl text-white">Deskripsi:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 w-full rounded-lg bg-white-800 text-black focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xl text-white">Kategori:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border p-3 w-full rounded-lg bg-white-800 text-black focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-xl text-white">Vendor:</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="border p-3 w-full rounded-lg bg-white-800 text-black focus:ring-2 focus:ring-blue-500"
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
          <br />
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

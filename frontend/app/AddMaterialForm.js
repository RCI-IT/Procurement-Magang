'use client';

import React, { useState, useEffect } from "react";

export default function AddMaterialForm({ addMaterial }) {
  const [name, setName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Fetch vendors & categories saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorRes, categoryRes] = await Promise.all([
          fetch("http://192.168.110.204:5000/vendors"),
          fetch("http://192.168.110.204:5000/categories"),  
        ]);

        if (!vendorRes.ok || !categoryRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const vendorData = await vendorRes.json();
        const categoryData = await categoryRes.json();

        setVendors(vendorData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Gagal memuat vendor atau kategori: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  // Menangani pengiriman form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(""); // Reset error message

    // Validasi form
    if (!name || !vendorId || !price || !categoryId) {
      setError("Semua field harus diisi!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("vendorId", parseInt(vendorId, 10));
    formData.append("price", parseFloat(price));
    formData.append("categoryId", parseInt(categoryId, 10));
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://192.168.110.204:5000/materials", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menambahkan material");
      }

      addMaterial(result);

      // Reset form setelah sukses
      setName("");
      setVendorId("");
      setPrice("");
      setCategoryId("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error adding material:", error);
      setError(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <label htmlFor="image" className="block font-medium">Gambar:</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
          className="border border-gray-400 rounded px-2 py-1 w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block font-medium">Nama Material:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block font-medium">Deskripsi:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="block font-medium">Harga:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block font-medium">Kategori:</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full"
        >
          <option value="">Pilih Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="vendor" className="block font-medium">Vendor:</label>
        <select
          id="vendor"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full"
        >
          <option value="">Pilih Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white rounded px-4 py-2"
        disabled={loading}
      >
        {loading ? "Menambahkan..." : "Tambah Material"}
      </button>
    </form>
  );
}

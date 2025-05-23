"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";

export default function AddMaterialPage() {
  const router = useRouter();
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
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const getData = async () => {
    const categoriesData = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      token,
      setToken,
      () => router.push("/login")
    );
    const vendorsData = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/vendors`,
      token,
      setToken,
      () => router.push("/login")
    );

    if (categoriesData) setCategories(categoriesData);
    if (vendorsData) setVendors(vendorsData);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = () => {
    getData();
  };

  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [vendorRes, categoryRes] = await Promise.all([
  //         fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`),
  //         fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
  //       ]);

  //       if (!vendorRes.ok || !categoryRes.ok) {
  //         throw new Error("Gagal mengambil data dari server");
  //       }

  //       setVendors(await vendorRes.json());
  //       setCategories(await categoryRes.json());
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setError(`Gagal memuat vendor atau kategori: ${error.message}`);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !vendorId || !price || !categoryId) {
      Swal.fire({
        icon: "error",
        title: "Data Belum Lengkap",
        text: "Semua field harus diisi!",
      });
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
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/materials`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response) {
        throw new Error("Gagal menambahkan material");
      }

      setName("");
      setVendorId("");
      setPrice("");
      setCategoryId("");
      setDescription("");
      setImage(null);

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Material berhasil ditambahkan.",
        confirmButtonText: "OK",
      });

      router.back();
    } catch (error) {
      console.error("Error adding material:", error);

      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: error.message || "Gagal menambahkan material",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        <div className="w-full"></div>
        <h1 className="text-2xl font-bold mb-6">Tambah Material</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 shadow-md rounded-lg w-full max-w-none"
        >
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="mb-4">
            <label className="block font-medium">Gambar:</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Nama Material:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Deskripsi:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-400 rounded px-2 py-1 w-full"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Harga:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Kategori:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium">Vendor:</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="border border-gray-400 rounded px-2 py-1 w-full"
            >
              <option value="">Pilih Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-red-500 text-white rounded px-4 py-2 w-40"
            >
              Batal
            </button>

            <button
              type="submit"
              className="bg-green-500 text-white rounded px-4 py-2 w-40"
              disabled={loading}
            >
              {loading ? "Menambahkan..." : "Tambah Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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

  // Ambil daftar vendor dan kategori dari database saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorRes, categoryRes] = await Promise.all([
          fetch("http://localhost:5000/vendors"),
          fetch("http://localhost:5000/categories"),
        ]);

        if (!vendorRes.ok || !categoryRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const vendorData = await vendorRes.json();
        const categoryData = await categoryRes.json();

        if (!vendorData || !categoryData) {
          throw new Error("Data yang diterima kosong");
        }

        setVendors(vendorData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(`Gagal memuat vendor atau kategori: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("vendorId", vendorId);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    formData.append("description", description);
    if (image) {
      formData.append("image", image); // Menambahkan gambar hanya jika ada
    }
  
    try {
      const response = await fetch("http://localhost:5000/materials", {
        method: "POST",
        body: formData, // Mengirim FormData yang benar
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menambahkan material");
      }
  
      addMaterial(result);
  
      // Reset form setelah berhasil tambah data
      setName("");
      setVendorId("");
      setPrice("");
      setCategoryId("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error adding material:", error);
      alert(`Terjadi kesalahan saat menambahkan material: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="mb-4">
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
          placeholder="Masukkan nama material"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block font-medium">Deskripsi:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full"
          placeholder="Masukkan deskripsi material"
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
          placeholder="Masukkan harga material"
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
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
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
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
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

import React, { useState } from "react";

export default function AddMaterialForm({ addMaterial }) {
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState({ id: "", name: "" }); 
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null); 

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !vendor.name || !price || !category || !image) {
      alert("Semua kolom harus diisi");
      return;
    }

    const newMaterial = {
      name,
      vendor: {
        id: vendor.id || "",  
        name: vendor.name || ""
      },
      price,
      category,
      image: URL.createObjectURL(image), 
    };

    addMaterial(newMaterial);

    setName("");
    setVendor({ id: "", name: "" });
    setPrice("");
    setCategory("");
    setImage(null); 
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
     
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
        <label htmlFor="vendor" className="block font-medium">Vendor:</label>
        <input
          type="text"
          id="vendor"
          value={vendor.name} 
          onChange={(e) => setVendor({ id: e.target.value, name: e.target.value })}
          className="border border-gray-400 rounded px-2 py-1 w-full"
          placeholder="Masukkan nama vendor"
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
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1 w-full"
          placeholder="Masukkan kategori material"
        />
      </div>

      
      <div className="mb-4">
        <label htmlFor="image" className="block font-medium">Gambar:</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
          className="border border-gray-400 rounded px-2 py-1 w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        Tambah Material
      </button>
    </form>
  );
}

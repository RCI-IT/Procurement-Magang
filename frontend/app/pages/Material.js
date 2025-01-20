// src/components/Material.js
import React, { useState } from "react";
import AddMaterialForm from "./AddMaterialForm"; // Pastikan ini diimport dengan benar

export default function Material() {
  const [materials, setMaterials] = useState([]); // Menggunakan state kosong untuk menampung data material
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5);

  // Fungsi untuk menambahkan material baru
  const addMaterial = (newMaterial) => {
    const updatedMaterial = {
      id: materials.length + 1,
      ...newMaterial,
    };
    setMaterials((prevMaterials) => [...prevMaterials, updatedMaterial]);
  };

  const handleRowsChange = (event) => {
    setRowsToShow(Number(event.target.value));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Material</h1>

      {/* Input Pencarian */}
      <div className="mb-4 flex items-center">
        <label htmlFor="search-input" className="mr-2 font-medium">Cari Material:</label>
        <input
          type="text"
          id="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-400 rounded px-2 py-1"
          placeholder="Masukkan nama material"
        />
      </div>

      {/* Komponen Form Tambah Barang */}
      <AddMaterialForm addMaterial={addMaterial} /> {/* Pastikan addMaterial diteruskan ke form */}

      {/* Dropdown untuk memilih jumlah baris */}
      <div className="mb-4 flex items-center">
        <label htmlFor="rows-select" className="mr-2 font-medium">Tampilkan</label>
        <select
          id="rows-select"
          value={rowsToShow}
          onChange={handleRowsChange}
          className="border border-gray-400 rounded px-2 py-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      {/* Tabel Material */}
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Nama</th>
            <th className="border border-gray-300 px-4 py-2">Vendor</th>
            <th className="border border-gray-300 px-4 py-2">Harga</th>
            <th className="border border-gray-300 px-4 py-2">Kategori</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.slice(0, rowsToShow).map((material, index) => (
            <tr key={material.id}>
              <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{material.name}</td>
              <td className="border border-gray-300 px-4 py-2">{material.vendor}</td>
              <td className="border border-gray-300 px-4 py-2">{material.price}</td>
              <td className="border border-gray-300 px-4 py-2">{material.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

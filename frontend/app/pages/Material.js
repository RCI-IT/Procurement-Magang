import React, { useState } from "react";
import AddMaterialForm from "./AddMaterialForm"; 

export default function Material() {
  const [materials, setMaterials] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5); // Default: tampilkan 5 baris
  const [showForm, setShowForm] = useState(false);

  const addMaterial = (newMaterial) => {
    const updatedMaterial = {
      id: materials.length + 1,
      ...newMaterial,
    };
    setMaterials((prevMaterials) => [...prevMaterials, updatedMaterial]);
    setShowForm(false); // Menyembunyikan form setelah penambahan material
  };

  const handleRowsChange = (event) => {
    const value = Number(event.target.value);
    if (value > 0) { // Pastikan jumlah baris positif
      setRowsToShow(value);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery)
  );

  const handleDelete = (id) => {
    setMaterials((prevMaterials) => prevMaterials.filter((material) => material.id !== id));
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Material</h1>

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

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-500 text-white rounded px-4 py-2 mb-4"
      >
        {showForm ? "Batal Tambah" : "Tambah Material"}
      </button>

      {showForm && <AddMaterialForm addMaterial={addMaterial} />}

      <div className="mb-4 flex items-center">
        <label htmlFor="rows-input" className="mr-2 font-medium">Tampilkan</label>
        <input
          type="number"
          id="rows-input"
          value={rowsToShow}
          onChange={handleRowsChange}
          className="border border-gray-400 rounded px-2 py-1 w-20"
          min="1" // Nilai minimal 1
          placeholder="Jumlah"
        />
      </div>

      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Nama</th>
            <th className="border border-gray-300 px-4 py-2">Gambar</th>
            <th className="border border-gray-300 px-4 py-2">Vendor</th>
            <th className="border border-gray-300 px-4 py-2">Harga</th>
            <th className="border border-gray-300 px-4 py-2">Kategori</th>
            <th className="border border-gray-300 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.slice(0, rowsToShow).map((material, index) => (
            <tr key={material.id}>
              <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{material.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <img src={material.image} alt={material.name} className="w-16 h-16 object-cover" />
              </td>
              <td className="border border-gray-300 px-4 py-2">{material.vendor}</td>
              <td className="border border-gray-300 px-4 py-2">{material.price}</td>
              <td className="border border-gray-300 px-4 py-2">{material.category}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDelete(material.id)}
                  className="bg-red-500 text-white rounded px-2 py-1"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

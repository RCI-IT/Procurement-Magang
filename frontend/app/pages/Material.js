import React, { useState } from "react";
import AddMaterialForm from "./AddMaterialForm";

export default function Material() {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [vendorDetails, setVendorDetails] = useState(null);

  const addMaterial = (newMaterial) => {
    const updatedMaterial = {
      id: materials.length + 1,
      ...newMaterial,
    };
    setMaterials((prevMaterials) => [...prevMaterials, updatedMaterial]);
    setShowForm(false);
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

  const handleDelete = (id) => {
    setMaterials((prevMaterials) =>
      prevMaterials.filter((material) => material.id !== id)
    );
  };

  const handleVendorClick = (vendor) => {
    setVendorDetails(vendor);
  };

  const handleCloseVendorDetails = () => {
    setVendorDetails(null);
  };

  return (
    <div className="p-6">
      {/* Vendor Details */}
      {vendorDetails && (
        <div className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="text-xl font-semibold">{vendorDetails.name}</h2>
          <p>
            <strong>Alamat:</strong> {vendorDetails.address || "Tidak tersedia"}
          </p>
          <p>
            <strong>Telepon:</strong> {vendorDetails.phone || "Tidak tersedia"}
          </p>
          <button
            onClick={handleCloseVendorDetails}
            className="mt-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Material</h1>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        {/* Flex Container for Toolbar */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            {showForm ? "Batal Tambah" : "+ Material"}
          </button>
        </div>
        <input
          type="text"
          placeholder="Cari Material"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>

      {/* Form Tambah Material */}
      {showForm && <AddMaterialForm addMaterial={addMaterial} />}

      {/* Tabel Material */}
      <div className="mt-6">
        <div className="mb-4 flex items-center">
          <label htmlFor="rowsToShow" className="mr-2 font-medium">
            Tampilkan
          </label>
          <select
            id="rowsToShow"
            value={rowsToShow}
            onChange={handleRowsChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead className="bg-blue-500 text-white">
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
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {material.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={material.image}
                    alt={material.name}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-blue-500 underline">
                  <button
                    onClick={() =>
                      handleVendorClick({
                        id: material.vendor.id,
                        name: material.vendor.name,
                        address: material.vendor.address,
                        phone: material.vendor.phone,
                      })
                    }
                    className="text-blue-500 underline"
                  >
                    {material.vendor.name}
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {material.price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {material.category}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
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
    </div>
  );
}

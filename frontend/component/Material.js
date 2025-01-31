import React, { useState, useEffect } from "react";
import AddMaterialForm from "./AddMaterialForm";
import MaterialDetails from "./MaterialDetails";
import DetailVendor from "./DetailVendor";

export default function Material() {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data material dari backend
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/materials"); // Gantilah URL ini dengan URL backend Anda
      if (!response.ok) {
        throw new Error("Failed to fetch materials");
      }
      const data = await response.json();
      setMaterials(data); // Menyimpan data yang diterima dari API
    } catch (error) {
      setError(error.message); // Menyimpan error jika terjadi kesalahan
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mengambil data hanya sekali saat komponen di-mount
  useEffect(() => {
    fetchMaterials();
  }, []);
//test
  // Menambahkan material baru ke dalam daftar dan mengirimkannya ke backend
  const addMaterial = (newMaterial) => {
    const updatedMaterial = {
      id: materials.length + 1,
      ...newMaterial,
    };
    setMaterials((prevMaterials) => [...prevMaterials, updatedMaterial]);
    setShowForm(false);

    // Kirim material baru ke backend
    const saveMaterial = async () => {
      try {
        await fetch("http://localhost:5000/materials", { // URL API backend
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMaterial),
        });
      } catch (error) {
        console.error("Error adding material:", error);
      }
    };

    saveMaterial();
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

  const handleView = (material) => {
    setSelectedMaterial(material);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedMaterial(null);
    setSelectedVendor(null);
  };

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
  };

  return (
    <div className="p-6">
      {loading && <div className="text-center text-blue-500">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error}</div>}

      {!showDetails && !selectedVendor ? (
        <>
          <div className="mb-2">
            <h1 className="text-3xl font-bold">Material</h1>
          </div>

          <div className="mb-4 flex justify-end space-x-2">
            <input
              type="text"
              placeholder="Cari Material"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              {showForm ? "Batal Tambah" : "+ Material"}
            </button>
          </div>

          {showForm && <AddMaterialForm addMaterial={addMaterial} />}

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
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleVendorClick(material.vendor)}
                        className="text-blue-500 underline"
                      >
                        {material.vendor ? material.vendor.name : "N/A"}
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
                        onClick={() => handleView(material)}
                        className="bg-blue-500 text-white rounded px-2 py-1"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : selectedVendor ? (
        <div className="mt-4">
          <button
            onClick={handleBackToList}
            className="bg-red-500 text-white rounded px-4 py-2 mb-4"
          >
            Kembali
          </button>
          <DetailVendor vendor={selectedVendor} />
        </div>
      ) : (
        <div className="mt-4">
          <button
            onClick={handleBackToList}
            className="bg-red-500 text-white rounded px-4 py-2 mb-4"
          >
            Kembali
          </button>
          <MaterialDetails material={selectedMaterial} />
        </div>
      )}
    </div>
  );
}

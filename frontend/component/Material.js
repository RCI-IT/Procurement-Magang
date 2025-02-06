import React, { useState, useEffect } from "react";
import AddMaterialForm from "./AddMaterialForm";
import MaterialDetails from "./MaterialDetails";
import DetailVendor from "./DetailVendor";

export default function Material() {
  const [materials, setMaterials] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMaterials();
    fetchVendors();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.110.204:5000/materials");
      if (!response.ok) throw new Error("Failed to fetch materials");
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch("http://192.168.110.204:5000/vendors");
      if (!response.ok) throw new Error("Failed to fetch vendors");
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleVendorClick = (vendorId) => {
    const vendor = vendors.find((v) => v.id === vendorId);
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
    setShowDetails(false);
  };

  const handleMaterialClick = (materialId) => {
    const material = materials.find((m) => m.id === materialId);
    setSelectedMaterial(material);
    setShowDetails(true);
    setShowVendorDetails(false);
  };

  return (
    <div className="p-6">
      {loading && <div className="text-center text-blue-500">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error}</div>}

      {!showDetails && !showVendorDetails ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Material</h1>
          <div className="mb-4 flex justify-between space-x-2">
            <input
              type="text"
              placeholder="Cari Material"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              {showForm ? "Batal Tambah" : "+ Material"}
            </button>
          </div>
          <div className="mb-4 flex items-center">
            <label htmlFor="rowsToShow" className="mr-2 font-medium">
              Tampilkan
            </label>
            <select
              id="rowsToShow"
              value={rowsToShow}
              onChange={(e) => setRowsToShow(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          {showForm && <AddMaterialForm addMaterial={fetchMaterials} />}

          <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama</th>
                <th className="border px-4 py-2">Gambar</th>
                <th className="border px-4 py-2">Vendor</th>
                <th className="border px-4 py-2">Harga</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {materials
                .filter((material) => material.name.toLowerCase().includes(searchQuery))
                .slice(0, rowsToShow)
                .map((material, index) => {
                  const vendor = vendors.find((v) => v.id === material.vendorId);
                  return (
                    <tr key={material.id}>
                      <td className="border px-4 py-2 text-center">{index + 1}</td>
                      <td className="border px-4 py-2">{material.name}</td>
                      <td className="border px-4 py-2">
                        <img
                          src={`http://192.168.110.204:5000/uploads/${material.image}`}
                          alt={material.image}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleVendorClick(material.vendorId)}
                          className="text-blue-500 underline"
                        >
                          {vendor ? vendor.name : "Tidak Ada Vendor"}
                        </button>
                      </td>
                      <td className="border px-4 py-2">{material.price}</td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleMaterialClick(material.id)}
                          className="bg-blue-500 text-white rounded px-2 py-1"
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      ) : showVendorDetails ? (
        <>
          <button
            onClick={() => setShowVendorDetails(false)}
            className="bg-red-500 text-white rounded px-4 py-2 mb-4"
          >
            Kembali
          </button>
          <DetailVendor vendor={selectedVendor} onBack={() => setShowVendorDetails(false)} />
        </>
      ) : (
        <>
          <button
            onClick={() => setShowDetails(false)}
            className="bg-red-500 text-white rounded px-4 py-2 mb-4"
          >
            Kembali
          </button>
          <MaterialDetails material={selectedMaterial} onBack={() => setShowDetails(false)} />
        </>
      )}
    </div>
  );
}
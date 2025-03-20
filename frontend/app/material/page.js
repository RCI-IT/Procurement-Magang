/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../component/sidebar.js";

export default function Material() {
  const [materials, setMaterials] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialRes, vendorRes] = await Promise.all([
          fetch("http://192.168.110.204:5000/materials"),
          fetch("http://192.168.110.204:5000/vendors")
        ]);

        if (!materialRes.ok || !vendorRes.ok) throw new Error("Gagal mengambil data");

        const [materialData, vendorData] = await Promise.all([
          materialRes.json(),
          vendorRes.json()
        ]);

        setMaterials(materialData);
        setVendors(vendorData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleVendorClick = (vendorId) => {
    if (!vendorId) {
      console.error("Vendor ID tidak tersedia!");
      return;
    }
    router.push(`/vendor/${vendorId}`);
  };

  const handleMaterialClick = (materialId) => {
    if (!materialId) return;
    localStorage.setItem("selectedMaterialId", materialId);
    router.push(`/material/${materialId}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus material ini?")) return;

    try {
      const response = await fetch(`http://192.168.110.204:5000/materials/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Gagal menghapus material");

      setMaterials((prev) => prev.filter((material) => material.id !== id));
    } catch (error) {
      console.error("Error deleting material:", error);
      alert("Gagal menghapus material: " + error.message);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
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
            onClick={() => router.push("/material/add")}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            + Material
          </button>
        </div>

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
              .filter((m) => m.name.toLowerCase().includes(searchQuery))
              .slice(0, rowsToShow)
              .map((material, index) => {
                const vendor = vendors.find((v) => v.id === material.vendorId);
                return (
                  <tr key={material.id}>
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2 text-center">{material.name}</td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center items-center">
                        <img
                          src={`http://192.168.110.204:5000/uploads/${material.image}`}
                          alt={material.image}
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                    </td>
                    <td className="text-center border px-4 py-2">
                      {vendor ? (
                        <button
                          onClick={() => handleVendorClick(material.vendorId)}
                          className="text-blue-500 underline"
                        >
                          {vendor.name}
                        </button>
                      ) : (
                        "Tidak Ada Vendor"
                      )}
                    </td>
                    <td className="text-center border px-4 py-2">
                      Rp {new Intl.NumberFormat("id-ID", { useGrouping: true }).format(
                        material.price
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleMaterialClick(material.id)}
                        className="bg-blue-500 text-white rounded px-2 py-1"
                      >
                        👁
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

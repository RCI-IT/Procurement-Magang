import React from "react";
import { useParams } from "react-router-dom";

export default function VendorDetail() {
  const { id } = useParams();


  const vendorData = {
    name: "PT. Maju Selalu",
    address: "Jl. Sutomo Ujung, 35B, Medan Timur, Kota Medan, Sumatera Utara",
    contact: "+6281370383621",
    materials: [
      { name: "Pull Handle Onassis PH/ONS 633x500 SS", price: "Rp. 300.000", category: "Plumbing" },
      { name: "Pull Handle Gradino", price: "Rp. 500.000", category: "Plumbing" },
    ],
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{vendorData.name}</h1>
      <p>
        <strong>Alamat:</strong> {vendorData.address}
      </p>
      <p>
        <strong>Kontak:</strong> {vendorData.contact}
      </p>

      <h2 className="text-2xl font-bold mt-4">Material</h2>
      <table className="table-auto border-collapse border border-blue-400 w-full">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 px-4 py-2">Nama</th>
            <th className="border border-gray-300 px-4 py-2">Harga</th>
            <th className="border border-gray-300 px-4 py-2">Kategori</th>
          </tr>
        </thead>
        <tbody>
          {vendorData.materials.map((material, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{material.name}</td>
              <td className="border border-gray-300 px-4 py-2">{material.price}</td>
              <td className="border border-gray-300 px-4 py-2">{material.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

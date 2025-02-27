"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../component/sidebar";

export default function VendorPage() {
  const params = useParams();
  const vendorId = params.id;
  const [vendor, setVendor] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVendorAndMaterials = async () => {
      try {
        const resVendor = await fetch(`http://192.168.110.204:5000/vendors/${vendorId}`);
        if (!resVendor.ok) throw new Error("Gagal mengambil data vendor");
        const vendorData = await resVendor.json();

        const resMaterials = await fetch(`http://192.168.110.204:5000/materials?vendor_id=${vendorId}`);
        if (!resMaterials.ok) throw new Error("Gagal mengambil daftar material");
        const materialsData = await resMaterials.json();

        setVendor(vendorData);
        setMaterials(materialsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchVendorAndMaterials();
  }, [vendorId]);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md p-6 rounded-md mb-6">
          <h1 className="text-3xl font-bold">{vendor?.name}</h1>
          <p className="text-gray-600 mt-2">{vendor?.address || "Alamat tidak tersedia"}</p>
          <p className="text-lg mt-2">📞 {vendor?.contact || "Tidak tersedia"}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Material</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">+ Tambah</button>
          </div>
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 border">No.</th>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Gambar</th>
                <th className="p-2 border">Harga</th>
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <tr key={material.id} className="text-center border-b">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{material.name}</td>
                    <td className="p-2 border">
                      {material.image ? (
                        <img
                          src={`http://192.168.110.204:5000/uploads/${material.image}`}
                          alt={material.name}
                          className="w-16 h-16 object-cover mx-auto"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="p-2 border">Rp {material.price.toLocaleString()}</td>
                    <td className="p-2 border">{material.category || "Tidak ada kategori"}</td>
                    <td className="p-2 border">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded">Lihat</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-4">Tidak ada material tersedia.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button onClick={() => router.back()} className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">Kembali</button>
      </div>
    </div>
  );
}

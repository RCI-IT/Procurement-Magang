"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../component/sidebar"; 
import Header from "../../../component/Header";

export default function VendorPage() {
  const { id: vendorId } = useParams();
  const router = useRouter();

  const [vendor, setVendor] = useState(null);
  const [username, setUsername] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const resVendor = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`);
        if (!resVendor.ok) throw new Error("Gagal mengambil data vendor");
        const vendorData = await resVendor.json();

        const resMaterials = await  fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`);
        if (!resMaterials.ok) throw new Error("Gagal mengambil daftar material");
        const allMaterials = await resMaterials.json();

        const filteredMaterials = allMaterials.filter((item) => String(item.vendorId) === String(vendorId));

        setVendor(vendorData);
        setMaterials(filteredMaterials);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchVendorData();
  }, [vendorId]);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 space-y-6">
        <Header username={username} />

        <div className="bg-white shadow-md p-6 rounded-md">
          <h1 className="text-3xl font-bold">{vendor?.name}</h1>
          <p className="text-gray-600 mt-2">{vendor?.address || "Alamat tidak tersedia"}</p>
          <p className="text-lg mt-2">📞 {vendor?.phone || "Tidak tersedia"}</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Material</h2>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 border">No.</th>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Gambar</th>
                <th className="p-2 border">Harga</th>
                <th className="p-2 border">Kategori</th>
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
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${material.image}`}
                          alt={material.name}
                          className="w-16 h-16 object-cover mx-auto"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="p-2 border">Rp {material.price.toLocaleString("id-ID")}</td>
                    <td className="p-2 border">{material.category ? material.category.name : "Tidak ada kategori"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-4">
                    Tidak ada material tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => router.back()}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

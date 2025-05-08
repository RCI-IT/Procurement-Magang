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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

        const resMaterials = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materials`);
        if (!resMaterials.ok) throw new Error("Gagal mengambil daftar material");
        const allMaterials = await resMaterials.json();

        const filteredMaterials = allMaterials.filter((item) => String(item.vendorId) === String(vendorId));

        setVendor(vendorData);
        setMaterials(filteredMaterials);
        setCurrentPage(1); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchVendorData();
  }, [vendorId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = materials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(materials.length / itemsPerPage);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <div className="flex-1 p-6 space-y-6">
       

        <div className="bg-white shadow-md p-6 rounded-md">
          <h1 className="text-3xl font-bold">{vendor?.name} </h1>
          <p className="text-gray-600 mt-2">{vendor?.address || "Alamat tidak tersedia"}, {vendor?.city || "kota tidak tersedia"}</p>
          <p className="text-lg mt-2">📞 {vendor?.phone || "Tidak tersedia"}</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Material Dari Vendor ini</h2>
            <div>
              <label className="mr-2 text-sm text-gray-600">Tampilkan</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); 
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
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
              {currentMaterials.length > 0 ? (
                currentMaterials.map((material, index) => (
                  <tr key={material.id} className="text-center border-b">
                    <td className="p-2 border">{indexOfFirstItem + index + 1}</td>
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

{materials.length > itemsPerPage && (
  <div className="flex justify-center mt-6">
  <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-2 border border-gray-300 text-blue-600 hover:bg-gray-100 disabled:text-gray-400"
    >
      «
    </button>
    {[...Array(totalPages)].map((_, index) => {
      const page = index + 1;
      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-2 border border-gray-300 ${
            currentPage === page ? "text-white bg-blue-600" : "text-blue-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      );
    })}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-3 py-2 border border-gray-300 text-blue-600 hover:bg-gray-100 disabled:text-gray-400"
    >
      »
    </button>
  </nav>
</div>

)}

        </div>

        <div className="mt-4 space-x-2">
          <button
            onClick={() => router.push(`/vendor/${vendorId}/edit`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Vendor
          </button>
          <button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

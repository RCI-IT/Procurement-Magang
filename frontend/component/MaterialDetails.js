import React, { useState, useEffect } from "react";

export default function MaterialDetails({ material, vendor }) {
  const [relatedMaterials, setRelatedMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!material) return;

    const fetchRelatedMaterials = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://192.168.110.204:5000/materials?vendor_id=${material.vendorId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch related materials");
        }
        const data = await response.json();
        setRelatedMaterials(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching related materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedMaterials();
  }, [material]);

  return (
    <div className="p-6">
      <div className="mb-6 bg-white shadow-md p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">{vendor?.name || "Vendor Tidak Diketahui"}</h2>
            <p className="text-gray-600 text-sm">{vendor?.address || "Alamat tidak tersedia"}</p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-800 font-medium">{vendor?.phone || "Tidak ada kontak"}</p>
            {vendor?.phone && (
              <a
                href={`https://wa.me/${vendor.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
              >
                <span className="mr-2">Hubungi</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-start mb-8 bg-white shadow-md p-4 rounded-md">
        <div className="bg-gray-100 border border-gray-300 rounded p-4 flex justify-center">
          <img
            src={`http://192.168.110.204:5000/uploads/${material.image}`}
            alt={material.name}
            className="object-cover max-h-72"
          />
        </div>

        <div className="flex-grow">
          <h3 className="text-2xl font-bold mb-2">{material.name}</h3>
          <p className="text-xl text-blue-600 font-semibold mb-4">Rp {material.price}</p>
          <p className="text-sm text-gray-500 mb-4">
            Kategori: <span className="text-gray-700">{material.category}</span>
          </p>

          <h4 className="font-bold text-lg mb-2">Deskripsi</h4>
          <p className="text-gray-700 text-sm">{material.description || "Tidak ada deskripsi"}</p>
        </div>
      </div>

      <div className="bg-white shadow-md p-4 rounded-md">
        <h4 className="font-bold text-lg mb-4">Material lainnya dari vendor ini</h4>
        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && relatedMaterials.length === 0 && (
          <p className="text-center text-gray-500">Tidak ada material lain dari vendor ini.</p>
        )}
        <div className="flex justify-start gap-4">
          {relatedMaterials.map((item) => (
            <div
              key={item.id}
              className="border rounded p-4 text-center bg-white text-sm w-40 h-48 flex flex-col items-center shadow"
            >
              <img
                src={`http://192.168.110.204:5000/uploads/${item.image}`}
                alt={item.name}
                className="mb-2 w-20 h-20 object-cover"
              />
              <p className="font-semibold text-center break-words">{item.name}</p>
              <p className="text-red-500">Rp {item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

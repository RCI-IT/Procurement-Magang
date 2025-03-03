/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";

export default function MaterialPage() {
  const { id } = useParams();
  const router = useRouter();

  const [material, setMaterial] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [relatedMaterials, setRelatedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Material ID tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchMaterialDetails = async () => {
      setLoading(true);
      try {
        console.log("Fetching material with ID:", id);
        const resMaterial = await fetch(`http://192.168.110.204:5000/materials/${id}`);
        if (!resMaterial.ok) throw new Error("Material tidak ditemukan");
        const materialData = await resMaterial.json();
        console.log("✅ Material Data:", materialData);

        let vendorData = null;
        let relatedMaterialsData = [];

        // Jika material memiliki vendorId, gunakan itu (dengan konversi ke number jika perlu)
        if (materialData.vendorId) {
          const vendorId =
            typeof materialData.vendorId === "string"
              ? Number(materialData.vendorId)
              : materialData.vendorId;
          console.log("➡️ Using vendorId:", vendorId);
          const resVendor = await fetch(`http://192.168.110.204:5000/vendors/${vendorId}`);
          if (resVendor.ok) {
            vendorData = await resVendor.json();
            console.log("✅ Vendor Data:", vendorData);
          } else {
            console.warn("Vendor tidak ditemukan dengan ID:", vendorId);
          }
        }
        // Jika tidak ada vendorId, cari vendor berdasarkan nama dengan exact match
        else if (materialData.vendor) {
          const vendorName = materialData.vendor;
          console.log("➡️ Using vendor name:", vendorName);
          const resVendor = await fetch(
            `http://192.168.110.204:5000/vendors?name=${encodeURIComponent(vendorName)}`
          );
          if (resVendor.ok) {
            const vendorList = await resVendor.json();
            vendorData = vendorList.find(
              (v) =>
                v.name.trim().toLowerCase() === vendorName.trim().toLowerCase()
            ) || null;
            console.log("✅ Vendor Data by name:", vendorData);
          }
        }

        // Tentukan vendorId untuk pencarian material terkait
        let searchVendorId = null;
        if (materialData.vendorId) {
          searchVendorId =
            typeof materialData.vendorId === "string"
              ? Number(materialData.vendorId)
              : materialData.vendorId;
        } else if (vendorData && vendorData.id) {
          searchVendorId = vendorData.id;
        }

        if (searchVendorId) {
          const resRelated = await fetch(
            `http://192.168.110.204:5000/materials?vendorId=${searchVendorId}`
          );
          if (resRelated.ok) {
            const allMaterials = await resRelated.json();
            relatedMaterialsData = allMaterials.filter(
              (item) => item.id !== materialData.id
            );
          }
        }

        setMaterial(materialData);
        setVendor(vendorData);
        setRelatedMaterials(relatedMaterialsData);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching material details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialDetails();
  }, [id]);

  if (loading) return <div className="text-center text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!material) return <div className="text-center text-gray-500">Material tidak ditemukan.</div>;

  const materialImage = material?.imageUrl
    ? material.imageUrl
    : "http://192.168.110.204:5000/uploads/default-image.jpg";

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Vendor Info */}
        <div className="mb-6 bg-white shadow-md p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">
                {vendor?.name || "Vendor Tidak Diketahui"}
              </h2>
              <p className="text-gray-600 text-sm">
                {vendor?.address || "Alamat tidak tersedia"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-gray-800 font-medium">
                {vendor?.phone || "Tidak ada kontak"}
              </p>
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

        {/* Material Detail */}
        <div className="flex gap-6 items-start mb-8 bg-white shadow-md p-4 rounded-md">
          <div className="bg-gray-100 border border-gray-300 rounded p-4 flex justify-center">
            <img src={materialImage} alt={material.name} className="object-cover max-h-72" />
          </div>
          <div className="flex-grow">
            <h3 className="text-2xl font-bold mb-2">{material.name}</h3>
            <p className="text-xl text-blue-600 font-semibold mb-4">
              {material.price.startsWith("Rp") ? material.price : `Rp ${material.price}`}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Kategori: <span className="text-gray-700">{material.category || "Tidak ada kategori"}</span>
            </p>
            <h4 className="font-bold text-lg mb-2">Deskripsi</h4>
            <p className="text-gray-700 text-sm">{material.description || "Tidak ada deskripsi"}</p>
          </div>
        </div>

        {/* Related Materials */}
        <div className="bg-white shadow-md p-4 rounded-md">
          <h4 className="font-bold text-lg mb-4">Material lainnya dari vendor ini</h4>
          {relatedMaterials.length === 0 && (
            <p className="text-center text-gray-500">Tidak ada material lain dari vendor ini.</p>
          )}
          <div className="flex justify-start gap-4">
            {relatedMaterials.map((item) => {
              const relatedImage = item.image
                ? item.image.startsWith("http")
                  ? item.image
                  : `http://192.168.110.204:5000/uploads/${item.image}`
                : "http://192.168.110.204:5000/uploads/default-image.jpg";
              return (
                <div key={item.id} className="border rounded p-4 text-center bg-white text-sm w-40 h-48 flex flex-col items-center shadow">
                  <img src={relatedImage} alt={item.name} className="mb-2 w-20 h-20 object-cover" />
                  <p className="font-semibold text-center break-words">{item.name}</p>
                  <p className="text-red-500">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <br />
          <button onClick={() => router.back()} className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MaterialDetails from "./MaterialDetails";

export default function MaterialPage() {
  const { id } = useParams(); // ✅ Ambil ID dari URL
  const [material, setMaterial] = useState(null);
  const [vendor, setVendor] = useState(null);
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

        // 🔹 Fetch Material
        const resMaterial = await fetch(`http://192.168.110.204:5000/materials/${id}`);
        if (!resMaterial.ok) throw new Error("Material tidak ditemukan");
        const materialData = await resMaterial.json();

        console.log("Material Data:", materialData);

        let vendorData = null;

        // 🔹 Fetch Vendor jika vendorId ada
        if (materialData.vendorId) {
          const resVendor = await fetch(`http://192.168.110.204:5000/vendors/${materialData.vendorId}`);
          vendorData = resVendor.ok ? await resVendor.json() : null;
        }

        setMaterial(materialData);
        setVendor(vendorData);
        setError(null);
      } catch (err) {
        console.error("Error fetching material details:", err);
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

  return <MaterialDetails material={material} vendor={vendor} />;
}

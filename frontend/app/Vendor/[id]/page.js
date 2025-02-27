'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  // Pastikan menggunakan next/router

const DetailVendor = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;  // Mendapatkan vendorId dari URL

  // Menghindari masalah jika router.query.id belum terisi pada saat pertama kali render
  useEffect(() => {
    if (!id) {
      console.log("ID vendor belum tersedia, menunggu router...");
      return;
    }

    const fetchVendorDetails = async () => {
      setLoading(true);
      try {
        console.log("Fetching vendor data for id:", id);  // Pastikan ID diterima dengan benar
        const res = await fetch(`http://192.168.110.204:5000/vendors/${id}`);
        if (!res.ok) throw new Error('Vendor tidak ditemukan');
        const vendorData = await res.json();
        setVendor(vendorData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [id]);  // Pastikan useEffect dijalankan ulang ketika id berubah

  if (loading) return <div className="text-center text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!vendor) return <div className="text-center text-gray-500">Vendor tidak ditemukan.</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold text-center mb-4">Detail Vendor</h1>
      <div className="border p-4 rounded-md">
        <p className="text-xl font-semibold text-gray-700 mb-2">{vendor.name}</p>
        <p className="text-gray-600 mb-1">
          <strong className="text-gray-800">Alamat:</strong> {vendor.address || "Tidak tersedia"}
        </p>
        <p className="text-gray-600 mb-1">
          <strong className="text-gray-800">Kota :</strong> {vendor.city || "Tidak tersedia"}
        </p>
        <p className="text-gray-600 mb-1">
          <strong className="text-gray-800">Telepon:</strong> {vendor.phone || "Tidak tersedia"}
        </p>
        {vendor.phone && (
          <a
            href={`https://wa.me/${vendor.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
          >
            Hubungi Vendor
          </a>
        )}
      </div>
    </div>
  );
};

export default DetailVendor;

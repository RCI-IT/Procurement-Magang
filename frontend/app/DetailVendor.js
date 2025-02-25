"use client";

import React from "react";

export default function DetailVendor({ vendor }) {
  if (!vendor) return <div className="text-center text-red-500">Vendor tidak ditemukan</div>;

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
}

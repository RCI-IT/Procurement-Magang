import React from "react";

export default function DetailVendor({ vendor }) {
  if (!vendor) return <div>Vendor tidak ditemukan</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Detail Vendor {vendor.name}</h1>
      <p><strong>ID:</strong> {vendor.id}</p>
      <p><strong>Nama:</strong> {vendor.name}</p>
      <p><strong>Alamat:</strong> {vendor.address}</p> {/* Sesuaikan dengan properti yang ada */}
      <p><strong>Telepon:</strong> {vendor.phone}</p>   {/* Sesuaikan dengan properti yang ada */}
      {/* Tambahkan informasi lain sesuai dengan struktur data vendor */}
    </div>
  );
}

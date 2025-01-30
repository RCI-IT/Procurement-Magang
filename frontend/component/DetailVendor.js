import React from "react";

export default function DetailVendor({ vendorId }) {
  // Misalnya, Anda memiliki URL gambar vendor berdasarkan vendorId
  // Untuk demo, kita menggunakan gambar placeholder
  const vendorImageUrl = `https://via.placeholder.com/150?text=Vendor+${vendorId}`;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Detail Vendor {vendorId}</h1>
      <p>Informasi detail untuk vendor dengan ID: {vendorId}</p>
      
      {/* Menampilkan foto vendor */}
      <div className="mt-4">
        <img
          src="/rof.jpg" 
          alt={`Foto Vendor ${vendorId}`} // Alt text untuk gambar
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
      </div>
    </div>
  );
}

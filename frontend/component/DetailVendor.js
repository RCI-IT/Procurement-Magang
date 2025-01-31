import React from "react";

export default function DetailVendor({ vendorId }) {
  
  const vendorImageUrl = `https://via.placeholder.com/150?text=Vendor+${vendorId}`;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Detail Vendor {vendorId}</h1>
      <p>Informasi detail untuk vendor dengan ID: {vendorId}</p>
      
      <div className="mt-4">
        <img
          src="/rof.jpg" 
          alt={`Foto Vendor ${vendorId}`} 
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
      </div>
    </div>
  );
}

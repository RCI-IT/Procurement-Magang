import React from "react";

export default function MaterialDetails({ material }) {
  return (
    <div className="p-6">
      {/* Header Vendor */}
      <div className="mb-6 bg-white shadow-md p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">PT. Maju Selalu</h2>
            <p className="text-gray-600 text-sm">Jl. Sutomo Ujung. 35 B, Kec. Medan Timur, Kota Medan, Sumatera Utara</p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-800 font-medium">+6281370383621</p>
            <a
              href="https://wa.me/6281370383621"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
            >
              <span className="mr-2">Hubungi</span>
              className="object-cover max-h-72"
            </a>
          </div>
        </div>
      </div>

      {/* Detail Barang */}
      <div className="flex gap-6 items-start mb-8 bg-white shadow-md p-4 rounded-md">
        {/* Gambar Barang */}
        <div className="bg-gray-100 border border-gray-300 rounded p-4 flex justify-center">
          <img
            src={material.image}
            alt={material.name}
            className="object-cover max-h-72"
          />
        </div>

        {/* Informasi Barang */}
        <div className="flex-grow">
          <h3 className="text-2xl font-bold mb-2">{material.name}</h3>
          <p className="text-xl text-blue-600 font-semibold mb-4">Rp {material.price}</p>
          <p className="text-sm text-gray-500 mb-4">Kategori: <span className="text-gray-700">{material.category}</span></p>

          {/* Deskripsi */}
          <h4 className="font-bold text-lg mb-2">Deskripsi</h4>
          <p className="text-gray-700 text-sm">
            Pull Handle Onassis adalah gagang pintu bergaya modern dan elegan, terbuat dari bahan premium yang tahan lama, cocok untuk berbagai jenis pintu dan meningkatkan estetika serta kenyamanan.
            Dimensi: 63cm x 50cm x 63cm
            className="object-cover max-h-72"
          </p>
        </div>
      </div>

      {/* Material Lainnya */}
      <div className="bg-white shadow-md p-4 rounded-md">
        <h4 className="font-bold text-lg mb-4">Material lainnya di vendor ini</h4>
        <div className="flex justify-start gap-4">
          {/* Contoh Produk */}
          <div className="border rounded p-4 text-center bg-white text-sm w-40 h-48 flex flex-col items-center shadow">
            <img
              src="logo1.png"
              alt="Produk"
              className="mb-2 w-20 h-20 object-cover"
            />
            <p className="font-semibold text-center break-words">Pegangan Pintu Onassis Knob</p>
            <p className="text-red-500">Rp 120.000</p>
          </div>
          <div className="border rounded p-4 text-center bg-white text-sm w-40 h-48 flex flex-col items-center shadow">
            <img
              src="logo1.png"
              alt="Produk"
              className="mb-2 w-20 h-20 object-cover"
            />
            <p className="font-semibold text-center break-words">Pegangan Pintu Dekkson Sliding</p>
            <p className="text-red-500">Rp 105.000</p>
          </div>
          <div className="border rounded p-4 text-center bg-white text-sm w-40 h-48 flex flex-col items-center shadow">
            <img
              src="logo1.png"
              alt="Produk"
              className="mb-2 w-20 h-20 object-cover"
            />
            <p className="font-semibold text-center break-words">Semen Conch 50kg</p>
            <p className="text-red-500">Rp 55.000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

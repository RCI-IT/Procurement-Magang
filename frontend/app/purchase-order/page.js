"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PurchaseOrderTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Simulasi fetch data PO
    const poData = [
      { id: "1", nomor: "ESPO-2411-015", tanggal: "18 Desember 2024", lokasi: "SERINDIT MERAH" },
      { id: "2", nomor: "PL/AB-ESS/LTC/2412001", tanggal: "18 Desember 2024", lokasi: "LTC-Z1" },
      { id: "3", nomor: "PL/AB-ESS/LTC/2412002", tanggal: "18 Desember 2024", lokasi: "LTC-Z1" },
    ];
    setData(poData);
    setFilteredData(poData);
  }, []);

  useEffect(() => {
    const filtered = data.filter((po) =>
      po.nomor.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Purchase Order</h2>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => router.push("/purchase-order/add")}
          >
            + Tambah
          </button>
          <input
            type="text"
            placeholder="Cari"
            className="border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border p-2">No.</th>
            <th className="border p-2">Nomor</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Lokasi</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((po, index) => (
              <tr key={po.id} className="text-center border">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{po.nomor}</td>
                <td className="border p-2">{po.tanggal}</td>
                <td className="border p-2">{po.lokasi}</td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => router.push(`/purchase-order/${po.id}`)}
                  >
                    Lihat
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">Tidak ada data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderTable;

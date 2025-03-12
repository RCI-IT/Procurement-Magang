"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PurchaseOrderTable = () => {
  const [data, setData] = useState([]); // Data dari API
  const [search, setSearch] = useState(""); // Kata kunci pencarian
  const [filteredData, setFilteredData] = useState([]); // Data yang sudah difilter
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State error
  const router = useRouter();

  // Fetch data dari API saat pertama kali komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.110.204:5000/purchase");
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Set data awal untuk pencarian
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan pencarian
  useEffect(() => {
    const filtered = data.filter((po) =>
      po.nomorPO.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  return (
    <div className="p-4 bg-white shadow-md rounded-md"><br></br>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Purchase Order</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => router.push("/purchase-order/add")}
          >
            + Tambah
          </button>
          <input
            type="text"
            placeholder="Cari PO..."
            className="border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center">Memuat data...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
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
                  <td className="border p-2">{po.nomorPO}</td>
                  <td className="border p-2">{po.tanggalPO ? new Date(po.tanggalPO).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }): "N/A"}
                  </td>
                  <td className="border p-2">{po.lokasiPO}</td>
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
                <td colSpan="5" className="text-center p-4">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchaseOrderTable;

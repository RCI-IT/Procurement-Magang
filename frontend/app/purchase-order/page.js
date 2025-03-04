"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

<<<<<<< HEAD
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
=======
export default function PurchaseOrder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://192.168.110.204:5000/purchase-orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Gagal mengambil data PO:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://192.168.110.204:5000/purchase-orders/${id}`, { method: "DELETE" });
      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Gagal menghapus PO:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Daftar Purchase Order</h1>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Cari nomor PO..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2"
        />
        <button onClick={() => router.push("/purchase-order/add")} className="bg-blue-500 text-white px-4 py-2">
          + Tambah PO
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Nomor PO</th>
            <th className="border px-4 py-2">Tanggal</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2">{order.nomor}</td>
                <td className="border px-4 py-2">{new Date(order.tanggal).toLocaleDateString()}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button onClick={() => router.push(`/purchase-order/${order.id}`)} className="bg-blue-500 text-white px-2 py-1">
                    Lihat
                  </button>
                  <button onClick={() => handleDelete(order.id)} className="bg-red-500 text-white px-2 py-1">
                    Hapus
                  </button>
>>>>>>> acfd8c4f465f439c6e911929b376f9f9c234f25e
                </td>
              </tr>
            ))
          ) : (
            <tr>
<<<<<<< HEAD
              <td colSpan="5" className="text-center p-4">Tidak ada data</td>
=======
              <td colSpan="4" className="border px-4 py-2 text-center text-gray-500">
                Tidak ada data.
              </td>
>>>>>>> acfd8c4f465f439c6e911929b376f9f9c234f25e
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
<<<<<<< HEAD
};

export default PurchaseOrderTable;
=======
}
>>>>>>> acfd8c4f465f439c6e911929b376f9f9c234f25e

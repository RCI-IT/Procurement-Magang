"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center text-gray-500">
                Tidak ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

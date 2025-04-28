"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/component/sidebar";
import Header from "@/component/Header";
import { useRouter } from "next/navigation";

const PurchaseOrderPage = () => {
  const [order, setOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedOrder = localStorage.getItem('selectedOrder');
    const storedUsername = localStorage.getItem('username');
    const { items } = router.query;

    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (items) {
      setSelectedItems(JSON.parse(items)); // Parse the items passed from confirmation page
    }
  }, [router.query]);

  if (!order) {
    return <p className="text-center">Tidak ada data Purchase Order.</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full max-w-6xl mx-auto px-8">
        <Header username={username} />
        <h1 className="text-3xl font-bold my-6 text-center">Purchase Order</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <p><strong>Nomor CO:</strong> {order.nomorCO}</p>
            <p><strong>Tanggal CO:</strong> {new Date(order.tanggalCO).toLocaleDateString('id-ID')}</p>
            <p><strong>Lokasi:</strong> {order.lokasiCO}</p>
          </div>

          {/* Display selected items from confirmation order */}
          <h3 className="font-bold mb-4">Selected Items:</h3>
          <ul>
            {selectedItems.map((item, index) => (
              <li key={index}>{item}</li> // Show item code or other relevant details
            ))}
          </ul>

          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-6"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPage;


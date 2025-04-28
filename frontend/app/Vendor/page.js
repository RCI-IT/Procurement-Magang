"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../component/sidebar";
import Header from "../../component/Header";
import { Eye, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

export default function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");
  const [rowsToShow, setRowsToShow] = useState(10); 
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`);
      if (!res.ok) throw new Error("Gagal fetch vendor");
      const data = await res.json();
      setVendors(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleVendorClick = (vendorId) => {
    if (!vendorId) return;
    router.push(`/vendor/${vendorId}`);
  };



  const handleDelete = async (vendorId) => {
    const result = await Swal.fire({
      title: 'Yakin ingin hapus vendor ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Gagal hapus vendor');
  
      Swal.fire({
        title: 'Berhasil!',
        text: 'Vendor berhasil dihapus.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
  
      fetchData();
    } catch (error) {
      console.error('Error:', error);
  
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menghapus vendor.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1 overflow-auto">
          <Header username={username} />
          <h1 className="text-3xl font-bold mb-4">Vendor</h1>

          <div className="mb-4 flex justify-between space-x-2">
            <input
              type="text"
              placeholder="Cari Vendor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Nama</th>
                <th className="border px-4 py-2">Alamat</th>
                <th className="border px-4 py-2">Kota</th>
                <th className="border px-4 py-2">No Telepon</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {vendors
                .filter((v) => v.name.toLowerCase().includes(searchQuery))
                .slice(0, rowsToShow)
                .map((vendor, index) => (
                  <tr key={vendor.id}>
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2 text-center">{vendor.name}</td>
                    <td className="border px-4 py-2 text-center">{vendor.address}</td>
                    <td className="border px-4 py-2 text-center">{vendor.city}</td>
                    <td className="border px-4 py-2 text-center">{vendor.phone}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleVendorClick(vendor.id)}
                        className="bg-blue-500 text-white rounded px-2 py-1"
                      >
                        <Eye className="text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                      >
                        <Trash2 className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

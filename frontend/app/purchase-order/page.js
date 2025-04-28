"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/component/sidebar";
import Header from "../../component/Header";
import { Eye, Trash2 } from "lucide-react";

const ConfirmationOrderTableEmpty = () => {
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();
  const [username, setUsername] = useState("");



  const ActionButtons = ({ onView, onDelete }) => (
    <div className="flex justify-center gap-4">
      <button onClick={onView} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
        <Eye className="text-white" />
      </button>
      <button onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white rounded-xl w-12 h-12 flex items-center justify-center">
        <Trash2 className="text-white" />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-4 flex-1 bg-white shadow-md rounded-md overflow-auto">
        <div>
          <Header username={username} />
        </div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Purchase Order</h1>
          <div className="flex gap-2">

            <input
              type="text"
              placeholder="Cari PO..."
              className="border p-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Empty Table Section */}
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
            <tr>
              <td colSpan="5" className="text-center p-4">
                Tidak ada data
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfirmationOrderTableEmpty;

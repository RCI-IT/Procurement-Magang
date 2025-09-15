"use client";

import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Proyek() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <main className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold my-4">Proyek</h1>

          <div className="flex items-center space-x-2">
            {/* <input
              type="text"
              placeholder="Cari Material"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            /> */}

            <button
              onClick={() => router.push("/proyek/add")}
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              Tambah Proyek
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full mt-2">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Nama Proyek</th>
                  <th className="border px-4 py-2">Kode Proyek</th>
                  <th className="border px-4 py-2">Lokasi</th>

                  {/* 
                  Untuk Admin 
                    <th className="border px-4 py-2">Manager</th>
                    <th className="border px-4 py-2">Jumlah Tim</th> 
                  */}

                  <th className="border px-4 py-2">Status Proyek</th>
                  {/* 
                  Untuk Employee
                  <th className="border px-4 py-2">Peran Saya</th>
                   */}
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 text-center">{}</td>
                  <td className="border px-4 py-2 text-center">{}</td>
                  <td className="border px-4 py-2 text-center">{}</td>
                  <td className="border px-4 py-2 text-center">{}</td>
                  <td className="border px-4 py-2 text-center">{}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      //   onClick={() => handleMaterialClick(material.id)}
                      className="bg-blue-500 text-white rounded px-2 py-1"
                    >
                      <Eye className="text-white" />
                    </button>
                    <button
                      // onClick={() => handleDelete(material.id)}
                      className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                    >
                      <Trash2 className="text-white" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

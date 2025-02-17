import React, { useState } from "react";

export default function PermintaanLapangan({ data, setActiveContent }) {
  const [rowsToShow, setRowsToShow] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data berdasarkan pencarian
  const filteredData = data.filter((item) =>
    item.nomor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Permintaan Lapangan</h1>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Cari"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
          <button
            onClick={() => setActiveContent("tambah-permintaan")}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Tambah
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <label htmlFor="rowsToShow" className="mr-2 font-medium">
          Tampilkan
        </label>
        <select
          id="rowsToShow"
          value={rowsToShow}
          onChange={(e) => setRowsToShow(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="border px-4 py-2">No.</th>
            <th className="border px-4 py-2">Nomor</th>
            <th className="border px-4 py-2">Tanggal</th>
            <th className="border px-4 py-2">Lokasi</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.slice(0, rowsToShow).map((item, index) => (
            <tr key={item.id}> {/* Tambahkan key unik di sini */}
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2">{item.nomor}</td>
              <td className="border px-4 py-2">{item.tanggal}</td>
              <td className="border px-4 py-2">{item.lokasi}</td>
              <td className="border px-4 py-2 text-center">
                <button className="bg-blue-500 text-white rounded px-4 py-2">
                  Lihat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

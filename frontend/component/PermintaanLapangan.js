import React, { useState, useEffect } from "react";

export default function PermintaanLapanganTable() {
  const [data, setData] = useState([]);
  const [rowsToShow, setRowsToShow] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data untuk contoh
  useEffect(() => {
    // Fetch data here (use dummy data for now)
    const dummyData = Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      nomor: `PL/AB-ESS/LTC/${(2400000 + index).toString()}`,
      tanggal: "18 Desember 2024",
      lokasi: "LTC-Z1",
    }));
    setData(dummyData);
  }, []);

  // Filter data berdasarkan pencarian
  const filteredData = data.filter(item =>
    item.nomor.toLowerCase().includes(searchQuery.toLowerCase())
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
          <button className="bg-blue-500 text-white rounded px-4 py-2">
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
            <tr key={item.id}>
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

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button className="border border-gray-300 px-4 py-2 rounded">{"<"}</button>
        <button className="border border-gray-300 px-4 py-2 rounded">1</button>
        <button className="border border-gray-300 px-4 py-2 rounded">2</button>
        <button className="border border-gray-300 px-4 py-2 rounded">{">"}</button>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";

export default function AddPurchaseOrder() {
  const [formData, setFormData] = useState({
    nomorPO: "",
    proyek: "",
    idPL: "",
    tanggalPO: "",
    idVendor: "",
  });

  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [permintaanLapangan, setPermintaanLapangan] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [tanggalPL, setTanggalPL] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPermintaanLapangan = async () => {
      try {
        const response = await fetch("http://192.168.110.204:5000/permintaan");
        const data = await response.json();
        setPermintaanLapangan(data);
      } catch (error) {
        console.error("Gagal mengambil data PL:", error);
      }
    };

    fetchPermintaanLapangan();
  }, []);

  useEffect(() => {
    if (formData.idPL) {
      const selectedPL = permintaanLapangan.find((pl) => pl.id === parseInt(formData.idPL));

      if (selectedPL) {
        setTanggalPL(selectedPL.tanggal.split("T")[0]);
        setAllItems(selectedPL.detail || []);

        const vendorList = [
          ...new Map(
            selectedPL.detail.map((item) => [item.material.vendor.id, item.material.vendor])
          ).values(),
        ];
        setVendors(vendorList);
      } else {
        setTanggalPL("");
        setAllItems([]);
        setVendors([]);
      }

      setSelectedItems([]);
      setFormData((prev) => ({ ...prev, idVendor: "" }));
    }
  }, [formData.idPL, permintaanLapangan]);

  useEffect(() => {
    if (formData.idVendor) {
      const filtered = allItems.filter((item) => item.material.vendor.id === parseInt(formData.idVendor));
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [formData.idVendor, allItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleItemSelection = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.some((i) => i.id === item.id)
        ? prevSelected.filter((i) => i.id !== item.id)
        : [...prevSelected, item]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      items: selectedItems.map(({ id, code, material, qty, satuan }) => ({
        id,
        kodeBarang: code,
        namaBarang: material?.name ?? "Tidak Diketahui",
        harga: material?.price ?? 0,
        qty,
        satuan,
      })),
    };

    try {
      await fetch("http://192.168.110.204:5000/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      router.push("/purchase-order");
    } catch (error) {
      console.error("Gagal menambah PO:", error);
    }
  };

  const totalHarga = selectedItems.reduce(
    (total, item) => total + (item.material?.price || 0) * item.qty,
    0
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Purchase Order</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <label className="block font-medium">Nomor PO:</label>
              <input type="text" name="nomorPO" value={formData.nomorPO} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>

            <div>
              <label className="block font-medium">Proyek:</label>
              <input type="text" name="proyek" value={formData.proyek} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>

            <div>
              <label className="block font-medium">Tanggal PO:</label>
              <input type="date" name="tanggalPO" value={formData.tanggalPO} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>

            <div>
              <label className="block font-medium">Pilih No PL:</label>
              <select name="idPL" value={formData.idPL} onChange={handleChange} className="border px-4 py-2 w-full" required>
                <option value="">Pilih Nomor PL</option>
                {permintaanLapangan.map((pl) => (
                  <option key={pl.id} value={pl.id}>{pl.nomor}</option>
                ))}
              </select>
            </div>

            {formData.idPL && vendors.length > 0 && (
              <div>
                <label className="block font-medium">Pilih Vendor:</label>
                <select name="idVendor" value={formData.idVendor} onChange={handleChange} className="border px-4 py-2 w-full" required>
                  <option value="">Pilih Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {formData.idVendor && filteredItems.length > 0 && (
            <div className="border-b pb-4">
              <label className="block font-medium">Barang:</label>
              <table className="w-full border-collapse border border-gray-300 mt-2">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Pilih</th>
                    <th className="border p-2">Kode Barang</th>
                    <th className="border p-2">Nama Barang</th>
                    <th className="border p-2">Harga</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Satuan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-2 text-center"><input type="checkbox" checked={selectedItems.some((i) => i.id === item.id)} onChange={() => toggleItemSelection(item)} /></td>
                      <td className="border p-2">{item.code}</td>
                      <td className="border p-2">{item.material?.name}</td>
                      <td className="border p-2">Rp {item.material?.price.toLocaleString()}</td>
                      <td className="border p-2">{item.qty}</td>
                      <td className="border p-2">{item.satuan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-xl font-semibold">Total Harga: Rp {totalHarga.toLocaleString()}</div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-40">Selesai</button>
        </form>
      </div>
    </div>
  );
}

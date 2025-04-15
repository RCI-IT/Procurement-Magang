/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";
import Header from "../../../component/Header.js"

export default function AddConfirmationOrder() { // UBAH NAMA FUNGSI
  const [formData, setFormData] = useState({
    nomorCO: "",
    lokasiCO: "",
    idPL: "",
    tanggalCO: "",
    idVendor: "",
  });

  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [permintaanLapangan, setPermintaanLapangan] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [tanggalPL, setTanggalPL] = useState("");
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchPermintaanLapangan = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan`);
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
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nomorCO || !formData.lokasiCO || !formData.tanggalCO || !formData.idPL || !formData.idVendor) {
      alert("Semua kolom harus diisi!");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Pilih minimal 1 barang!");
      return;
    }

    const payload = {
      nomorCO: formData.nomorCO,
      tanggalCO: new Date(formData.tanggalCO).toISOString(),
      lokasiCO: formData.lokasiCO,
      permintaanId: parseInt(formData.idPL, 10),
      items: selectedItems.map(({ id, material, code, qty, satuan }) => ({
        permintaanDetailId: id,
        kodeBarang: code,
        namaBarang: material?.name ?? "Tidak Diketahui",
        harga: material?.price ?? 0,
        qty,
        satuan,
      })),
    };

    console.log("Selected Items:", selectedItems);
    console.log("Payload yang dikirim ke backend:", JSON.stringify(payload, null, 2));
    console.log("🛠 Items yang akan dikirim:", JSON.stringify(selectedItems, null, 2));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirmation`, { // ENDPOINT SUDAH BENAR UNTUK CO
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Confirmation Order berhasil ditambahkan!"); // PESAN SUDAH SESUAI
        router.back();
      } else {
        const errorData = await response.json();
        console.error("Gagal menambah Confirmation Order:", errorData); // LOG DISESUAIKAN
      }
    } catch (error) {
      console.error("Gagal menambah Confirmation Order:", error); // LOG DISESUAIKAN
    }
  };

  const toggleItemSelection = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.some((i) => i.id === item.id)
        ? prevSelected.filter((i) => i.id !== item.id)
        : [...prevSelected, item]
    );
  };

  const totalHarga = selectedItems.reduce(
    (total, item) => total + (item.material?.price || 0) * item.qty,
    0
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div>
          <Header username={username} />
        </div>
        <h1 className="text-2xl font-bold mb-6">Tambah Confirmation Order</h1> {/* JUDUL DIUBAH */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <label className="block font-medium">Nomor CO:</label>
              <input type="text" name="nomorCO" value={formData.nomorCO} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">lokasi CO:</label>
              <input type="text" name="lokasiCO" value={formData.lokasiCO} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Tanggal CO:</label>
              <input type="date" name="tanggalCO" value={formData.tanggalCO} onChange={handleChange} className="border px-4 py-2 w-full" required />
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
            {formData.idPL && (
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

          {formData.idVendor && (
            <div className="border-b pb-4">
              <label className="block font-medium">Pilih Barang:</label>
              {filteredItems.length > 0 ? (
                <ul>
                  {filteredItems.map((item) => (
                    <li key={item.id} className="flex items-center border p-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.some((i) => i.id === item.id)}
                        onChange={() => toggleItemSelection(item)}
                        className="mr-2"
                      />
                      {item.material?.name} - Rp {item.material?.price.toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Tidak ada barang dari vendor ini</p>
              )}
            </div>
          )}

          <div className="text-xl font-semibold">Total Harga: Rp {totalHarga.toLocaleString()}</div>
          <div className="flex gap-2 mt-2">
          <button type="button" 
          onClick={() => router.back()}
          className="bg-red-500 text-white px-4 py-2 rounded">Batal</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Simpan</button>
         </div>
        </form>
      </div>
    </div>
  );
}

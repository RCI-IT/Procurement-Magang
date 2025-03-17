/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  // Fetch data Permintaan Lapangan
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

  // Update daftar barang dan vendor berdasarkan PL yang dipilih
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

  // Filter barang berdasarkan vendor yang dipilih
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
    
    if (!formData.nomorPO || !formData.proyek || !formData.tanggalPO || !formData.idPL || !formData.idVendor) {
      alert("Semua kolom harus diisi!");
      return;
    }
  
    if (selectedItems.length === 0) {
      alert("Pilih minimal 1 barang!");
      return;
    }
  
    // Pastikan hanya item yang dipilih yang dikirim ke backend
    const payload = {
      nomorPO: formData.nomorPO,
      tanggalPO: new Date(formData.tanggalPO).toISOString(),
      lokasiPO: formData.proyek,
      permintaanId: parseInt(formData.idPL, 10),
      items: selectedItems.map(({ id, material, code, qty, satuan }) => ({
        permintaanDetailId: id,  // Hanya ID dari selectedItems
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
      const response = await fetch("http://192.168.110.204:5000/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Purchase Order berhasil ditambahkan!");
        router.back();
      } else {
        const errorData = await response.json();
        console.error("Gagal menambah PO:", errorData);
      }
    } catch (error) {
      console.error("Gagal menambah PO:", error);
    }
  };
  const toggleItemSelection = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.some((i) => i.id === item.id)
        ? prevSelected.filter((i) => i.id !== item.id) // Hapus jika sudah dipilih
        : [...prevSelected, item] // Tambahkan jika belum dipilih
    );
  };
  const totalHarga = selectedItems.reduce(
    (total, item) => total + (item.material?.price || 0) * item.qty,
    0
  );

  return (
    <div className="flex h-screen">
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
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-40">Simpan</button>
        </form>
      </div>
    </div>
  );
}

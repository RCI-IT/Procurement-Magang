"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AddConfirmationOrder() {
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
  const [, setTanggalPL] = useState("");
  const [, setUsername] = useState("");
  const router = useRouter();

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
    const fetchVendors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`);
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error("Gagal mengambil data vendor:", error);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    if (formData.idPL) {
      const selectedPL = permintaanLapangan.find((pl) => pl.id === parseInt(formData.idPL));
      if (selectedPL) {
        setTanggalPL(selectedPL.tanggal.split("T")[0]);
        setAllItems(selectedPL.detail || []);
      } else {
        setTanggalPL("");
        setAllItems([]);
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
      const vendor = vendors.find((v) => v.id === parseInt(formData.idVendor));
      setFilteredItems(vendor ? vendor.materials : []);
    } else {
      setFilteredItems([]);
    }
  }, [formData.idVendor, vendors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleItemDetailChange = (itemId, key, value) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, [key]: value } : item))
    );
  };

  const toggleItemSelection = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, qty: 0, satuan: "", mention: "", keterangan: "" }]
    );
  };

  const totalHarga = selectedItems.reduce((total, item) => {
    const harga =
    vendors
      .find((v) => v.id === parseInt(formData.idVendor))
      ?.materials.find((m) => m.id === item.id)?.price || 0;
  
    return total + harga * item.qty;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nomorCO || !formData.lokasiCO || !formData.tanggalCO || !formData.idPL || !formData.idVendor) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Semua kolom harus diisi!" });
      return;
    }

    if (selectedItems.length === 0) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Pilih minimal 1 barang!" });
      return;
    }

    for (const item of selectedItems) {
      if (!item.qty || !item.satuan) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Pastikan setiap barang yang dipilih memiliki qty dan satuan!",
        });
        return;
      }
    }

    const payload = {
      nomorCO: formData.nomorCO,
      tanggalCO: formData.tanggalCO,
      lokasiCO: formData.lokasiCO,
      permintaanId: parseInt(formData.idPL),
      items: selectedItems.map((item) => {
        const originalMaterial = filteredItems.find((mat) => mat.id === item.id);
        return {
          materialId: item.id, // langsung id dari vendor.materials
          qty: Number(item.qty),
          satuan: item.satuan || "pcs",
          code: item.code || originalMaterial?.code || "N/A",
          status: "PENDING",
          keterangan: item.keterangan || "-",
        };
      }),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Confirmation Order berhasil ditambahkan!" });
        router.back();
      } else {
        const errorData = await response.json();
        console.error("Gagal menambah Confirmation Order:", errorData);
        Swal.fire({ icon: "error", title: "Gagal", text: "Terjadi kesalahan saat menambah Confirmation Order!" });
      }
    } catch (error) {
      console.error("Gagal menambah Confirmation Order:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi kesalahan pada server." });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Confirmation Order</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
          {/* Form Utama */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <label className="block font-medium">Nomor CO:</label>
              <input type="text" name="nomorCO" value={formData.nomorCO} onChange={handleChange} className="border px-4 py-2 w-full" required />
            </div>
            <div>
              <label className="block font-medium">Lokasi CO:</label>
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
          </div>

          {/* Tabel Detail PL */}
          {formData.idPL && (
            <div className="border-b pb-4">
              <h3 className="font-semibold">Detail PL</h3>
              <table className="table-auto w-full mt-2">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Kode Barang</th>
                    <th className="px-4 py-2">Nama Barang</th>
                    <th className="px-4 py-2">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border px-4 py-2">{item.code}</td>
                      <td className="border px-4 py-2">{item.material?.name}</td>
                      <td className="border px-4 py-2">{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pilih Vendor */}
          {formData.idPL && (
            <div className="pb-4">
              <label className="block font-medium">Pilih Vendor:</label>
              <select name="idVendor" value={formData.idVendor} onChange={handleChange} className="border px-4 py-2 w-full" required>
                <option value="">Pilih Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Pilih Barang */}
          {formData.idVendor && (
            <div className="border-b pb-4">
              <label className="block font-medium">Pilih Barang:</label>
              {filteredItems.length > 0 ? (
                <ul className="space-y-4">
                  {filteredItems.map((item) => {
                    const selected = selectedItems.find((i) => i.id === item.id);
                    return (
                      <li key={item.id} className="border p-4 rounded-md">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={!!selected} onChange={() => toggleItemSelection(item)} />
                          <span className="font-medium">{item.name}</span>
                        </label>
                        {selected && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <label className="block text-sm font-medium">Qty</label>
                              <input
                                type="number"
                                value={selected.qty}
                                onChange={(e) => handleItemDetailChange(item.id, "qty", parseInt(e.target.value) || 1)}
                                className="border px-2 py-1 w-full"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium">Satuan</label>
                              <input
                                type="text"
                                value={selected.satuan}
                                onChange={(e) => handleItemDetailChange(item.id, "satuan", e.target.value)}
                                className="border px-2 py-1 w-full"
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Kode Barang</label>
                    <input
                      type="text"
                      value={selected.code ?? ""}
                      onChange={(e) => handleItemDetailChange(item.id, "code", e.target.value)}
                      className="border px-2 py-1 w-full"
                      placeholder="Masukkan kode barang"
                    />
                  </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium">Mention</label>
                              <input
                                type="text"
                                value={selected.mention}
                                onChange={(e) => handleItemDetailChange(item.id, "mention", e.target.value)}
                                className="border px-2 py-1 w-full"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium">Keterangan</label>
                              <textarea
                                value={selected.keterangan}
                                onChange={(e) => handleItemDetailChange(item.id, "keterangan", e.target.value)}
                                className="border px-2 py-1 w-full"
                                rows={2}
                              />
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-red-500">Tidak ada barang yang tersedia untuk vendor ini.</p>
              )}
            </div>
          )}

          {/* Tombol Simpan dan Total */}
          <div className="flex justify-between items-center pt-4">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Simpan
            </button>
            <div className="font-bold">Total: Rp {totalHarga.toLocaleString()}</div>
          </div>
        </form>
      </div>
    </div>
  );
}

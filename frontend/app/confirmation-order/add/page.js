"use client";

import Select from "react-select";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";

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
  const [token, setToken] = useState(null);

  const router = useRouter();

  // Get token & role on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch permintaan and vendors
  const getData = useCallback(async () => {
    try {
      const permintaanData = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/permintaan`,
        token,
        setToken,
        () => router.push("/login")
      );
      setPermintaanLapangan(permintaanData);

      const vendorsData = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/vendors`,
        token,
        setToken,
        () => router.push("/login")
      );
      setVendors(vendorsData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }, [token, setToken, router]);

  useEffect(() => {
    if (token) getData();
  }, [token, getData]);

  useEffect(() => {
    // Jika PL berubah
    const selectedPL = permintaanLapangan.find(
      (pl) => pl.id === parseInt(formData.idPL)
    );
    setAllItems(selectedPL?.detail || []);
    setSelectedItems([]);
    if (!selectedPL) return;

    // Jika vendor berubah
    const vendor = vendors.find((v) => v.id === parseInt(formData.idVendor));
    setFilteredItems(vendor?.materials || []);
  }, [formData.idPL, formData.idVendor, permintaanLapangan, vendors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      idPL: selected?.value || "",
    }));
  };

  const handleItemDetailChange = (itemId, key, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [key]: value } : item
      )
    );
  };

  const toggleItemSelection = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [
            ...prev,
            { ...item, qty: 1, satuan: "pcs", mention: "", keterangan: "" },
          ]
    );
  };

  const vendor = vendors.find((v) => v.id === parseInt(formData.idVendor));

  const totalHarga = selectedItems.reduce((total, item) => {
    const harga = vendor?.materials.find((m) => m.id === item.id)?.price || 0;
    return total + harga * item.qty;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nomorCO, lokasiCO, tanggalCO, idPL, idVendor } = formData;

    if (!nomorCO || !lokasiCO || !tanggalCO || !idPL || !idVendor) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Semua kolom harus diisi!",
      });
      return;
    }

    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Pilih minimal 1 barang!",
      });
      return;
    }

    for (const item of selectedItems) {
      if (!item.qty || item.qty <= 0 || !item.satuan) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Pastikan setiap barang memiliki qty > 0 dan satuan!",
        });
        return;
      }
    }

    const payload = {
      nomorCO,
      tanggalCO,
      lokasiCO,
      permintaanId: parseInt(idPL),
      items: selectedItems.map((item) => {
        const originalMaterial = filteredItems.find(
          (mat) => mat.id === item.id
        );
        return {
          materialId: item.id,
          qty: Number(item.qty),
          satuan: item.satuan || "pcs",
          code: item.code || originalMaterial?.code || "N/A",
          status: "PENDING",
          keterangan: item.keterangan || "-",
        };
      }),
    };

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/confirmation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Confirmation Order berhasil ditambahkan!",
        });
        router.back();
      } else {
        const err = await response.json();
        console.error("Gagal menambah Confirmation Order:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menambah Confirmation Order!",
        });
      }
    } catch (error) {
      console.error("Server error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan pada server.",
      });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Confirmation Order</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 shadow-md rounded-lg"
        >
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <InputField
              label="Nomor CO"
              name="nomorCO"
              value={formData.nomorCO}
              onChange={handleChange}
              required
            />
            <TextareaField
              label="Lokasi CO"
              name="lokasiCO"
              value={formData.lokasiCO}
              onChange={handleChange}
              required
            />
            <InputField
              type="date"
              label="Tanggal CO"
              name="tanggalCO"
              value={formData.tanggalCO}
              onChange={handleChange}
              required
            />

              <ClientOnlySelect
                options={permintaanLapangan.map((pl) => ({
                  value: pl.id,
                  label: pl.nomor,
                }))}
                value={
                  permintaanLapangan
                    .map((pl) => ({
                      value: pl.id,
                      label: pl.nomor,
                    }))
                    .find((option) => option.value === formData.idPL) || null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    idPL: selected?.value || "",
                  }))
                }
                placeholder="Permintaan Lapangan"
                label={"Pilih No PL"}
              />
          </div>
          {/* Tabel Detail PL */}
          {formData.idPL && <DetailTable allItems={allItems} />}

          {/* Pilih Vendor */}
          {formData.idPL && (
              <ClientOnlySelect
                options={vendors.map((vd) => ({
                  value: vd.id,
                  label: vd.name,
                }))}
                value={
                  vendors
                    .map((vd) => ({
                      value: vd.id,
                      label: vd.nama,
                    }))
                    .find((option) => option.value === formData.idVendor) ||
                  null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    idVendor: selected?.value || "",
                  }))
                }
                placeholder="Pilih salah satu Vendor"
                label={"Plih Vendor"}
              />
          )}

          {/* Pilih Barang */}
          {formData.idVendor && (
            <ItemSelector
              filteredItems={filteredItems}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
              handleItemDetailChange={handleItemDetailChange}
            />
          )}

          {/* Tombol Simpan */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Simpan
            </button>
            <div className="font-bold">
              Total: Rp {totalHarga.toLocaleString()}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Components

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border px-4 h-10 w-full rounded-md"
        required={required}
      />
    </div>
  );
}

function TextareaField({ label, name, value, onChange, required = false }) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="border px-4 py-2 w-full"
        rows="4"
        required={required}
      />
    </div>
  );
}

// function SelectField({ label, name, value, onChange, options }) {
//   return (
//     <div>
//       <label className="block font-medium">{label}</label>
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="border px-4 py-2 w-full"
//         required
//       >
//         <option value="">Pilih {label}</option>
//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
function ClientOnlySelect({ options, value, onChange, placeholder, label }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <label className="block font-medium">{label}</label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // className="border px-4 py-2 w-full"
        classNames={{
          control: () => 'border h-10',
          menu: () => 'bg-white shadow-md',
          option: ({ isSelected, isFocused }) =>
            ` ${isSelected ? 'bg-blue-500 text-white' : isFocused ? 'bg-blue-100' : ''}`,
        }}
        required
      />
    </div>
  );
}

function DetailTable({ allItems }) {
  return (
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
  );
}

function ItemSelector({
  filteredItems,
  selectedItems,
  toggleItemSelection,
  handleItemDetailChange,
}) {
  return (
    <div className="border-b pb-4">
      <label className="block font-medium">Pilih Barang:</label>
      {filteredItems.length > 0 ? (
        <ul className="space-y-4">
          {filteredItems.map((item) => {
            const selected = selectedItems.find((i) => i.id === item.id);
            return (
              <li key={item.id} className="border p-4 rounded-md">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => toggleItemSelection(item)}
                  />
                  <span className="font-medium">{item.name}</span>
                </label>
                {selected && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <InputField
                      label="Qty"
                      type="number"
                      value={selected.qty}
                      onChange={(e) =>
                        handleItemDetailChange(
                          item.id,
                          "qty",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <InputField
                      label="Satuan"
                      value={selected.satuan}
                      onChange={(e) =>
                        handleItemDetailChange(
                          item.id,
                          "satuan",
                          e.target.value
                        )
                      }
                    />
                    <InputField
                      label="Kode Barang"
                      value={selected.code || ""}
                      onChange={(e) =>
                        handleItemDetailChange(item.id, "code", e.target.value)
                      }
                    />
                    <InputField
                      label="Mention"
                      value={selected.mention || ""}
                      onChange={(e) =>
                        handleItemDetailChange(
                          item.id,
                          "mention",
                          e.target.value
                        )
                      }
                    />
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                      alt={item.image}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                    <TextareaField
                      label="Keterangan"
                      value={selected.keterangan || ""}
                      onChange={(e) =>
                        handleItemDetailChange(
                          item.id,
                          "keterangan",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-red-500">
          Tidak ada barang tersedia untuk vendor ini.
        </p>
      )}
    </div>
  );
}

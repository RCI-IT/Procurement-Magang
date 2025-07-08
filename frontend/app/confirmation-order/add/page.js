"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Swal from "sweetalert2";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";
import { checkDuplicate } from "@/utils/duplicate-check";

// ======================== Main Component ========================

export default function AddConfirmationOrder() {
  const [formData, setFormData] = useState({
    nomorCO: "",
    lokasiCO: "",
    idPL: "",
    tanggalCO: "",
    vendorId: "",
  });

  const [permintaanLapangan, setPermintaanLapangan] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const getData = useCallback(async () => {
    try {
      const [permintaanData, vendorsData] = await Promise.all([
        fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/permintaan`,
          token,
          setToken,
          () => router.push("/login")
        ),
        fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/vendors`,
          token,
          setToken,
          () => router.push("/login")
        ),
      ]);
      setPermintaanLapangan(permintaanData);
      setVendors(vendorsData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }, [token, setToken, router]);

  useEffect(() => {
    if (token) getData();
  }, [token, getData]);

  useEffect(() => {
    const selectedPL = permintaanLapangan.find(
      (pl) => pl.id === parseInt(formData.idPL)
    );
    setAllItems(selectedPL?.detail || []);
    setSelectedItems([]);

    const selectedVendor = vendors.find(
      (v) => v.id === parseInt(formData.vendorId)
    );
    setFilteredItems(selectedVendor?.materials || []);
  }, [formData.idPL, formData.vendorId, permintaanLapangan, vendors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, selected) => {
    setFormData((prev) => ({ ...prev, [field]: selected?.value || "" }));
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

  const handleItemDetailChange = (itemId, key, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [key]: value } : item
      )
    );
  };

  const vendor = vendors.find((v) => v.id === parseInt(formData.vendorId));
  const totalHarga = selectedItems.reduce((total, item) => {
    const harga = vendor?.materials.find((m) => m.id === item.id)?.price || 0;
    return total + harga * item.qty;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nomorCO, lokasiCO, tanggalCO, idPL, vendorId } = formData;

    if (
      !nomorCO ||
      !lokasiCO ||
      !tanggalCO ||
      !idPL ||
      !vendorId ||
      selectedItems.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Semua kolom dan barang harus diisi!",
      });
      return;
    }

    for (const item of selectedItems) {
      if (!item.qty || item.qty <= 0 || !item.satuan) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Pastikan qty & satuan valid!",
        });
        return;
      }
    }

    const payload = {
      nomorCO,
      tanggalCO,
      lokasiCO,
      permintaanId: parseInt(idPL),
      vendorId,
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
    const duplicate = await checkDuplicate("confirmation", { nomorCO });
    if (duplicate.nomorCO) {
      Swal.fire({
        icon: "warning",
        title: "Duplikat Data",
        text: "Kode Confirmation Order tersebut sudah terdaftar.",
      });
      return;
    }

    console.log(payload)

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
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menambah Confirmation Order!",
        });
      }
    } catch (error) {
      console.log(error);
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
              label="Pilih No PL"
              options={permintaanLapangan.map((pl) => ({
                value: pl.id,
                label: pl.nomor,
              }))}
              value={permintaanLapangan.find(
                (pl) => pl.id === parseInt(formData.idPL)
              )}
              onChange={(selected) => handleSelectChange("idPL", selected)}
              placeholder="Pilih Permintaan Lapangan"
            />
          </div>

          {formData.idPL && <DetailTable allItems={allItems} />}

          {formData.idPL && (
            <ClientOnlySelect
              label="Pilih Vendor"
              options={vendors.map((vd) => ({ value: vd.id, label: vd.name }))}
              value={vendors.find(
                (vd) => vd.id === parseInt(formData.vendorId)
              )}
              onChange={(selected) => handleSelectChange("vendorId", selected)}
              placeholder="Pilih Vendor"
            />
          )}

          {formData.vendorId && (
            <ItemSelector
              filteredItems={filteredItems}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
              handleItemDetailChange={handleItemDetailChange}
            />
          )}

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

// ======================== Reusable Components ========================

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

function ClientOnlySelect({ label, options, value, onChange, placeholder }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div>
      <label className="block font-medium">{label}</label>
      <Select
        options={options}
        value={
          value ? { value: value.id, label: value.nomor || value.name } : null
        }
        onChange={onChange}
        placeholder={placeholder}
        classNames={{
          control: () => "border h-10",
          menu: () => "bg-white shadow-md",
          option: ({ isSelected, isFocused }) =>
            `${
              isSelected
                ? "bg-blue-500 text-white"
                : isFocused
                ? "bg-blue-100"
                : ""
            }`,
        }}
      />
    </div>
  );
}

function DetailTable({ allItems }) {
  return (
    <div className="border-b pb-4">
      <h3 className="font-semibold">Detail Permintaan Lapangan</h3>
      <table className="w-full border rounded overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Kode Barang</th>
            <th className="px-4 py-2">Nama Barang</th>
            <th className="px-4 py-2 text-right">Qty</th>
          </tr>
        </thead>
        <tbody>
          {allItems.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.code}</td>
              <td className="border px-4 py-2">{item.materialName}</td>
              <td className="border px-4 py-2 text-right">{item.qty}</td>
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
                      onChange={(e) => {
                        const val = e.target.value;
                        const parsed = parseInt(val);
                        handleItemDetailChange(item.id, "qty", val === "" ? "" : isNaN(parsed) ? 0 : parsed);
                      }}
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
                      className="w-32 h-32 object-cover mx-auto"
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

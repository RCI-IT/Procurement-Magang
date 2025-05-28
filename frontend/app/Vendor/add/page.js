"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchWithAuth } from "../../../services/apiClient";

export default function AddVendorPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validasi khusus input angka untuk phone
    if (name === "phone") {
      const onlyNums = value.replace(/\D/g, "");
      setForm({ ...form, phone: onlyNums });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sebelum kirim
    if (!form.name || !form.address || !form.city || !form.phone) {
      return Swal.fire("Oops!", "Semua field wajib diisi", "warning");
    }

    if (form.phone.length < 10 || form.phone.length > 13) {
      return Swal.fire("Nomor tidak valid", "Gunakan 10-13 digit angka", "warning");
    }

    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/vendors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menambahkan vendor");

      Swal.fire("Berhasil!", "Vendor berhasil ditambahkan", "success");
      router.push("/vendor");
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data", "error");
    }
  };

  const handleCancel = () => {
    router.push("/vendor");
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Tambah Vendor</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block">Nama</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block">Alamat</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block">Kota</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block">No Telepon</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              maxLength={13}
              className="border rounded px-3 py-2 w-full"
              placeholder="Contoh: 081234567890"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white rounded px-4 py-2 w-32"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2 w-32"
            >
              Simpan
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

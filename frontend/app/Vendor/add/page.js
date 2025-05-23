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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      Swal.fire("Gagal!", "Terjadi kesalahan", "error");
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
            />
          </div>
          <div>
            <label className="block">No Telepon</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
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

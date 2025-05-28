"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchWithToken } from "../../../../services/fetchWithToken";
import { fetchWithAuth } from "../../../../services/apiClient";

export default function EditVendorPage() {
  const { id: vendorId } = useParams();
  const router = useRouter();

  const [vendor, setVendor] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const vendorData = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`,
          token,
          setToken,
          () => router.push("/login")
        );

        if (!vendorData) throw new Error("Data tidak ditemukan");
        setVendor(vendorData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNums = value.replace(/\D/g, ""); // hanya angka
      setVendor({ ...vendor, phone: onlyNums });
    } else {
      setVendor({ ...vendor, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!vendor.name || !vendor.address || !vendor.city || !vendor.phone) {
      return Swal.fire("Oops!", "Semua field wajib diisi", "warning");
    }

    if (vendor.phone.length < 10 || vendor.phone.length > 13) {
      return Swal.fire("Nomor tidak valid", "Gunakan 10-13 digit angka", "warning");
    }

    try {
      const result = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin menyimpan perubahan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, simpan",
        cancelButtonText: "Batal",
      });

      if (!result.isConfirmed) return;

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vendor),
        }
      );

      if (!res.ok) throw new Error("Gagal memperbarui vendor");

      await Swal.fire({
        title: "Berhasil!",
        text: "Vendor berhasil diperbarui.",
        icon: "success",
        confirmButtonText: "OK",
      });

      router.push(`/vendor/${vendorId}`);
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui vendor.", "error");
    }
  };

  if (loading) return <p className="text-center text-blue-500">Memuat data...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6 space-y-6">
        <div className="bg-white shadow-md p-6 rounded-md max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Edit Vendor</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nama</label>
              <input
                name="name"
                value={vendor.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Alamat</label>
              <input
                name="address"
                value={vendor.address}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Kota</label>
              <input
                name="city"
                value={vendor.city}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Telepon</label>
              <input
                name="phone"
                value={vendor.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                required
                maxLength={13}
                placeholder="081234567890"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

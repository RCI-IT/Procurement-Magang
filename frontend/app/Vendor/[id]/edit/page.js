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

  const getData = async () => {
    const vendorData = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`,
      token,
      setToken,
      () => router.push("/login")
    );

    if (vendorData) setVendor(vendorData);
    setError(null)
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [token]);

  const fetchData = () => {
    getData();
  };

  // useEffect(() => {
  //   const fetchVendor = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorId}`
  //       );
  //       if (!res.ok) throw new Error("Gagal mengambil data vendor");
  //       const data = await res.json();
  //       setVendor(data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (vendorId) fetchVendor();
  // }, [vendorId]);

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin menyimpan perubahan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, simpan",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
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
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat memperbarui vendor.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6 space-y-6">
        <br></br>

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

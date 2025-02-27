'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VendorPage() {
  const params = useParams(); // Menggunakan useParams()
  const vendorId = params.id; // Ambil ID dari params
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch(`http://192.168.110.204:5000/vendors/${vendorId}`);
        if (!res.ok) throw new Error("Gagal mengambil data vendor");

        const data = await res.json();
        setVendor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchVendor();
  }, [vendorId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{vendor?.name}</h1>
      <p className="text-lg mt-2">Alamat: {vendor?.address || "Tidak tersedia"}</p>
      <p className="text-lg">Kontak: {vendor?.contact || "Tidak tersedia"}</p>
      <button onClick={() => router.back()} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Kembali
      </button>
    </div>
  );
}

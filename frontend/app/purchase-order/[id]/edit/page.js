"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/component/sidebar";
import Header from "@/component/Header";
import Swal from "sweetalert2";

export default function EditPurchaseOrder() {
  const { id } = useParams();
  const router = useRouter();

  const [poData, setPoData] = useState({
    nomorPO: "",
    tanggalPO: "",
    lokasiPO: "",
    poDetails: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPO = async () => {
      try {
        const res = await fetch(`http://192.168.110.204:5000/purchase/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();

        setPoData({
          nomorPO: data.nomorPO || "",
          tanggalPO: data.tanggalPO ? data.tanggalPO.split("T")[0] : "",
          lokasiPO: data.lokasiPO || "",
          poDetails: Array.isArray(data.poDetails) ? data.poDetails : [],
        });
      } catch (error) {
        console.error("Error fetching PO:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPO();
  }, [id]);

  const handleChange = (e, field) => {
    setPoData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    setPoData((prev) => {
      const updatedItems = [...prev.poDetails];
  
      if (field === "material.price") {
        // Jika yang diubah adalah harga material
        updatedItems[index] = {
          ...updatedItems[index],
          permintaanDetail: {
            ...updatedItems[index].permintaanDetail,
            material: {
              ...updatedItems[index].permintaanDetail.material,
              price: value, // Update harga
            },
          },
        };
      } else {
        // Jika yang diubah adalah field lain seperti qty atau satuan
        updatedItems[index] = {
          ...updatedItems[index],
          permintaanDetail: {
            ...updatedItems[index].permintaanDetail,
            [field]: value,
          },
        };
      }
  
      return { ...prev, poDetails: updatedItems };
    });
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const bodyData = {
      nomorPO: poData.nomorPO,
      tanggalPO: poData.tanggalPO,
      lokasiPO: poData.lokasiPO,
      status: "Pending", // Sesuaikan dengan kebutuhan backend
      poDetails: poData.poDetails.map((detail) => ({
        id: detail.id, // Pastikan ID item tetap ada
        qty: detail.permintaanDetail.qty,
        satuan: detail.permintaanDetail.satuan,
        material: {
          price: detail.permintaanDetail.material.price,
        },
      })),
    };
    
    console.log("Data yang dikirim ke backend:", bodyData);
    
  
    try {
      const response = await fetch(`http://192.168.110.204:5000/purchase/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
  
      const responseData = await response.json();
      console.log("Response dari server:", responseData); // Debugging
  
      if (response.ok) {
        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil diperbarui.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#2563eb",
        }).then(() => {
          router.back();
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal memperbarui data.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };
  
  
  
  if (loading) return <p className="text-center text-gray-600">Memuat data...</p>;
  if (!poData.nomorPO) return <p className="text-center text-red-600">Data tidak ditemukan</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full max-w-4xl mx-auto px-8 py-6">
        <Header username="Admin" />
        <h2 className="text-xl font-bold text-blue-900 mb-4">Edit Purchase Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nomor PO</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={poData.nomorPO}
              onChange={(e) => handleChange(e, "nomorPO")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tanggal PO</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={poData.tanggalPO}
              onChange={(e) => handleChange(e, "tanggalPO")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Lokasi PO</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={poData.lokasiPO}
              onChange={(e) => handleChange(e, "lokasiPO")}
            />
          </div>

          <h3 className="text-lg font-bold text-blue-900 mt-6 mb-2">Daftar Barang</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2">No</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Nama Barang</th>
                <th className="border p-2">Harga</th>
                <th className="border p-2">QTY</th>
                <th className="border p-2">Satuan</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {poData.poDetails.length > 0 ? (
                poData.poDetails.map((poItem, index) => {
                  const item = poItem.permintaanDetail;
                  const harga = item?.material?.price || 0;
                  const qty = item?.qty || 0;
                  const total = harga * qty; // Pastikan tidak NaN

                  return (
                    <tr key={index} className="border">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{item?.code || "N/A"}</td>
                      <td className="border p-2">{item?.material?.name || "N/A"}</td>
                      <td className="border p-2">
  <input
    type="number"
    className="w-full border rounded p-1"
    value={harga}
    onChange={(e) => handleItemChange(index, "material.price", parseFloat(e.target.value) || 0)}
  />
</td>
<td className="border p-2">
  <input
    type="number"
    className="w-full border rounded p-1"
    value={qty}
    onChange={(e) => handleItemChange(index, "qty", parseInt(e.target.value) || 0)}
  />
</td>
<td className="border p-2">
  <input
    type="text"
    className="w-full border rounded p-1"
    value={item?.satuan || ""}
    onChange={(e) => handleItemChange(index, "satuan", e.target.value)}
  />
</td>

                      <td className="border p-2 font-bold text-right">
                        Rp{total.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    Tidak ada item
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Simpan
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

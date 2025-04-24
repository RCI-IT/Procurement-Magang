"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/component/sidebar";
import Header from "@/component/Header";
import Swal from "sweetalert2";

export default function EditPurchaseOrder() {
  const { id } = useParams();
  const router = useRouter();

  const [CoData, setCoData] = useState({
    nomorCO: "",
    tanggalCO: "",
    lokasiCO: "",
    confirmationDetails: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPO = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirmation/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();

        setCoData({
          nomorCO: data.nomorCO || "",
          tanggalCO: data.tanggalCO ? data.tanggalCO.split("T")[0] : "",
          lokasiCO: data.lokasiCO || "",
          confirmationDetails: Array.isArray(data.confirmationDetails) ? data.confirmationDetails : [],
        });
      } catch (error) {
        console.error("Error fetching CO:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPO();
  }, [id]);

  const handleChange = (e, field) => {
    setCoData((prev) => ({ ...prev, [field]: e.target.value }));
  };

const handleItemChange = (index, field, value) => {
  console.log(`Mengubah ${field} pada index ${index} menjadi: ${value}`);

  setCoData((prev) => {
    const updatedItems = [...prev.confirmationDetails];
    const updatedItem = { ...updatedItems[index] };

    if (field === "qty" || field === "satuan") {
      updatedItem.permintaanDetail = {
        ...updatedItem.permintaanDetail,
        [field]: value,
      };
    }

    updatedItems[index] = updatedItem;

    console.log("Updated CoData:", { ...prev, confirmationDetails: updatedItems });

    return { ...prev, confirmationDetails: updatedItems };
  });
};

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      nomorCO: CoData.nomorCO,
      tanggalCO: CoData.tanggalCO,
      lokasiCO: CoData.lokasiCO,
      status: "Pending",
      confirmationDetails: CoData.confirmationDetails.map((detail) => ({
        id: detail.id,
        permintaanDetailId: detail.permintaanDetail.id,
        qty: detail.permintaanDetail.qty,
        satuan: detail.permintaanDetail.satuan,
        code: detail.permintaanDetail.code,
        keterangan: detail.permintaanDetail.keterangan || "",
      })),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirmation/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

     // Ganti:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const responseData = await response.json();


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
  if (!CoData.nomorCO) return <p className="text-center text-red-600">Data tidak ditemukan</p>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full max-w-4xl mx-auto px-8 py-6">
        <Header username="Admin" />
        <h2 className="text-xl font-bold text-blue-900 mb-4">Edit Confirmation Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nomor CO</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={CoData.nomorCO}
              onChange={(e) => handleChange(e, "nomorCO")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tanggal CO</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={CoData.tanggalCO}
              onChange={(e) => handleChange(e, "tanggalCO")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Lokasi CO</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={CoData.lokasiCO}
              onChange={(e) => handleChange(e, "lokasiCO")}
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
              {CoData.confirmationDetails.length > 0 ? (
                CoData.confirmationDetails.map((poItem, index) => {
                  const item = poItem.permintaanDetail;
                  const harga = item?.material?.price || 0;
                  const qty = item?.qty || 0;
                  const total = harga * qty;

                  return (
                    <tr key={index} className="border">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{item?.code || "N/A"}</td>
                      <td className="border p-2">{item?.material?.name || "N/A"}</td>
                      <td className="border p-2">Rp {harga.toLocaleString("id-ID")}</td>
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
                      <td className="border p-2 font-bold text-right">Rp {total.toLocaleString("id-ID")}</td>
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
              <tr>
                <td colSpan={6} className="text-right font-bold p-2">Total Keseluruhan</td>
                <td className="text-right font-bold p-2">
                  Rp {CoData.confirmationDetails.reduce((sum, detail) => {
                    const price = detail.permintaanDetail.material?.price || 0;
                    const qty = detail.permintaanDetail.qty || 0;
                    return sum + price * qty;
                  }, 0).toLocaleString("id-ID")}
                </td>
              </tr>
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

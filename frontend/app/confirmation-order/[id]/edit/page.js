"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchWithToken } from "@/services/fetchWithToken";
import { fetchWithAuth } from "@/services/apiClient";

export default function EditPurchaseOrder() {
  const { id } = useParams();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [coData, setCoData] = useState({
    nomorCO: "",
    tanggalCO: "",
    lokasiCO: "",
    confirmationDetails: [],
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!id || !token) return;

    const fetchCO = async () => {
      try {
        const data = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/confirmation/${id}`,
          token,
          setToken,
          () => router.push("/login")
        );

        if (!data) throw new Error("Data CO tidak ditemukan");

        setCoData({
          nomorCO: data.nomorCO || "",
          tanggalCO: data.tanggalCO ? data.tanggalCO.split("T")[0] : "",
          lokasiCO: data.lokasiCO || "",
          confirmationDetails: Array.isArray(data.confirmationDetails)
            ? data.confirmationDetails
            : [],
        });
      } catch (error) {
        console.error("Gagal mengambil data CO:", error);
        Swal.fire("Error", "Gagal mengambil data dari server.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCO();
  }, [id, token]);

  const handleChange = (e, field) => {
    setCoData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleItemChange = (index, field, value) => {
    setCoData((prev) => {
      const updatedDetails = prev.confirmationDetails.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prev, confirmationDetails: updatedDetails };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      nomorCO: coData.nomorCO,
      tanggalCO: coData.tanggalCO,
      lokasiCO: coData.lokasiCO,
      status: "Pending",
      confirmationDetails: coData.confirmationDetails.map((detail) => ({
        id: detail.id,
        confirmationDetailId: detail?.id,
        qty: detail?.qty || 0,
        satuan: detail.satuan || "",
        code: detail?.code || "",
        keterangan: detail?.keterangan || "",
      })),
    };

    try {
      console.log(bodyData);
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/confirmation/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );

      if (res) {
        Swal.fire("Berhasil!", "Data berhasil diperbarui.", "success").then(
          () => router.back()
        );
      } else {
        Swal.fire("Gagal!", "Gagal memperbarui data.", "error");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Memuat data...</p>;
  if (!coData.nomorCO)
    return <p className="text-center text-red-600">Data tidak ditemukan</p>;

  return (
    <div className="flex h-screen">
      <div className="w-full max-w-4xl mx-auto px-8 py-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Edit Confirmation Order
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nomor CO</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={coData.nomorCO}
              onChange={(e) => handleChange(e, "nomorCO")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tanggal CO</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={coData.tanggalCO}
              onChange={(e) => handleChange(e, "tanggalCO")}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Lokasi CO</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={coData.lokasiCO}
              onChange={(e) => handleChange(e, "lokasiCO")}
            />
          </div>

          <h3 className="text-lg font-bold text-blue-900 mt-6 mb-2">
            Daftar Barang
          </h3>
          <table className="w-full border-collapse border border-gray-300 text-sm">
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
              {coData.confirmationDetails.length > 0 ? (
                coData.confirmationDetails.map((detail, index) => {
                  const item = detail.material || {};
                  const price = item?.price || 0;
                  const qty = detail.qty || 0;
                  const total = price * qty;

                  return (
                    <tr key={index}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">
                        {detail.code || "N/A"}
                      </td>
                      <td className="border p-2">
                        {detail.material?.name || "N/A"}
                      </td>
                      <td className="border p-2 text-right">
                        Rp {price.toLocaleString("id-ID")}
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full border rounded p-1"
                          value={qty}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "qty",
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full border rounded p-1"
                          value={detail.satuan || ""}
                          onChange={(e) =>
                            handleItemChange(index, "satuan", e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-2 text-right font-bold">
                        Rp {total.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    Tidak ada item
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="6" className="text-right font-bold p-2">
                  Total Keseluruhan
                </td>
                <td className="text-right font-bold p-2">
                  Rp{" "}
                  {coData.confirmationDetails
                    .reduce((acc, detail) => {
                      const price = detail?.material?.price || 0;
                      const qty = detail?.qty || 0;
                      return acc + price * qty;
                    }, 0)
                    .toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

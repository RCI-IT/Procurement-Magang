"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import "@/styles/globals.css";
import { fetchWithToken } from "../../../services/fetchWithToken";

export default function DetailPurchaseOrder() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [PurchaseDetails, setPoDetail] = useState(null);
  const [token, setToken] = useState(null);
  const [dataSign, setSign] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setTimeout(() => router.push("/login"), 800);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error("User JSON parse error:", error);
      router.push("/login");
    }
  }, [router]);

  const parseDate = (dateString) => {
    if (!dateString) return { day: "-", month: "-", year: "-" };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: "-", month: "-", year: "-" };

    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return { day, month, year };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setTimeout(() => {
      const element = document.getElementById("purchase-order");
      const backButton = document.getElementById("back-button");

      if (!element) {
        console.error("Element not found!");
        return;
      }

      if (backButton) backButton.style.visibility = "hidden";

      element.classList.add("pdf-format");

      html2pdf()
        .set({
          margin: 10,
          filename: `purchase-order-${id || "unknown"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save()
        .then(() => {
          element.classList.remove("pdf-format");
          if (backButton) backButton.style.visibility = "visible";
        });
    }, 500);
  };

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const result = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/purchase/${id}`,
          token,
          setToken,
          () => router.push("/login")
        );
        if (result) {
          setData(result);
          setPoDetail(result);
        } else {
          router.push("/purchase-order");
        }

        const res = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/signing/PL/${id}`,
          token,
          setToken,
          () => router.push("/login")
        );

        if (res && res.signatures) {
          setSign(res.signatures);
          console.log("ISI dataSign:", res.signatures);
        }
      } catch (error) {
        console.error("Gagal mengambil data purchase order:", error);
        router.push("/purchase-order");
      }
    };
    fetchData();
  }, [id, router]);

  if (!data)
    return (
      <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>
    );

  const { day, month, year } = parseDate(data?.tanggalPO);

  const terbilang = (angka) => {
    const satuan = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Sembilan",
    ];
    const belasan = [
      "Sepuluh",
      "Sebelas",
      "Dua Belas",
      "Tiga Belas",
      "Empat Belas",
      "Lima Belas",
      "Enam Belas",
      "Tujuh Belas",
      "Delapan Belas",
      "Sembilan Belas",
    ];
    const puluhan = [
      "",
      "",
      "Dua Puluh",
      "Tiga Puluh",
      "Empat Puluh",
      "Lima Puluh",
      "Enam Puluh",
      "Tujuh Puluh",
      "Delapan Puluh",
      "Sembilan Puluh",
    ];
    const ribuan = ["", "Ribu", "Juta", "Miliar", "Triliun"];

    if (angka === 0) return "Nol Rupiah";

    const konversi = (num) => {
      if (num < 10) return satuan[num];
      if (num < 20) return belasan[num - 10];
      if (num < 100)
        return puluhan[Math.floor(num / 10)] + " " + satuan[num % 10];
      if (num < 1000)
        return satuan[Math.floor(num / 100)] + " Ratus " + konversi(num % 100);
      return "";
    };

    let hasil = "";
    let i = 0;

    while (angka > 0) {
      let bagian = angka % 1000;
      if (bagian > 0) {
        hasil = konversi(bagian) + " " + ribuan[i] + " " + hasil;
      }
      angka = Math.floor(angka / 1000);
      i++;
    }

    return hasil.trim() + " Rupiah";
  };

  const totalHarga =
    PurchaseDetails?.purchaseDetails?.reduce((sum, poItem) => {
      const material = poItem.material;
      const harga = material?.price || 0;
      const qty = poItem.qty || 0;
      return sum + harga * qty;
    }, 0) || 0;

  const getSignatureByRole = (role) => {
    return dataSign.find((sig) => sig.role === role);
  };

  const handleSign = async (signingRole) => {
    setLoadingButton(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/signing`;

      const payload = {
        userId: user?.id,
        fileType: "PURCHASE_ORDER",
        relatedId: id,
        role: signingRole,
      };

      const result = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log(payload);
      console.log(result);
      if (result) {
        Swal.fire({
          icon: "success",
          title: "Berhasil Tanda Tangan",
          text: result.message || "Tanda tangan berhasil disimpan.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error saat tanda tangan:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.message || "Terjadi kesalahan saat menyimpan tanda tangan.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        <div className="flex justify-end space-x-2 no-print">
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-32"
          >
            Cetak
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-32"
          >
            Simpan PDF
          </button>
        </div>

        <div
          id="purchase-order"
          className="print-container mx-auto bg-white rounded-lg p-6"
        >
          <div className="border-b-4 border-blue-600 mt-4">
            <div className="flex justify-between items-center pb-3">
              <h1 className="text-lg font-bold text-blue-900 uppercase">
                Reka Cipta Inovasi
              </h1>
              <h2 className="text-lg font-bold text-blue-900 uppercase">
                Purchase Order
              </h2>
              <div className="border border-gray-300 text-sm">
                <table className="border-collapse w-full">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-semibold">
                        Tanggal Purchase Order
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {day} {month} {year}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-semibold">
                        Nomor Purchase Order
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {data.nomorPO}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-semibold">
                        Lokasi Purchase Order
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {data.lokasiPO}
                      </td>
                    </tr>
                    {data.keterangan && (
                      <tr>
                        <td className="border border-gray-300 px-2 py-1 font-semibold">
                          Keterangan
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {data.keterangan}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <br />
          <table className="w-full border-collapse mt-4 text-sm border border-gray-300">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="border p-2" rowSpan={2}>
                  No.
                </th>
                <th className="border p-2" rowSpan={2}>
                  Code
                </th>
                <th className="border p-2" rowSpan={2}>
                  Nama Barang
                </th>
                <th className="border p-2" rowSpan={2}>
                  Harga
                </th>
                <th className="border p-2 w-12" colSpan="2">
                  Permintaan
                </th>
                <th className="border p-2 w-35" rowSpan={2}>
                  Total
                </th>
              </tr>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2 w-12">QTY</th>
                <th className="border p-2 w-12">Satuan</th>
              </tr>
            </thead>

            <tbody>
              {PurchaseDetails?.purchaseDetails?.length > 0 ? (
                PurchaseDetails.purchaseDetails.map((item, index) => {
                  const material = item.material;
                  const harga = material?.price || 0;
                  const total = item.qty * harga;

                  return (
                    <tr key={index}>
                      <td className="border px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border px-4 py-2">{item.code}</td>
                      <td className="border px-4 py-2">
                        {material?.name || "N/A"}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        Rp{harga.toLocaleString()}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {item.qty}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {item.satuan || "N/A"}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        Rp{total.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-4">
                    Tidak ada data
                  </td>
                </tr>
              )}
              <tr className="font-semibold">
                <td
                  colSpan="4"
                  className="bg-blue-600 text-white p-2 text-left"
                >
                  Terbilang
                </td>
                <td colSpan="2" rowSpan={2} className="p-2 text-center border">
                  TOTAL
                </td>
                <td colSpan="1" rowSpan={2} className="p-2 text-center border">
                  Rp{totalHarga.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="4"
                  className="border p-2 text-gray-800 bg-white italic text-left"
                >
                  {terbilang(totalHarga) || "-"}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full border mt-6">
            <tbody>
              <tr className="text-center">
                <td
                  colSpan={3}
                  className="bg-gray-300 font-semibold border p-2"
                >
                  PT.REKA CIPTA INOVASI
                </td>
                <td
                  rowSpan={2}
                  className="bg-gray-300 font-semibold border p-2"
                >
                  Vendor
                </td>
              </tr>
              <tr className="text-center">
                <td className="bg-gray-300 font-semibold border p-2">Dibuat</td>
                <td className="bg-gray-300 font-semibold border p-2">
                  Diperiksa
                </td>
                <td className="bg-gray-300 font-semibold border p-2">
                  Disetujui
                </td>
              </tr>
              <tr>
                <td className="border-b-0 border h-24 w-1/4">
                  {getSignatureByRole("PURCHASING")?.qrCode && (
                    <img
                      src={getSignatureByRole("PURCHASING").qrCode}
                      alt="QR PM"
                      className="mx-auto w-24"
                    />
                  )}
                </td>
                <td className="border-b-0 border h-24 w-1/4">
                  {getSignatureByRole("PURCHASING")?.qrCode && (
                    <img
                      src={getSignatureByRole("PURCHASING").qrCode}
                      alt="QR PM"
                      className="mx-auto w-24"
                    />
                  )}
                </td>
                <td className="border-b-0 border h-24 w-1/4">
                  {getSignatureByRole("PURCHASING")?.qrCode && (
                    <img
                      src={getSignatureByRole("PURCHASING").qrCode}
                      alt="QR PM"
                      className="mx-auto w-24"
                    />
                  )}
                </td>
                <td className="border-b-0 border h-24 w-1/4"></td>
              </tr>
              <tr className="text-center">
                <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">
                  {!getSignatureByRole("PURCHASING")
                    ? user?.authorities?.some(
                        (auth) =>
                          auth.fileType === "PURCHASE_ORDER" &&
                          auth.role.toUpperCase() === "PURCHASING"
                      ) && (
                        <button
                          onClick={() => handleSign("PURCHASING")}
                          disabled={loadingButton}
                          className="user-button-add"
                        >
                          {loadingButton ? "Memproses..." : "Isi Tanda tangan"}
                        </button>
                      )
                    : user?.fullName}
                </td>
                <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">
                  {!getSignatureByRole("FINANCE")
                    ? user?.authorities?.some(
                        (auth) =>
                          auth.fileType === "PURCHASE_ORDER" &&
                          auth.role.toUpperCase() === "FINANCE"
                      ) && (
                        <button
                          onClick={() => handleSign("FINANCE")}
                          disabled={loadingButton}
                          className="user-button-add"
                        >
                          {loadingButton ? "Memproses..." : "Isi Tanda tangan"}
                        </button>
                      )
                    : user?.fullName}
                </td>
                <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">
                  {!getSignatureByRole("DIREKSI")
                    ? user?.authorities?.some(
                        (auth) =>
                          auth.fileType === "PURCHASE_ORDER" &&
                          auth.role.toUpperCase() === "DIREKSI"
                      ) && (
                        <button
                          onClick={() => handleSign("DIREKSI")}
                          disabled={loadingButton}
                          className="user-button-add"
                        >
                          {loadingButton ? "Memproses..." : "Isi Tanda tangan"}
                        </button>
                      )
                    : user?.fullName}
                </td>
                <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">
                  Nama
                </td>
              </tr>
              <tr className="text-center bg-gray-300">
                <td className="border p-2">Purchasing</td>
                <td className="border p-2">Finance</td>
                <td className="border p-2">Direksi</td>
                <td className="border p-2">Vendor</td>
              </tr>
            </tbody>
          </table>

          <div id="back-button" className="text-right mt-6">
            <button
              onClick={() => router.push("/purchase-order")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 no-print"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

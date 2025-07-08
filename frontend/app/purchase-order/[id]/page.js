"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/styles/globals.css";
import { fetchWithAuth } from "@/services/apiClient";
import Image from "next/image";
import { capitalizeIndonesia } from "@/utils/capitalizeIndonesia";
import { terbilang } from "@/utils/terbilang";
import { pdf } from "@react-pdf/renderer";
import { PurchaseOrderPDF } from "./PurchaseOrderPDF";
import Swal from "sweetalert2";

export default function DetailPurchaseOrder() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [PurchaseDetails, setPoDetail] = useState(null);
  const [dataSign, setSign] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

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

  const handleGeneratePDF = async () => {
    setLoadingButton(true);
    try {
      const blob = await pdf(
        <PurchaseOrderPDF
          data={data}
          PurchaseDetails={PurchaseDetails}
          totalHarga={totalHarga}
          dataSign={dataSign}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank"); // <-- Langsung buka tab baru
    } catch (error) {
      console.error(error);
      alert("Gagal membuat PDF");
    } finally {
      setLoadingButton(false);
    }
  };

  const fetchData = async () => {
    try {
      const result = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/purchase/${id}`,
        {
          method: "GET",
        }
      );

      if (result) {
        const data = await result.json();
        setData(data);
        setPoDetail(data);
      } else {
        router.push("/purchase-order");
      }

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/signing/PURCHASE_ORDER/${id}`,
        {
          method: "GET",
        }
      );

      if (res) {
        const response = await res.json();
        setSign(response.signatures);
        console.log("ISI dataSign:", response.signatures);
      }
    } catch (error) {
      console.error("Gagal mengambil data purchase order:", error);
      router.push("/purchase-order");
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id, router]);

  if (!data)
    return (
      <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>
    );

  const { day, month, year } = parseDate(data?.tanggalPO);

  const totalHarga =
    PurchaseDetails?.purchaseDetails?.reduce((sum, poItem) => {
      const material = poItem.material;
      const harga = material?.price || 0;
      const qty = poItem.qty || 0;
      return sum + harga * qty;
    }, 0) || 0;

  const getSignatureByRole = (role) => {
    if (!Array.isArray(dataSign)) return null;

    const signature = dataSign.find((sig) => sig.role === role);
    return signature || null;
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

      if (!result) {
        throw new Error("Respon dari server kosong.");
      }

      if (result?.error) {
        throw new Error(result?.error || "Gagal menyimpan tanda tangan.");
      }

      const alertResult = await Swal.fire({
        icon: "success",
        title: "Berhasil Tanda Tangan",
        text: result?.message || "Tanda tangan berhasil disimpan.",
        confirmButtonText: "OK",
      });

      if (alertResult.isConfirmed) {
        fetchData();
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
        <div className="flex justify-end space-x-2 no-print p-6">
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-32"
          >
            Cetak
          </button>
          <button
            onClick={handleGeneratePDF}
            className="bg-red-500 text-white rounded hover:bg-red-600 px-4 py-2"
          >
            {loadingButton ? "Memproses…" : "Buat PDF"}
          </button>
          {/* <PDFDownloadLink
            document={
              <PurchaseOrderPDF
                data={data}
                PurchaseDetails={PurchaseDetails}
                totalHarga={totalHarga}
                dataSign={dataSign}
              />
            }
            fileName={`purchase-order-${data?.nomorPO}.pdf`}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-32 flex justify-center items-center"
          >
            {({ loading }) => (loading ? "Memproses…" : "Simpan PDF")}
          </PDFDownloadLink> */}
        </div>

        <div
          id="purchase-order"
          className="print-area print-container mx-auto bg-white rounded-lg p-6"
        >
          <div className="flex justify-between">
            <div>
              <Image
                src={`/assets/logo1.png`}
                alt="Logo"
                width={150}
                height={150}
                className="object-contain"
                unoptimized
                priority
              />
              <p className="text-blue-900 font-bold text-lg uppercase">
                PT. REKA CIPTA INOVASI
              </p>
              <p className="text-sm text-gray-700">
                Jl. Aluminium Perumahan Gatot Subroto Town House No. 5<br />
                Kel. Sei Sikambing C II, Kec. Medan Helvetia, Medan
                <br />
                Sumatera Utara, 20213
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-900 font-bold text-2xl uppercase">
                PURCHASE ORDER
              </p>
              <table className="border border-gray-300">
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 bg-gray-50 dark:bg-gray-800">
                      Tanggal
                    </td>
                    <td className="px-4">
                      {day} {month} {year}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 bg-gray-50 dark:bg-gray-800">
                      Nomor Purchase Order
                    </td>
                    <td className="px-4">{data.nomorPO}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 bg-gray-50 dark:bg-gray-800">
                      Nomor PL
                    </td>
                    <td className="px-4">
                      {data.confirmationOrder.permintaan?.nomor}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 bg-gray-50 dark:bg-gray-800">
                      Nomor Confirmation
                    </td>
                    <td className="px-4">{data.confirmationOrder.nomorCO}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 bg-gray-50 dark:bg-gray-800">
                      Nomor Kontrak
                    </td>
                    <td className="px-4"></td>
                  </tr>

                  {data.keterangan && (
                    <tr>
                      <td className="px-4 bg-gray-50 dark:bg-gray-800">
                        Keterangan
                      </td>
                      <td className="px-4 border border-gray-300 py-1">
                        {data.keterangan}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-blue-600 rounded overflow-hidden inline-block">
            {/* Header */}
            <div className="bg-blue-600 text-white font-bold p-2">SUPPLIER</div>

            {/* Konten */}
            <div className="bg-white p-3 space-y-1">
              <div className="flex">
                <div className="w-28 font-semibold">Name</div>
                <div>: {data.confirmationOrder?.vendor?.name}</div>
              </div>
              <div className="flex">
                <div className="w-28 font-semibold">Address</div>
                <div>
                  :
                  {capitalizeIndonesia(data.confirmationOrder?.vendor?.address)}
                  {data.confirmationOrder?.vendor?.address &&
                  data.confirmationOrder?.vendor?.city
                    ? ", "
                    : ""}
                  {capitalizeIndonesia(data.confirmationOrder?.vendor?.city)}
                </div>
              </div>
              <div className="flex">
                <div className="w-28 font-semibold">Phone</div>
                <div>: {data.confirmationOrder?.vendor?.phone}</div>
              </div>
              <div className="flex">
                <div className="w-28 font-semibold">Reference</div>
                <div>: </div>
              </div>
            </div>
          </div>

          <table className="border border-blue-600 rounded w-full table-auto">
            <thead>
              <tr className="bg-blue-600 text-white font-bold">
                <th className="border p-2 w-16" rowSpan={2}>
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
                <th className="border p-2" colSpan={2}>
                  Permintaan
                </th>
                <th className="border p-2" rowSpan={2}>
                  Total
                </th>
              </tr>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2">QTY</th>
                <th className="border p-2">Satuan</th>
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
                      <td className="border px-4 py-2 text-center w-16">
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
                  <td colSpan="7" className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
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
            </tfoot>
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

              {/* Baris QRCode */}
              <tr>
                {["PURCHASING", "FINANCE", "DIREKSI"].map((role) => {
                  const signature = getSignatureByRole(role);
                  return (
                    <td key={role} className="border-b-0 border h-24 w-1/4">
                      {signature?.qrCode && (
                        <img
                          src={signature.qrCode}
                          alt={`QR ${role}`}
                          className="mx-auto w-24"
                        />
                      )}
                    </td>
                  );
                })}
                <td className="border-b-0 border h-24 w-1/4"></td>
              </tr>

              {/* Baris Button / User Name */}
              <tr className="text-center">
                {["PURCHASING", "FINANCE", "DIREKSI"].map((role) => {
                  const signature = getSignatureByRole(role);
                  const hasAuthority = user?.authorities?.some(
                    (auth) =>
                      auth.fileType === "PURCHASE_ORDER" &&
                      auth.role.toUpperCase() === role
                  );
                  return (
                    <td
                      key={role}
                      className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom"
                    >
                      {!signature
                        ? hasAuthority && (
                            <button
                              onClick={() => handleSign(role)}
                              disabled={loadingButton}
                              className="user-button-add"
                            >
                              {loadingButton
                                ? "Memproses..."
                                : "Isi Tanda tangan"}
                            </button>
                          )
                        : signature?.userName}
                    </td>
                  );
                })}
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
        </div>
      </div>
    </div>
  );
}

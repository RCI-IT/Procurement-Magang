/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/styles/globals.css";
import Swal from "sweetalert2";
import { fetchWithAuth } from "../../../services/apiClient";
import { PermintaanPDF } from "./PermintaanPDF";
import { pdf } from "@react-pdf/renderer";
import Image from "next/image";

export default function DetailPermintaanLapangan() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSign, setSign] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

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

  const handleEdit = () => {
    router.push(`/permintaan-lapangan/${id}/edit`);
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/permintaan/${itemId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        setData((prevData) => {
          const updatedDetail = prevData.detail.map((item) =>
            item.id === itemId ? { ...item, status: newStatus } : item
          );
          return { ...prevData, detail: updatedDetail };
        });
        Swal.fire({
          icon: "success",
          title: "Status berhasil diperbarui",
          text: `Status telah diubah menjadi ${newStatus}.`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal memperbarui status",
          text: result?.error || "Terjadi kesalahan dalam memperbarui status.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan, coba lagi.",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = async () => {
    setLoadingButton(true);
    try {
      const blob = await pdf(
        <PermintaanPDF
          data={data}
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
  const handleSign = async (signingRole) => {
    setLoadingButton(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/signing`;
      const payload = {
        userId: user?.id,
        fileType: "PERMINTAAN_LAPANGAN",
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
      console.error(error);
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

  const fetchData = async () => {
    try {
      const permintaan = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}`,
        { method: "GET" }
      );
      const permintaanLap = await permintaan.json();
      setData(permintaanLap);

      const signing = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/signing/PERMINTAAN_LAPANGAN/${id}`,
        { method: "GET" }
      );
      const res = await signing.json();
      setSign(Array.isArray(res.signatures) ? res.signatures : []);

      setDataFetched(true);
    } catch (error) {
      console.error(error);
      setDataFetched(false);
    }
  };
  useEffect(() => {
    if (!id) return;

    fetchData();
  }, [id, router]);

  if (!data) {
    return (
      <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>
    );
  }

  const { day, month, year } = parseDate(data?.tanggal);
  const getSignatureByRole = (role) =>
    dataSign.find((sig) => sig.role === role);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Memuat data...</p>
      </div>
    );
  }
  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        <div></div>
        <div className="flex justify-end space-x-2 no-print">
          {user?.role === "USER_PURCHASE" ||
            (dataSign.length === 0 || data.status === 'READ'&& (
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-32 text-center"
              >
                Edit
              </button>
            ))}
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-32 text-center"
          >
            Cetak
          </button>
          <button
            onClick={handleGeneratePDF}
            className="bg-red-500 text-white rounded hover:bg-red-600 px-4 py-2"
            disabled={loadingButton || !dataFetched}
          >
            {loadingButton ? "Memproses…" : "Buat PDF"}
          </button>
        </div>

        <div
          id="permintaan-lapangan"
          className="print-container  mx-auto bg-white rounded-lg p-6"
        >
          <div className="border-b-4 border-blue-600 mt-4">
            <div className="flex justify-between items-center pb-3">
              <div className="flex flex-col items-start space-y-2">
                <Image
                  src={`/assets/logo1.png`}
                  alt="Logo"
                  width={200}
                  height={200}
                  className="w-20 h-20 object-contain"
                  unoptimized
                  priority
                />
                <div>
                  <h4 className="text-blue-900 font-bold text-lg uppercase">
                    PT. REKA CIPTA INOVASI
                  </h4>
                  <p className="text-sm text-gray-700">
                    Jl. Aluminium Perumahan Gatot Subroto Town House No. 5
                    <br />
                    Kel. Sei Sikambing C II, Kec. Medan Helvetia, Medan
                    <br />
                    Sumatera Utara, 20213
                  </p>
                </div>
              </div>
              <div className="text-sm">
                <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
                  PERMINTAAN LAPANGAN
                </h2>
                <div className="border border-gray-300">
                  <table className="border-collapse w-full">
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-2 py-1 font-semibold">
                          Tanggal
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {day} {month} {year}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-2 py-1 font-semibold">
                          Nomor
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {data.nomor}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <table className="w-full border-collapse mt-4 text-sm border border-gray-300">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th
                  rowSpan={2}
                  className="border border-gray-300 px-2 text-center"
                >
                  No.
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-300 px-2 text-center"
                >
                  Nama Barang / Jasa
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-300 px-2 text-center"
                >
                  Spesifikasi
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-300 px-2 text-center"
                >
                  Code
                </th>
                <th
                  colSpan={2}
                  className="border border-gray-300 p-2 text-center"
                >
                  Permintaan
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-300 px-2 text-center"
                >
                  Keterangan
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-300 px-2 text-center status-header"
                >
                  Status
                </th>
              </tr>
              <tr>
                <th className="border p-2 text-center">QTY</th>
                <th className="border p-2 text-center">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {data.detail && data.detail.length > 0 ? (
                data.detail.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {item.materialName || "Nama Material Tidak Tersedia"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.mention}
                    </td>
                    <td className="border border-gray-300 p-2">{item.code}</td>
                    <td className="border border-gray-300 p-2">{item.qty}</td>
                    <td className="border border-gray-300 p-2">
                      {item.satuan}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.keterangan}
                    </td>
                    <td className="border border-gray-300 p-2 text-center status-column">
                      {user?.role === "ADMIN" ||
                      user?.role === "USER_PURCHASE" ? (
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value)
                          }
                          className="border rounded p-1"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="REJECTED">REJECTED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="CLOSED">CLOSED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="READ">READ</option>
                        </select>
                      ) : (
                        <span>{item.status}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                  >
                    Data Permintaan Sudah Masuk Ke Confirmation Order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <table className="w-full border-collapse text-sm border border-gray-300 mt-4">
            <tbody>
              <tr>
                <td colSpan={5} rowSpan={4} className="p-2 align-top w-[60%]">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="p-2 font-semibold w-36">
                          Tanggal Delivery
                        </td>
                        <td className="p-1 w-3">:</td>
                        <td className="p-1">{data.tanggalDelivery || ""}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Lokasi Delivery</td>
                        <td className="p-1">:</td>
                        <td className="p-1">{data.lokasi || ""}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Catatan</td>
                        <td className="p-1">:</td>
                        <td className="p-1">{data.catatan || ""}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">PIC Lapangan</td>
                        <td className="p-1">:</td>
                        <td className="p-1">{data.picLapangan || ""}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Note</td>
                        <td className="p-1">:</td>
                        <td className="p-1">{data.note || ""}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                {["Diperiksa", "Request By"].map((text, index) => (
                  <td
                    key={index}
                    colSpan={1}
                    className="border font-semibold bg-gray-300 border-gray-300 h-8 text-center text-sm py-1"
                  >
                    {text}
                  </td>
                ))}
              </tr>
              {/* Baris: QR Code */}
              <tr>
                {["ENGINEER_CHECKER", "ENGINEER_REQUESTER"].map((role) => {
                  const signature = getSignatureByRole(role);
                  return (
                    <td
                      key={role}
                      colSpan={1}
                      className="border border-gray-300 border-b-0 h-16"
                    >
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
              </tr>

              {/* Baris: Nama atau Tombol */}
              <tr>
                {["ENGINEER_CHECKER", "ENGINEER_REQUESTER"].map((role) => {
                  const signature = getSignatureByRole(role);
                  const isAuthorized = user?.authorities?.some(
                    (auth) =>
                      auth.fileType === "PERMINTAAN_LAPANGAN" &&
                      auth.role.toUpperCase() === role
                  );

                  return (
                    <td
                      key={role}
                      className="border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom"
                    >
                      {!signature
                        ? isAuthorized && (
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
                        : signature.userName}
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td
                  colSpan={1}
                  className="border bg-gray-300 border-gray-300 h-8 text-center text-sm py-1"
                >
                  Project Manager
                </td>
                <td
                  colSpan={1}
                  className="border bg-gray-300 border-gray-300 h-8 text-center text-sm py-1"
                >
                  Site Manager
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6">
            <div className="flex justify-between space-x-4">
              <div className="w-1/2"></div>
              <div className="w-1/2 mx-auto"></div>
            </div>
          </div>

          <div id="back-button" className="text-right mt-6">
            <button
              id="kembali-btn"
              onClick={() => router.back()}
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

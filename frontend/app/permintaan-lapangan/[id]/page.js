/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import "@/styles/globals.css";
import Swal from "sweetalert2";
import { fetchWithAuth } from "../../../services/apiClient";
import { fetchWithToken } from "../../../services/fetchWithToken";

export default function DetailPermintaanLapangan() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const [userRole, setUserRole] = useState("");

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      // const result = await response.json();

      if (response.ok) {
        // Update the status in the local state
        setData((prevData) => {
          const updatedDetail = prevData.detail.map((item) =>
            item.id === itemId ? { ...item, status: newStatus } : item
          );
          return { ...prevData, detail: updatedDetail };
        });

        // SweetAlert for success
        Swal.fire({
          icon: "success",
          title: "Status berhasil diperbarui",
          text: `Status telah diubah menjadi ${newStatus}`,
          confirmButtonText: "OK",
        });
      } else {
        // SweetAlert for error
        Swal.fire({
          icon: "error",
          title: "Gagal memperbarui status",
          text: result.error || "Terjadi kesalahan dalam memperbarui status.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);

      // SweetAlert for exception
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan, coba lagi.",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setTimeout(() => {
      const element = document.getElementById("permintaan-lapangan");
      const backButton = document.getElementById("back-button");

      const statusHeaders = document.querySelectorAll(".status-header");
      const statusColumns = document.querySelectorAll(".status-column");

      if (!element) {
        console.error("Element not found!");
        return;
      }

      if (backButton) backButton.style.visibility = "hidden";

      statusHeaders.forEach((el) => el.classList.add("hidden"));
      statusColumns.forEach((el) => el.classList.add("hidden"));

      element.classList.add("pdf-format");

      html2pdf()
        .set({
          margin: 10,
          filename: `permintaan-lapangan-${id || "unknown"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          printMediaType: true,
        })
        .from(element)
        .save()
        .then(() => {
          element.classList.remove("pdf-format");

          statusHeaders.forEach((el) => el.classList.remove("hidden"));
          statusColumns.forEach((el) => el.classList.remove("hidden"));

          if (backButton) backButton.style.visibility = "visible";
        });
    }, 500);
  };
  useEffect(() => {
    const storedUserRole = localStorage.getItem("role");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const result = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}`,
          token,
          setToken,
          () => router.push("/login")
        );
        if (result) {
          setData(result);
        } else {
          router.push("/?page=permintaan-lapangan");
        }
      } catch (error) {
        console.error("Gagal mengambil data permintaan lapangan:", error);
        router.push("/?page=permintaan-lapangan");
      }
    };
    fetchData();
  }, [id, router]);

  if (!data)
    return (
      <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>
    );

  const { day, month, year } = parseDate(data?.tanggal);

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        <div></div>
        <div className="flex justify-end space-x-2 no-print">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-32 text-center"
          >
            Edit
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-32 text-center"
          >
            Cetak
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-32 text-center"
          >
            Simpan PDF
          </button>
        </div>

        <div
          id="permintaan-lapangan"
          className="print-container  mx-auto bg-white rounded-lg p-6"
        >
          <div className="border-b-4 border-blue-600 mt-4">
            <div className="flex justify-between items-center pb-3">
              <div className="flex flex-col items-start space-y-2">
                <img
                  src="/logo1.png"
                  alt="Logo"
                  className="w-20 h-20 object-contain"
                />

                <div>
                  <h4 className="text-blue-900 font-bold text-lg uppercase">
                    PT. REKA CIPTA INOVASI
                  </h4>
                  <p className="text-sm text-gray-700">
                    Jl. Aluminium Perumahan Gatot Subroto Town House No. 5<br />
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
          <br></br>
          <br></br>
          <table className="w-full border-collapse mt-4 text-sm border border-gray-300">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 text-center"
                >
                  No.
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 text-center"
                >
                  Nama Barang / Jasa
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 text-center"
                >
                  Spesifikasi
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 text-center"
                >
                  code
                </th>
                <th
                  colSpan="2"
                  className="border border-gray-300 p-2 text-center"
                >
                  Permintaan
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 text-center"
                >
                  Keterangan
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 text-center status-header"
                >
                  Status
                </th>
              </tr>
              <tr>
                <th className="border border- p-2 text-center">QTY</th>
                <th className="border border-white p-2 text-center">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {data.detail && data.detail.length > 0 ? (
                data.detail.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {item.material?.name || "Nama Material Tidak Tersedia"}
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
                      {userRole === "ADMIN" || userRole === "USER_PURCHASE" ? (
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
                        <span>{item.status}</span> // Show the current status if the user cannot change it
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                  >
                    Data Permintaan Sudah Masuk Ke Confirmation Order.
                  </td>
                </tr>
              )}

              <tr className="border-t border-gray-300">
                <td colSpan="2" rowSpan="4" className="p-2 align-top">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="p-2 font-semibold ">Tanggal Delivery</td>
                        <td className="p-1 ">:</td>
                        <td className="p-1">{data.tanggalDelivery || ""}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Lokasi Delivery</td>
                        <td className="p-1">:</td>
                        <td className="p-1">{data.lokasiDelivery || ""}</td>
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
                <td
                  colSpan="1"
                  className="border font-semibold bg-gray-300 border-gray-300 h-8 text-center text-sm py-1"
                >
                  Diperiksa
                </td>
                <td
                  colSpan="3"
                  className="border font-semibold bg-gray-300 border-gray-300 h-8 text-center text-sm py-1"
                >
                  Diketahui
                </td>
                <td
                  colSpan="2"
                  className="border font-semibold bg-gray-300 border-gray-300 h-8 text-center text-sm py-1"
                >
                  Dibuat
                </td>
              </tr>
              <tr>
                <td
                  colSpan="1"
                  className="border border-gray-300 border-b-0 h-16"
                ></td>
                <td
                  colSpan="3"
                  className="border border-gray-300 border-b-0 h-16"
                ></td>
                <td
                  colSpan="2"
                  className="border border-gray-300 border-b-0 h-16"
                ></td>
              </tr>
              <tr>
                <td className="border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">
                  Nama
                </td>
                <td
                  className="border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom"
                  colSpan="3"
                >
                  Nama
                </td>
                <td
                  className="border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom"
                  colSpan="2"
                >
                  Nama
                </td>
              </tr>

              <tr>
                <td
                  colSpan="1"
                  className="border bg-gray-300 border-gray-300 h-8 text-center text-sm py-1"
                >
                  Project Manager
                </td>
                <td
                  colSpan="3"
                  className="border bg-gray-300 border-gray-300 h-8 text-center text-sm py-1"
                >
                  Site Manager
                </td>
                <td
                  colSpan="2"
                  className="border bg-gray-300 border-gray-300 h-8 text-center text-sm py-1"
                >
                  Logistik
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

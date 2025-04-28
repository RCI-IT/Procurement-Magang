"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import "../../../styles/globals.css";
import Sidebar from "../../../component/sidebar";
import Header from "../../../component/Header.js";

export default function DetailPurchaseOrder() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [username, setUsername] = useState("");

  const parseDate = (dateString) => {
    if (!dateString) return { day: "-", month: "-", year: "-" };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: "-", month: "-", year: "-" };

    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return { day, month, year };
  };

  const handleEdit = () => {
    router.push(`/purchase-order/${id}/edit`);
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
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchase/${id}`);
        const result = await response.json();
        if (result) {
          setData(result);
        } else {
          router.push("/purchase-order");
        }
      } catch (error) {
        console.error("Gagal mengambil data purchase order:", error);
        router.push("/purchase-order");
      }
    };
    fetchData();
  }, [id, router]);

  if (!data) return <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>;

  const { day, month, year } = parseDate(data?.tanggalPO);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header username={username} />
        <div className="flex justify-end space-x-2 no-print">
          <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-32">
            Edit
          </button>
          <button onClick={handlePrint} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-32">
            Cetak
          </button>
          <button onClick={handleDownloadPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-32">
            Download PDF
          </button>
        </div>

        {/* Elemen yang akan dicetak */}
        <div id="purchase-order" className="print-container mx-auto bg-white rounded-lg p-6">
          <div className="border-b-4 border-blue-600 mt-4">
            <div className="flex justify-between items-center pb-3">
              <h1 className="text-lg font-bold text-blue-900 uppercase">Company Name</h1>
              <h2 className="text-lg font-bold text-blue-900 uppercase">Purchase Order</h2>
              <div className="border border-gray-300 text-sm">
                <table className="border-collapse w-full">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-semibold">Tanggal Purchase Order</td>
                      <td className="border border-gray-300 px-2 py-1">{day} {month} {year}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-semibold">Nomor Purchase Order</td>
                      <td className="border border-gray-300 px-2 py-1">{data.nomorPO}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-2 py-1 font-semibold">Lokasi Purchase Order</td>
                      <td className="border border-gray-300 px-2 py-1">{data.lokasiPO}</td>
                    </tr>
                    {data.keterangan && (
                      <tr>
                        <td className="border border-gray-300 px-2 py-1 font-semibold">Keterangan</td>
                        <td className="border border-gray-300 px-2 py-1">{data.keterangan}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <br />
          <div className="border-t-4 border-blue-600 mt-4 pt-4">
            <h3 className="text-lg font-bold text-blue-900">Confirmation Order</h3>
            <table className="w-full border-collapse mt-2 text-sm border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 font-semibold">Nomor Confirmation Order</td>
                  <td className="border border-gray-300 px-2 py-1">{data.confirmationOrder.nomorCO}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 font-semibold">Tanggal Confirmation Order</td>
                  <td className="border border-gray-300 px-2 py-1">
                    {parseDate(data.confirmationOrder.tanggalCO).day}{" "}
                    {parseDate(data.confirmationOrder.tanggalCO).month}{" "}
                    {parseDate(data.confirmationOrder.tanggalCO).year}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-1 font-semibold">Lokasi Confirmation Order</td>
                  <td className="border border-gray-300 px-2 py-1">{data.confirmationOrder.lokasiCO}</td>
                </tr>
                {data.confirmationOrder.keterangan && (
                  <tr>
                    <td className="border border-gray-300 px-2 py-1 font-semibold">Keterangan</td>
                    <td className="border border-gray-300 px-2 py-1">{data.confirmationOrder.keterangan}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <br />
          <table className="w-full border-collapse mt-4 text-sm border border-gray-300">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="border border-gray-300 p-2 text-center">No.</th>
                <th className="border border-gray-300 p-2 text-center">Nama Barang</th>
                <th className="border border-gray-300 p-2 text-center">Spesifikasi</th>
                <th className="border border-gray-300 p-2 text-center">Qty</th>
                <th className="border border-gray-300 p-2 text-center">Satuan</th>
                <th className="border border-gray-300 p-2 text-center">Keterangan</th>
                <th className="border border-gray-300 p-2 text-center">Status</th>
                <th className="border border-gray-300 p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.purchaseDetails && data.purchaseDetails.length > 0 ? (
                data.purchaseDetails.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{item.material?.name || "Nama Material Tidak Tersedia"}</td>
                    <td className="border border-gray-300 p-2">{item.material?.description}</td>
                    <td className="border border-gray-300 p-2">{item.qty}</td>
                    <td className="border border-gray-300 p-2">{item.satuan}</td>
                    <td className="border border-gray-300 p-2">{item.keterangan}</td>
                    <td className="border border-gray-300 p-2">{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                    Tidak ada detail Purchase Order
                  </td>
                </tr>
              )}
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

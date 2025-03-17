"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../component/sidebar";
import html2pdf from "html2pdf.js";
import "../../../styles/globals.css";


export default function DetailPermintaanLapangan() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

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
    router.push(`/permintaan-lapangan/${id}/edit`);
  };

  const handlePrint = () => {
    window.print();
  };
  

  const handleDownloadPDF = () => {
    setTimeout(() => {
      const element = document.getElementById("permintaan-lapangan");
      const backButton = document.getElementById("back-button");
  
      if (!element) {
        console.error("Element not found!");
        return;
      }
  
      // Sembunyikan tombol kembali sebelum generate PDF
      if (backButton) backButton.style.visibility = "hidden";
  
      // Tambahkan class untuk merapikan PDF sebelum generate
      element.classList.add("pdf-format");
  
      html2pdf()
        .set({
          margin: 10,
          filename: `permintaan-lapangan-${id || "unknown"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save()
        .then(() => {
          // Hapus class setelah PDF selesai dibuat
          element.classList.remove("pdf-format");
  
          // Tampilkan kembali tombol setelah PDF selesai dibuat
          if (backButton) backButton.style.visibility = "visible";
        });
    }, 500);
  };
  

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.110.204:5000/permintaan/${id}`);
        const result = await response.json();
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

  if (!data) return <p className="text-red-500 text-center mt-10">Data tidak ditemukan</p>;

  const { day, month, year } = parseDate(data?.tanggal);


  return (
    <div className="flex h-screen">
    <Sidebar className="no-print" />  
    <div className="flex-1 p-6">
      {/* Tombol harus tidak dicetak */}
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
      <div id="permintaan-lapangan" className="print-container  mx-auto bg-white rounded-lg p-6"> 
        <div className="border-b-4 border-blue-600 mt-4">
        <div className="flex justify-between items-center pb-3">
  <h1 className="text-lg font-bold text-blue-900 uppercase">Company Name</h1>
  <h2 className="text-lg font-bold text-blue-900 uppercase">Permintaan Lapangan</h2>
  <div className="border border-gray-300 text-sm">
    <table className="border-collapse w-full">
      <tbody>
        <tr>
          <td className="border border-gray-300 px-2 py-1 font-semibold">Tanggal</td>
          <td className="border border-gray-300 px-2 py-1">{day} {month} {year}</td>
        </tr>
        <tr>
          <td className="border border-gray-300 px-2 py-1 font-semibold">Nomor</td>
          <td className="border border-gray-300 px-2 py-1">{data.nomor}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</div>       
         <br></br>
          <br></br>
          <table className="w-full border-collapse mt-4 text-sm border border-gray-300">
  <thead className="bg-blue-700 text-white">
    <tr>
      <th rowSpan="2" className="border border-gray-300 px-2 text-center">No.</th>
      <th rowSpan="2" className="border border-gray-300 px-2 text-center">Nama Barang / Jasa</th>
      <th rowSpan="2" className="border border-gray-300 px-2 text-center">Spesifikasi</th>
      <th rowSpan="2" className="border border-gray-300 px-2 text-center">code</th>
      <th colSpan="2" className="border border-gray-300 p-2 text-center" >Permintaan</th>
      <th rowSpan="2" className="border border-gray-300 px-2 text-center">Keterangan</th>
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
          <td className="border border-gray-300 p-2">{item.material?.name || "Nama Material Tidak Tersedia"}</td>
          <td className="border border-gray-300 p-2">{item.mention}</td>
          <td className="border border-gray-300 p-2">{item.code}</td>
          <td className="border border-gray-300 p-2">{item.qty}</td>
          <td className="border border-gray-300 p-2">{item.satuan}</td>
          <td className="border border-gray-300 p-2">{item.keterangan}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
          Data Permintaan Sudah Masuk Ke Purchase Order.
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
      <td colSpan="1" className="border font-semibold bg-gray-300 border-gray-300 h-8 text-center text-sm py-1">
        Diperiksa
      </td>
      <td colSpan="3" className="border font-semibold bg-gray-300 border-gray-300 h-8 text-center text-sm py-1">
        Diketahui
      </td>
      <td colSpan="1" className="border font-semibold bg-gray-300 border-gray-300 h-8 text-center text-sm py-1">
        Dibuat
      </td>
    </tr>
    <tr>
      <td colSpan="1" className="border border-gray-300 border-b-0 h-16"></td>
      <td colSpan="3" className="border border-gray-300 border-b-0 h-16"></td>
      <td colSpan="1" className="border border-gray-300 border-b-0 h-16"></td>
    </tr>
    <tr>
  <td className="border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">Nama</td>
  <td className="border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom" colSpan="3">Nama</td>
  <td className="border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">Nama</td>
</tr>


<tr>
  <td colSpan="1" className="border bg-gray-300 border-gray-300 h-8 text-center text-sm py-1">
    Project Manager
  </td>
  <td colSpan="3" className="border bg-gray-300 border-gray-300 h-8 text-center text-sm py-1">
    Site Manager
  </td>
  <td colSpan="1" className="border bg-gray-300 border-gray-300 h-8 text-center text-sm py-1">
    Logistik
  </td>
</tr>

  </tbody>
</table>

          <div className="mt-6">
          <div className="flex justify-between space-x-4">
          <div className="w-1/2">
    </div>

    <div className="w-1/2 mx-auto">
</div>

            </div>
          </div>

          <div id="back-button" className="text-right mt-6">
          <button
  id="kembali-btn"
  onClick={() => router.push("/?page=permintaan-lapangan")}
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

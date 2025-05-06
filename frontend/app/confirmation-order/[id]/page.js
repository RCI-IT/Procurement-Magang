/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../../styles/globals.css";
import html2pdf from "html2pdf.js";
import Sidebar from "../../../component/sidebar.js";
import { useRouter } from "next/navigation";
import Header from "../../../component/Header.js"
import Swal from 'sweetalert2';

export default function ConfirmationOrderDetail() {
  const { id } = useParams();
  const [ConfirmationDetails, setCoDetail] = useState(null);
  const [ConfirmationDetail, setCoSDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadPDF = () => {
    setTimeout(() => {
      const element = document.getElementById("confirmation-order");
      const backButton = document.getElementById("back-button");

      const statusHeaders = document.querySelectorAll('.status-header');
      const statusColumns = document.querySelectorAll('.status-column');
  
      if (!element) {
        console.error("Element not found!");
        return;
      }
  
      if (backButton) backButton.style.visibility = "hidden";

      statusHeaders.forEach(el => el.classList.add('hidden'));
      statusColumns.forEach(el => el.classList.add('hidden'));
  
      element.classList.add("pdf-format");
  
      html2pdf()
        .set({
          margin: 10,
          filename: `confirmation-order-${id || "unknown"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          printMediaType: true
        })
        .from(element)
        .save()
        .then(() => {
          element.classList.remove("pdf-format");

          statusHeaders.forEach(el => el.classList.remove('hidden'));
          statusColumns.forEach(el => el.classList.remove('hidden'));
  
          if (backButton) backButton.style.visibility = "visible";
        });
    }, 500);
  };
  
  

const terbilang = (angka) => {
  const satuan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];
  const belasan = ["Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas", "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas"];
  const puluhan = ["", "", "Dua Puluh", "Tiga Puluh", "Empat Puluh", "Lima Puluh", "Enam Puluh", "Tujuh Puluh", "Delapan Puluh", "Sembilan Puluh"];
  const ribuan = ["", "Ribu", "Juta", "Miliar", "Triliun"];

  if (angka === 0) return "Nol Rupiah";

  const konversi = (num) => {
    if (num < 10) return satuan[num];
    if (num < 20) return belasan[num - 10];
    if (num < 100) return puluhan[Math.floor(num / 10)] + " " + satuan[num % 10];
    if (num < 1000) return satuan[Math.floor(num / 100)] + " Ratus " + konversi(num % 100);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirmation/${id}`);
        if (!response.ok) throw new Error("Gagal mengambil data dari server");

        const data = await response.json();
        setCoDetail(data);
        setCoSDetail(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const totalHarga =
  ConfirmationDetail?.confirmationDetails?.reduce((sum, coItem) => {
    const material = coItem.permintaanDetail?.material;
    const harga = material?.price || 0;
    const qty = coItem.qty || 0; 
    return sum + (harga * qty);
  }, 0) || 0;
  
 const handleCheckboxChange = (confirmationDetailId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(confirmationDetailId)) {
        return prevSelected.filter((item) => item !== confirmationDetailId);
      } else {
        return [...prevSelected, confirmationDetailId];
      }
    });
  };
  const handleKonfirmasi = async () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Tidak ada item yang dipilih!',
      });
      return;
    }
  
    console.log("Selected Items:", selectedItems);
  
    const confirmationDetailIds = selectedItems.map(id => parseInt(id, 10));
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirmation/acc-details`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmationDetailIds }),
      });
  
      console.log("Response Status:", response.status);
  
      if (!response.ok) {
        throw new Error("Gagal mengkonfirmasi");
      }
  
      const result = await response.json();
      console.log("Response Data:", result);
  
      if (result.message) {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: result.message,
          confirmButtonText: 'OK'
        });

        router.back();
      }
    } catch (error) {
      console.error("Error konfirmasi: ", error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Terjadi kesalahan: ' + error.message,
      });
    }
  };
const ActionButtons = ({ onKonfirmasi }) => (
  <div className="flex justify-center gap-4">
<button 
  onClick={onKonfirmasi} 
  className="bg-green-500 hover:bg-green-600 text-white rounded-xl w-32 h-12 flex items-center justify-center"
>
  Konfirmasi
</button>

  </div>
);

  return (
    <div className="flex h-screen">
      <Sidebar / >
      <div className="w-full max-w-6xl mx-auto px-8">
              <div>
            <Header username={username} />
            </div>
      <div className="text-right space-x-2">
      <button
  onClick={() => router.push(`/confirmation-order/${id}/edit`)}
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-32 text-center"
>
  Edit
</button>

          <button onClick={handlePrint} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-32 text-center">
          Cetak
          </button>
          <button onClick={handleDownloadPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-32 text-center">
  Simpan PDF
</button>

        </div>
        <br></br>
        <br></br>
        <div id="confirmation-order" className="print-container  mx-auto bg-white rounded-lg p-6">
        <div className="flex justify-between items-start mt-4">
  <div className="flex flex-col items-start space-y-2">
    <img src="/logo1.png" alt="Logo" className="w-20 h-20 object-contain" />

    <div>
      <h4 className="text-blue-900 font-bold text-lg uppercase">
        PT. REKA CIPTA INOVASI
      </h4>
      <p className="text-sm text-gray-700">
        Jl. Aluminium Perumahan Gatot Subroto Town House No. 5<br />
        Kel. Sei Sikambing C II, Kec. Medan Helvetia, Medan<br />
        Sumatera Utara, 20213
      </p>
    </div>
  </div>

  <div className="flex flex-col items-center">
    <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
      CONFIRMATION<br />PURCHASE ORDER
    </h2>
    <table className="border text-sm w-auto">
      <tbody>
        <tr className="border">
          <td className="border px-2 py-1 font-semibold text-center">Date</td>
          <td className="border px-2 py-1 text-center">
            {ConfirmationDetails?.tanggalCO
              ? new Date(ConfirmationDetails.tanggalCO).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </td>
        </tr>
        <tr className="border">
          <td className="border px-2 py-1 font-semibold text-center">No. Konfirmasi PO</td>
          <td className="border px-2 py-1 text-center">{ConfirmationDetails?.nomorCO || "N/A"}</td>
        </tr>
        <tr className="border">
          <td className="border px-2 py-1 font-semibold text-center">PL Number</td>
          <td className="border px-2 py-1 text-center">
            {ConfirmationDetails?.confirmationDetails?.[0]?.permintaanDetail?.permintaan?.nomor || "N/A"}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div className="border-b-4 border-blue-600 mt-2"></div>
<div id="confirmation-order" className="print-container  mx-auto bg-white rounded-lg p-6">
<table className="w-full border mt-4 text-center rounded-md">
  <thead  className="bg-blue-600 text-white">
    <tr>
      <th className="border p-2" rowSpan={2}>No.</th>
      <th className="border p-2" rowSpan={2}>Code</th>
      <th className="border p-2" rowSpan={2}>Nama Barang</th>
      <th className="border p-2" rowSpan={2}>Harga</th>
      <th className="border p-2 w-12 " colSpan="2">Permintaan</th>
      <th className="border p-2 w-35" rowSpan={2}>Total</th>
      <th className="border p-2 w-35 status-header" rowSpan={2}>Aksi</th>
    </tr>
    <tr className="bg-blue-600 text-white">
      <th className="border p-2 w-12">QTY</th>
      <th className="border p-2 w-12">Satuan</th>
    </tr>
  </thead>
  <tbody>
  {ConfirmationDetail?.confirmationDetails?.length > 0 ? (
  ConfirmationDetail.confirmationDetails.map((item, index) => {
    const material = item.permintaanDetail?.material;
    const harga = material?.price || 0;
    const qty = item.qty || 0;
    const total = harga * qty;

    return (
      <tr key={index}>
        <td className="border px-4 py-2 text-center">{index + 1}</td>
        <td className="border px-4 py-2">{item.code}</td>
        <td className="border px-4 py-2">{material?.name || 'N/A'}</td>
        <td className="border px-4 py-2 text-center">Rp{harga.toLocaleString()}</td>
        <td className="border px-4 py-2 text-center">{qty}</td>
        <td className="border px-4 py-2 text-center">{item.satuan || 'N/A'}</td>
        <td className="border px-4 py-2 text-center">Rp{total.toLocaleString()}</td>
        <td className="border px-4 py-2 text-center status-column">
  {item.status === "ACC" ? (
    <span className="text-green-600 font-semibold">ACC </span>
  ) : (
    <input
      type="checkbox"
      checked={selectedItems.includes(item.id)}
      onChange={() => handleCheckboxChange(item.id)}
      className="w-6 h-6"
    />
  )}
</td>


      </tr>
    );
  })
) : (
  <tr>
    <td colSpan={7} className="text-center text-gray-500 py-4">
      Tidak ada data
    </td>
  </tr>
)}


    <tr className="font-semibold">
      <td colSpan="4" className="bg-blue-600 text-white p-2 text-left">Terbilang</td>
      <td colSpan="2" rowSpan={2} className="p-2 text-center border">TOTAL</td>
      <td colSpan="1" rowSpan={2} className="p-2 text-center border">Rp{totalHarga.toLocaleString()}</td>
      <td colSpan="1" rowSpan={2} className="p-2 text-center border  status-column">
    <ActionButtons onKonfirmasi={handleKonfirmasi} />
  </td>

    </tr>
<tr>
<td colSpan="4" className="border p-2 text-gray-800 bg-white italic text-left">
        {terbilang(totalHarga) || "-"}
      </td>
</tr>
    <tr className="bg-white font-bold">
      

    </tr>
  </tbody>
</table>
</div>
<table  className="w-full border mt-6">
  <tbody>
  <tr className="text-center ">
      <td  colSpan={3} className="bg-gray-300 font-semibold border p-2">PT.REKA CIPTA INOVASI</td>
      <td rowSpan={2} className="bg-gray-300 font-semibold border p-2 ">Vendor</td>
    </tr>

    <tr className="text-center ">
      <td className="bg-gray-300 font-semibold border p-2">Diperiksa</td>
      <td className="bg-gray-300 font-semibold border p-2 ">Diketahui</td>
      <td className="bg-gray-300 font-semibold border p-2">Dibuat</td>
    </tr>
    <tr>
      <td className="border-b-0 border h-24 w-1/4"></td>
      <td className="border-b-0 border h-24 w-1/4"></td>
      <td className="border-b-0 border h-24 w-1/4"></td>
    </tr>
    <tr className="text-center">
      <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">Nama</td>
      <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">Nama</td>
      <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">Nama</td>
    </tr>
    <tr className="text-center bg-gray-300">
      <td className="border p-2">Project Manager</td>
      <td className="border p-2">Site Manager</td>
      <td className="border p-2">Logistik</td>
    </tr>
  </tbody>
</table>
</div>
<br></br>
<button onClick={() =>  router.back()} className="mt-6 bg-gray-500 text-white px-4 py-2 rounded">
            Kembali
          </button>
    </div>
    </div>
  );
}

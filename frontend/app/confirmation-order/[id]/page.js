/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { fetchWithAuth } from "@/services/apiClient";
import { pdf } from "@react-pdf/renderer";
import { ConfirmOrderPDF } from "./ConfrimOrderPDF";
import Image from "next/image";

export default function ConfirmationOrderDetail() {
  const { id } = useParams();
  const [ConfirmationDetails, setCoDetail] = useState(null);
  const [ConfirmationDetail, setCoSDetail] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState([]);
  const [user, setUser] = useState(null);
  const [dataSign, setSign] = useState([]);
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

  const handleSign = async (signingRole) => {
    setLoadingButton(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/signing`;

      const payload = {
        userId: user?.id,
        fileType: "CONFIRMATION_ORDER",
        relatedId: id,
        role: signingRole,
      };
      console.log("Mengirim payload:", payload);

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
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.message || "Terjadi kesalahan saat menyimpan tanda tangan.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = async () => {
    setLoadingButton(true);
    try {
      const blob = await pdf(
        <ConfirmOrderPDF
          data={ConfirmationDetail}
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

  const fetchData = async () => {
    try {
      const confirm = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/confirmation/${id}`,
        { method: "GET" }
      );
      const confirmation = await confirm.json();
      setCoDetail(confirmation);
      setCoSDetail(confirmation);
      const signing = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/signing/CONFIRMATION_ORDER/${id}`,
        { method: "GET" }
      );
      const res = await signing.json();

      if (res && res.signatures) {
        setSign(res.signatures);
        console.log("ISI dataSign:", res.signatures);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!id) return;

    fetchData();
  }, [id]);

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  const totalHarga =
    ConfirmationDetail?.confirmationDetails?.reduce((sum, item) => {
      const harga = item.material?.price || 0;
      const qty = item.qty || 0;
      return sum + qty * harga;
    }, 0) || 0;
  console.log("Total Harga: ", totalHarga); // Log totalHarga to debug

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
        icon: "warning",
        title: "Oops!",
        text: "Tidak ada item yang dipilih!",
      });
      return;
    }

    console.log("Selected Items:", selectedItems);

    const confirmationDetailIds = selectedItems.map((id) => parseInt(id, 10));

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/confirmation/acc-details`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ confirmationDetailIds }),
        }
      );

      console.log("Response Data:", response);

      if (response) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: response.message,
          confirmButtonText: "OK",
        });

        if (
          ConfirmationDetails?.confirmationDetails?.length > 0 &&
          ConfirmationDetails.confirmationDetails.every(
            (detail) => detail.status === "ACC"
          )
        ) {
          const response = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/confirmation/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "COMPLETED" }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal update acc-details");
          }
        }
        fetchData();
      }
    } catch (error) {
      console.error("Error konfirmasi: ", error.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Terjadi kesalahan: " + error.message,
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

  const getSignatureByRole = (role) => {
    return dataSign.find((sig) => sig.role === role);
  };

  return (
    <div className="flex h-screen">
      <div className="w-full max-w-6xl mx-auto px-8">
        <div></div>
        <div className="text-right space-x-2">
          {user?.role === "USER_PURCHASE" &&
            !ConfirmationDetails?.confirmationDetails?.some(
              (detail) => detail.status === "ACC"
            ) &&
            dataSign.length === 0 && (
              <button
                onClick={() => router.push(`/confirmation-order/${id}/edit`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-32 text-center"
              >
                Edit
              </button>
            )}

          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-32 text-center"
          >
            Cetak
          </button>
          <button
            onClick={handleGeneratePDF}
            className="bg-red-500 text-white rounded hover:bg-red-600 px-4 py-2"
          >
            {loadingButton ? "Memproses…" : "Buat PDF"}
          </button>
        </div>
        <br></br>
        <br></br>
        <div
          id="confirmation-order"
          className="print-container mx-auto bg-white rounded-lg p-6"
        >
          <div className="flex justify-between items-start mt-4">
            <div className="flex flex-col items-start space-y-2">
              <Image
                src={`/assets/logo1.png`}
                alt="Logo"
                width={150}
                height={150}
                className="object-contain"
                unoptimized
                priority
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

            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
                CONFIRMATION
                <br />
                PURCHASE ORDER
              </h2>
              <table className="border text-sm w-auto">
                <tbody>
                  <tr className="border">
                    <td className="border px-2 py-1 font-semibold text-center">
                      Date
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {ConfirmationDetails?.tanggalCO
                        ? new Date(
                            ConfirmationDetails.tanggalCO
                          ).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="border px-2 py-1 font-semibold text-center">
                      No. Konfirmasi PO
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {ConfirmationDetails?.nomorCO || "N/A"}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="border px-2 py-1 font-semibold text-center">
                      PL Number
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {ConfirmationDetails?.permintaan?.nomor || "N/A"}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="border px-2 py-1 font-semibold text-center">
                      Lokasi CO
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {ConfirmationDetails?.lokasiCO || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="border-b-4 border-blue-600 mt-2"></div>
          <div
            id="confirmation-order"
            className="print-container  mx-auto bg-white rounded-lg p-6"
          >
            <table className="w-full border mt-4 text-center rounded-md">
              <thead className="bg-blue-600 text-white">
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
                    Gambar
                  </th>
                  <th className="border p-2" rowSpan={2}>
                    Harga
                  </th>
                  <th className="border p-2 w-12 " colSpan="2">
                    Permintaan
                  </th>
                  <th className="border p-2 w-35" rowSpan={2}>
                    Total
                  </th>
                  <th className="border p-2 w-35 status-header" rowSpan={2}>
                    Aksi
                  </th>
                </tr>
                <tr className="bg-blue-600 text-white">
                  <th className="border p-2 w-12">QTY</th>
                  <th className="border p-2 w-12">Satuan</th>
                </tr>
              </thead>
              <tbody>
                {ConfirmationDetail?.confirmationDetails?.length > 0 ? (
                  ConfirmationDetail.confirmationDetails.map((item, index) => {
                    const material = item.material; // Access directly from item.material
                    const harga =
                      material && material.price ? material.price : 0;
                    const qty = item.qty || 0;
                    const total = harga * qty;

                    return (
                      <tr key={index}>
                        <td className="border px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border px-4 py-2">{item.code}</td>
                        <td className="border px-4 py-2">
                          {item.material ? item.material.name : "N/A"}
                        </td>
                        <td className="border px-4 py-2 flex items-center justify-center">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${material.image}`}
                            alt={material.image}
                            width={200}
                            height={200}
                            className="w-20 h-20 object-contain"
                            unoptimized
                            priority
                          />
                        </td>
                        <td className="border px-4 py-2 text-center">
                          Rp{harga.toLocaleString()}
                        </td>
                        <td className="border px-4 py-2 text-center">{qty}</td>
                        <td className="border px-4 py-2 text-center">
                          {item.satuan || "N/A"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          Rp{total.toLocaleString()}
                        </td>
                        <td className="border px-4 py-2 text-center status-column">
                          {item.status === "ACC" ? (
                            <span className="text-green-600 font-semibold">
                              ACC
                            </span>
                          ) : user?.role === "USER_LAPANGAN" ||
                            user?.role === "ADMIN" ? (
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleCheckboxChange(item.id)}
                              className="w-6 h-6"
                            />
                          ) : (
                            <span className="text-gray-500 italic">
                              Belum ACC
                            </span>
                          )}
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
                    colSpan="5"
                    className="bg-blue-600 text-white p-2 text-left"
                  >
                    Terbilang
                  </td>
                  <td
                    colSpan="2"
                    rowSpan={2}
                    className="p-2 text-center border"
                  >
                    TOTAL
                  </td>
                  <td
                    colSpan="1"
                    rowSpan={2}
                    className="p-2 text-center border"
                  >
                    Rp{totalHarga.toLocaleString()}
                  </td>
                  {ConfirmationDetail?.confirmationDetails?.some(
                    (detail) => detail.status !== "ACC"
                  ) &&
                    (user?.role === "USER_LAPANGAN" ||
                      user?.role === "ADMIN") && (
                      <td
                        colSpan="1"
                        rowSpan={2}
                        className="p-2 text-center border status-column"
                      >
                        <ActionButtons onKonfirmasi={handleKonfirmasi} />
                      </td>
                    )}
                </tr>
                <tr>
                  <td
                    colSpan="5"
                    className="border p-2 text-gray-800 bg-white italic text-left"
                  >
                    {terbilang(totalHarga) || "Tidak ada total"}
                  </td>
                </tr>

                <tr className="bg-white font-bold"></tr>
              </tbody>
            </table>
          </div>
          <table className="w-full border mt-6">
            <tbody>
              <tr className="text-center ">
                <td
                  colSpan={3}
                  className="bg-gray-300 font-semibold border p-2"
                >
                  PT.REKA CIPTA INOVASI
                </td>
                <td
                  rowSpan={2}
                  className="bg-gray-300 font-semibold border p-2 "
                >
                  Vendor
                </td>
              </tr>

              <tr className="text-center ">
                <td className="bg-gray-300 font-semibold border p-2">Dibuat</td>
                <td className="bg-gray-300 font-semibold border p-2">
                  Disetujui
                </td>
                <td className="bg-gray-300 font-semibold border p-2 ">
                  Diketahui
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
                  {getSignatureByRole("PIC_LAPANGAN")?.qrCode && (
                    <img
                      src={getSignatureByRole("PIC_LAPANGAN").qrCode}
                      alt="QR PM"
                      className="mx-auto w-24"
                    />
                  )}
                </td>
                <td className="border-b-0 border h-24 w-1/4">
                  {getSignatureByRole("SITE_MANAGER")?.qrCode && (
                    <img
                      src={getSignatureByRole("SITE_MANAGER").qrCode}
                      alt="QR PM"
                      className="mx-auto w-24"
                    />
                  )}
                </td>
              </tr>
              <tr className="text-center">
                <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">
                  {!getSignatureByRole("PURCHASING")
                    ? user?.authorities?.some(
                        (auth) =>
                          auth.fileType === "CONFIRMATION_ORDER" &&
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
                    : getSignatureByRole("PURCHASING")?.userName}
                </td>
                <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">
                  {!getSignatureByRole("PIC_LAPANGAN")
                    ? user?.authorities?.some(
                        (auth) =>
                          auth.fileType === "CONFIRMATION_ORDER" &&
                          auth.role.toUpperCase() === "PIC_LAPANGAN"
                      ) && (
                        <button
                          onClick={() => handleSign("PIC_LAPANGAN")}
                          disabled={loadingButton}
                          className="user-button-add"
                        >
                          {loadingButton ? "Memproses..." : "Isi Tanda tangan"}
                        </button>
                      )
                    : getSignatureByRole("PIC_LAPANGAN")?.userName}
                </td>
                <td className="no-print border border-gray-300 border-t-0 text-center p-1 leading-none align-bottom">
                  {!getSignatureByRole("SITE_MANAGER")
                    ? user?.authorities?.some(
                        (auth) =>
                          auth.fileType === "CONFIRMATION_ORDER" &&
                          auth.role.toUpperCase() === "SITE_MANAGER"
                      ) && (
                        <button
                          onClick={() => handleSign("SITE_MANAGER")}
                          disabled={loadingButton}
                          className="user-button-add"
                        >
                          {loadingButton ? "Memproses..." : "Isi Tanda tangan"}
                        </button>
                      )
                    : getSignatureByRole("SITE_MANAGER")?.userName}
                </td>
              </tr>
              <tr className="text-center bg-gray-300">
                <td className="border p-2">Purchasing</td>
                <td className="border p-2">PIC Lapangan</td>
                <td className="border p-2">Site Manager</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <button
          onClick={() => router.back()}
          className="mt-6 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

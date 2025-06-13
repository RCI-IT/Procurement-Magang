"use client";
import React from "react";

export default function PetunjukPenggunaan() {
  return (
    
    // <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow">
    //   <h1 className="text-2xl font-bold mb-6 text-blue-600">Petunjuk Penggunaan Aplikasi Purchasing</h1>

    //   <section className="mb-8">
    //     <h2 className="text-xl font-semibold mb-4 text-green-600">1. Untuk User Lapangan</h2>
    //     <ul className="list-none ml-6 space-y-2">
    //       <li className="font-semibold">A. Membuat Permintaan Lapangan:</li>
    //         <ul className="list-disc ml-6 text-gray-700">
    //           <li>Login ke aplikasi menggunakan akun yang telah diberikan.</li>
    //           <li>Pilih menu <strong>Permintaan Lapangan</strong>.</li>
    //           <li>Klik tombol <strong>Buat Permintaan Baru</strong>.</li>
    //           <li>Isi detail permintaan, seperti:
    //             <ul className="list-decimal ml-6 mt-2">
    //               <li>Pilih material dari daftar.</li>
    //               <li>Masukkan jumlah kebutuhan (QTY) dan satuan.</li>
    //               <li>Tambahkan keterangan tambahan jika diperlukan.</li>
    //             </ul>
    //           </li>
    //           <li>Setelah selesai, klik <strong>Submit</strong> untuk mengajukan permintaan.</li>
    //           <li>Permintaan akan otomatis masuk ke daftar untuk diverifikasi oleh Purchasing.</li>
    //         </ul>
    //       <li className="font-semibold">B. Melakukan Konfirmasi Barang (Confirmation Order):</li>
    //         <ul className="list-disc ml-6 text-gray-700">
    //           <li>Masuk ke menu <strong>Confirmation Order</strong>.</li>
    //           <li>Lihat daftar barang yang sudah dipilihkan vendor oleh Purchasing.</li>
    //           <li>Periksa apakah barang, vendor, dan harga sudah sesuai.</li>
    //           <li>Beri konfirmasi per item:
    //             <ul>
    //               <li>✅ Klik <strong>Konfirmasi</strong> pada item yang sesuai.</li>
    //               <li>❌ Abaikan item yang tidak sesuai.</li>
    //             </ul>
    //           </li>
    //           <li>Hanya barang yang dikonfirmasi yang akan dilanjutkan ke proses PO.</li>
    //         </ul>
    //     </ul>
        
    //   </section>

    //   <section className="mb-8">
    //     <h2 className="text-xl font-semibold mb-4 text-blue-600">2. Untuk User Purchasing (Kantor)</h2>
    //     <ul className="list-none ml-6 space-y-2">
    //       <li className="font-semibold">A. Memverifikasi Permintaan Lapangan:</li>
    //         <ul className="list-disc ml-6 space-y-2 text-gray-700">
    //           <li>Login ke aplikasi menggunakan akun Purchasing.</li>
    //           <li>Pilih menu <strong>Daftar Permintaan</strong>.</li>
    //           <li>Lihat semua permintaan yang masuk dari Lapangan.</li>
    //           <li>Periksa detail permintaan:
    //             <ul className="list-decimal ml-6 mt-2">
    //               <li>Pastikan material dan jumlah yang diminta sesuai.</li>
    //               <li>Jika diperlukan, lakukan konfirmasi ke lapangan.</li>
    //             </ul>
    //           </li>
    //           <li>Setelah diverifikasi, klik <strong>ACC</strong> pada permintaan yang disetujui.</li>
    //           <li>Permintaan yang sudah disetujui akan otomatis masuk ke proses pembuatan <strong>Purchase Order</strong>.</li>
    //         </ul>
    //       </ul>
    //       <li className="font-semibold">B. Membuat Confirmation Order:</li>
    //         <ul className="list-disc ml-6 space-y-2 text-gray-700">
    //           <li>Masuk ke menu Confirmation Order.</li>
    //           <li>Cari vendor berdasarkan data Material Vendor.</li>
    //           <li>Buat daftar vendor & harga untuk permintaan yang telah disetujui.</li>
    //           <li>Submit untuk dikonfirmasi oleh User Lapangan.</li>
    //         </ul>
    //       <li className="font-semibold">C. Melanjutkan ke Purchase Order:</li>
    //         <ul className="list-disc ml-6 space-y-2 text-gray-700">
    //             <li>Setelah User Lapangan mengonfirmasi, lanjutkan ke pembuatan PO berdasarkan item yang disetujui.</li>
    //             {/* <li>Cari vendor berdasarkan data Material Vendor.</li>
    //             <li>Buat daftar vendor & harga untuk permintaan yang telah disetujui.</li>
    //             <li>Submit untuk dikonfirmasi oleh User Lapangan.</li> */}
    //          </ul>
    //   </section>

    //   <div className="mt-8 text-center">
    //     <p className="text-gray-600 text-sm italic">
    //       Jika mengalami kendala, silakan hubungi Admin Aplikasi.
    //     </p>
    //   </div>
    // </div>


    <div className="p-6 bg-white rounded shadow">
  <h1 className="text-lg font-bold mb-4">📘 Petunjuk Penggunaan Aplikasi Purchasing</h1>

  <h2 className="text-md font-semibold mb-2">0️⃣ Pengaturan Awal (Data Master) - oleh User Purchasing</h2>
  <ul className="list-disc pl-6 mb-4">
    <li>Mengelola Data Material:
      <ul className="list-decimal pl-6">
        <li>Masuk ke menu <strong>Material</strong>.</li>
        <li>Tambahkan material baru (Nama, Satuan default, Kategori).</li>
      </ul>
    </li>
    <li>Mengelola Kategori Material:
      <ul className="list-decimal pl-6">
        <li>Masuk ke menu <strong>Kategori Material</strong>.</li>
        <li>Tambahkan kategori sesuai kebutuhan.</li>
      </ul>
    </li>
    <li>Mengelola Vendor:
      <ul className="list-decimal pl-6">
        <li>Masuk ke menu <strong>Vendor</strong>.</li>
        <li>Tambahkan vendor (Nama, Kontak, dsb).</li>
      </ul>
    </li>
    <li>Mengelola Material Vendor:
      <ul className="list-decimal pl-6">
        <li>Masuk ke menu <strong>Material Vendor</strong>.</li>
        <li>Mapping Material ke Vendor, masukkan harga, satuan, dsb.</li>
      </ul>
    </li>
  </ul>

  <h2 className="text-md font-semibold mb-2">1️⃣ Untuk User Lapangan</h2>
  <ul className="list-disc pl-6 mb-4">
    <li>Membuat Permintaan Lapangan:
      <ul className="list-decimal pl-6">
        <li>Login dengan akun Lapangan.</li>
        <li>Masuk menu <strong>Permintaan Lapangan</strong>.</li>
        <li>Klik <strong>Buat Permintaan Baru</strong>.</li>
        <li>Isi material, jumlah (QTY), satuan, keterangan.</li>
        <li>Submit permintaan.</li>
      </ul>
    </li>
    <li>Konfirmasi Barang (Confirmation Order):
      <ul className="list-decimal pl-6">
        <li>Masuk menu <strong>Confirmation Order</strong>.</li>
        <li>Periksa daftar vendor & barang.</li>
        <li>Konfirmasi barang yang sesuai (sebagian atau seluruhnya).</li>
      </ul>
    </li>
  </ul>

  <h2 className="text-md font-semibold mb-2">2️⃣ Untuk User Purchasing (Kantor)</h2>
  <ul className="list-disc pl-6 mb-4">
    <li>Memverifikasi Permintaan Lapangan:
      <ul className="list-decimal pl-6">
        <li>Login dengan akun Purchasing.</li>
        <li>Masuk menu <strong>Daftar Permintaan</strong>.</li>
        <li>Verifikasi permintaan (material, jumlah, klarifikasi jika perlu).</li>
        <li>ACC jika valid.</li>
      </ul>
    </li>
    <li>Membuat Confirmation Order:
      <ul className="list-decimal pl-6">
        <li>Masuk menu <strong>Confirmation Order</strong>.</li>
        <li>Mapping vendor berdasarkan data master.</li>
        <li>Submit untuk konfirmasi User Lapangan.</li>
      </ul>
    </li>
    <li>Melanjutkan ke Purchase Order:
      <ul className="list-decimal pl-6">
        <li>Setelah konfirmasi Lapangan selesai, lanjutkan pembuatan PO.</li>
      </ul>
    </li>
  </ul>

  <p className="italic text-sm text-red-500">🔒 Semua proses diaudit, transparan, dan mendukung pengendalian pembelian yang rapi.</p>
</div>

  );
}

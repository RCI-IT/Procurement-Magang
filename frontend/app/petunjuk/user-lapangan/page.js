"use client";
import React from "react";
import Image from "next/image";

export default function PetunjukPenggunaan() {
  return (
    
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Petunjuk Penggunaan Aplikasi Purchasing</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-600">1. Untuk User Lapangan</h2>
        <ul className="list-none ml-6 space-y-2">
          <li className="font-semibold">A. Membuat Permintaan Lapangan:</li>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Login ke aplikasi menggunakan akun yang telah diberikan.</li>
              <li>Pilih menu <strong>Permintaan Lapangan</strong>.</li>
              <Image
              src={`/procurement/guide/field/1.png`}
              width={600}
              height={200}
              alt="Permintaan Lapangan"
              />
              <li>Klik tombol <strong>Buat Permintaan Baru</strong>.</li>
              <Image
              src={`/procurement/guide/field/2.png`}
              width={600}
              height={200}
              alt="Permintaan Lapangan"
              />
              <li>Isi detail permintaan, seperti:
                <ul className="list-decimal ml-6 mt-2">
                  <li>Isikan data Permintaan Lapangan</li>
                  <Image
                    src={`/procurement/guide/field/3.png`}
                    width={600}
                    height={200}
                    alt="Permintaan Lapangan"
                  />
                  <li>Isikan data material, rincikan spesifikasi, kuantiti, satuan, dan code material.</li>
                  <li>Tambahkan keterangan tambahan jika diperlukan.</li>
                  <Image
                    src={`/procurement/guide/field/4.png`}
                    width={600}
                    height={200}
                    alt="Permintaan Lapangan"
                  />
                  <li>Jika dalam satu permintaan material terdapat lebih dari satu jenis material, klik tambah material untuk menambahkan material baru di form permintaan lapangan.</li>
                  <Image
                    src={`/procurement/guide/field/5.png`}
                    width={600}
                    height={200}
                    alt="Permintaan Lapangan"
                  />
                </ul>
              </li>
              <li>Setelah selesai, klik <strong>Submit</strong> untuk mengajukan permintaan.</li>
              <li>Permintaan akan otomatis masuk ke daftar untuk diverifikasi oleh Purchasing.</li>
              <Image
               src={`/procurement/guide/field/6.png`}
               width={600}
               height={200}
               alt="Permintaan Lapangan"
              />
            </ul>
          <li className="font-semibold">B. Melakukan Konfirmasi Barang (Confirmation Order):</li>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Masuk ke menu <strong>Confirmation Order</strong>.</li>
              <li>Lihat daftar barang yang sudah dipilihkan vendor oleh Purchasing.</li>
              <li>Periksa apakah barang, vendor, dan harga sudah sesuai.</li>
              <li>Beri konfirmasi per item:
                <ul>
                  <li>✅ Klik <strong>Konfirmasi</strong> pada item yang sesuai.</li>
                  <li>❌ Abaikan item yang tidak sesuai.</li>
                </ul>
              </li>
              <li>Hanya barang yang dikonfirmasi yang akan dilanjutkan ke proses PO.</li>
            </ul>
        </ul>
        
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">2. Untuk User Purchasing (Kantor)</h2>
        <ul className="list-none ml-6 space-y-2">
          <li className="font-semibold">A. Memverifikasi Permintaan Lapangan:</li>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Login ke aplikasi menggunakan akun Purchasing.</li>
              <li>Pilih menu <strong>Daftar Permintaan</strong>.</li>
              <li>Lihat semua permintaan yang masuk dari Lapangan.</li>
              <li>Periksa detail permintaan:
                <ul className="list-decimal ml-6 mt-2">
                  <li>Pastikan material dan jumlah yang diminta sesuai.</li>
                  <li>Jika diperlukan, lakukan konfirmasi ke lapangan.</li>
                </ul>
              </li>
              <li>Setelah diverifikasi, klik <strong>ACC</strong> pada permintaan yang disetujui.</li>
              <li>Permintaan yang sudah disetujui akan otomatis masuk ke proses pembuatan <strong>Purchase Order</strong>.</li>
            </ul>
          </ul>
          <li className="font-semibold">B. Membuat Confirmation Order:</li>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Masuk ke menu Confirmation Order.</li>
              <li>Cari vendor berdasarkan data Material Vendor.</li>
              <li>Buat daftar vendor & harga untuk permintaan yang telah disetujui.</li>
              <li>Submit untuk dikonfirmasi oleh User Lapangan.</li>
            </ul>
          <li className="font-semibold">C. Melanjutkan ke Purchase Order:</li>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                <li>Setelah User Lapangan mengonfirmasi, lanjutkan ke pembuatan PO berdasarkan item yang disetujui.</li>
                {/* <li>Cari vendor berdasarkan data Material Vendor.</li>
                <li>Buat daftar vendor & harga untuk permintaan yang telah disetujui.</li>
                <li>Submit untuk dikonfirmasi oleh User Lapangan.</li> */}
             </ul>
      </section>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm italic">
          Jika mengalami kendala, silakan hubungi Admin Aplikasi.
        </p>
      </div>
    </div>

  );
}

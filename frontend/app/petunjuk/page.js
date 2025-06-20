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
              src={`/guide/field/1.png`}
              width={1000}
              height={200}
              alt="Permintaan Lapangan"
              />
              <li>Klik tombol <strong>Buat Permintaan Baru</strong>.</li>
              <Image
              src={`/guide/field/2.png`}
              width={1000}
              height={200}
              alt="Permintaan Lapangan"
              />
              <li>Isi detail permintaan, seperti:
                <ul className="list-decimal ml-6 mt-2">
                  <li>Isikan data Permintaan Lapangan</li>
                  <Image
                    src={`/guide/field/3.png`}
                    width={1000}
                    height={200}
                    alt="Permintaan Lapangan"
                  />
                  <li>Isikan data material, rincikan spesifikasi, kuantiti, satuan, dan code material.</li>
                  <li>Tambahkan keterangan tambahan jika diperlukan.</li>
                  <Image
                    src={`/guide/field/4.png`}
                    width={1000}
                    height={200}
                    alt="Permintaan Lapangan"
                  />
                  <li>Jika dalam satu permintaan material terdapat lebih dari satu jenis material, klik tambah material untuk menambahkan material baru di form permintaan lapangan.</li>
                  <Image
                    src={`/guide/field/5.png`}
                    width={1000}
                    height={200}
                    alt="Permintaan Lapangan"
                  />
                </ul>
              </li>
              <li>Setelah selesai, klik <strong>Submit</strong> untuk mengajukan permintaan.</li>
              <li>Permintaan akan otomatis masuk ke daftar untuk diverifikasi oleh Purchasing.</li>
              <Image
               src={`/guide/field/6.png`}
               width={1000}
               height={200}
               alt="Permintaan Lapangan"
              />
            </ul>
          <li className="font-semibold">B. Melakukan Konfirmasi Barang (Confirmation Order):</li>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Masuk ke menu <strong>Confirmation Order</strong>.</li>
              <div className="flex flex-wrap justify-center items-center gap-4 relative max-w-full overflow-hidden">
                <div className="max-w-[45%]">
                  <Image
                    src={`/guide/field/7.png`}
                    width={1000}
                    height={200}
                    alt="Permintaan Lapangan"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="max-w-[45%]">
                  <Image
                    src={`/guide/field/8.png`}
                    width={1000}
                    height={200}
                    alt="Permintaan Lapangan"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
              
              <li>Lihat daftar barang yang sudah dipilihkan vendor oleh Purchasing.</li>
              <Image
               src={`/guide/field/9.png`}
               width={1000}
               height={200}
               alt="Permintaan Lapangan"
              />
              <li>Periksa apakah barang, vendor, dan harga sudah sesuai.</li>
              <Image
               src={`/guide/field/10.png`}
               width={1000}
               height={200}
               alt="Permintaan Lapangan"
              />
              <li>Beri konfirmasi per item:
                <ul>
                  <li>✅ Klik <strong>Konfirmasi</strong> pada item yang sesuai.</li>
                  <li>❌ Abaikan item yang tidak sesuai.</li>
                </ul>
              </li>

              <li>Hanya barang yang dikonfirmasi yang akan dilanjutkan ke proses PO.</li>
              <Image
               src={`/guide/field/11.png`}
               width={1000}
               height={200}
               alt="Permintaan Lapangan"
              />
            </ul>
        </ul>
        
      </section>

      <section className="mb-8">
  <h2 className="text-xl font-semibold mb-4 text-blue-600">
    2. Untuk User Purchasing (Kantor)
  </h2>

  <div className="space-y-6">

    {/* A. Pengaturan Awal */}
    <div>
      <h3 className="text-md font-semibold mb-2">A. Pengaturan Awal (Data Master)</h3>
      <ul className="space-y-3 ml-6 text-gray-700">
        <li>
          <strong>Mengelola Kategori Material:</strong>
          <ol className="list-decimal pl-6 mt-1 space-y-1">
            <li>Masuk ke menu <strong>Kategori Material</strong>.</li>
            <Image
              src={`/guide/office/1.png`}
              width={1000}
              height={200}
              alt="Permintaan Lapangan"
              className="rounded shadow"
            />
            <li>Tambahkan kategori sesuai kebutuhan.</li>
            <Image
              src={`/guide/office/2.png`}
              width={1000}
              height={200}
              alt="Permintaan Lapangan"
              className="rounded shadow"
            />
          </ol>
        </li>

        <li>
          <strong>Mengelola Vendor:</strong>
          <ol className="list-decimal pl-6 mt-1 space-y-1">
            <li>Masuk ke menu <strong>Vendor</strong>.</li>
            <Image
              src={`/guide/office/3.png`}
              width={1000}
              height={200}
              alt="Permintaan Lapangan"
              className="rounded shadow"
            />
            <li>Tambahkan vendor (Nama, Kontak, dsb).</li>
            <Image
              src={`/guide/office/4.png`}
              width={1000}
              height={200}
              alt="Permintaan Lapangan"
              className="rounded shadow"
            />
            <Image
              src={`/guide/office/4b.png`}
              width={300}
              height={300}
              alt="Permintaan Lapangan"
              className="rounded shadow"
            />
          </ol>
        </li>

        <li>
          <strong>Mengelola Data Material:</strong>
          <ol className="list-decimal pl-6 mt-1 space-y-1">
            <li>Masuk ke menu <strong>Material</strong>.</li>
            <Image
              src={`/guide/office/5.png`}
              width={1000}
              height={200}
              alt="Permintaan Lapangan"
              className="rounded shadow"
            />
            <li>Tambahkan material baru (Nama, Satuan default, Kategori).</li>
            <Image
              src={`/guide/office/6.png`}
              width={1000}
              height={200}
              alt="Permintaan Lapangan"
              className="rounded shadow"
            />
          </ol>
        </li>
      </ul>
    </div>

    {/* B. Memverifikasi Permintaan */}
    <div>
      <h3 className="text-md font-semibold mb-2">B. Memverifikasi Permintaan Lapangan:</h3>
      <ul className="list-disc ml-6 space-y-2 text-gray-700">
        <li>Login ke aplikasi menggunakan akun Purchasing.</li>
        <li>Pilih menu <strong>Daftar Permintaan</strong>.</li>
          <Image
            src={`/guide/office/7.png`}
            width={1000}
            height={200}
            alt="Permintaan Lapangan"
            className="rounded shadow"
          />
        <li>Lihat semua permintaan yang masuk dari Lapangan.</li>
        <Image
          src={`/guide/office/8.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
        <li>
          Periksa detail permintaan:
          <ol className="list-decimal ml-6 mt-2 space-y-1">
            <li>Pastikan material dan jumlah yang diminta sesuai. Lalu ubah status sesuai dengan proses yang sedang dilakukan terhadap material yang diminta.</li>
            <Image
              src={`/guide/office/9.png`}
              width={1000}
              height={200}
              alt="Permintaan Lapangan"
              className="rounded shadow"
            />
            <li>Jika diperlukan, lakukan konfirmasi ke lapangan.</li>
          </ol>
        </li>
        <li>Setelah diverifikasi, klik <strong>ACC</strong> pada permintaan yang disetujui.</li>
        <li>Permintaan yang sudah disetujui akan otomatis masuk ke proses pembuatan <strong>Purchase Order</strong>.</li>
      </ul>
    </div>

    {/* C. Confirmation Order */}
    <div>
      <h3 className="text-md font-semibold mb-2">C. Membuat Confirmation Order:</h3>
      <ul className="list-disc ml-6 space-y-2 text-gray-700">
        <li>Masuk ke menu Confirmation Order.</li>
        <Image
          src={`/guide/office/10.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
        <li>Klik tombol <strong>Tambah Confirmation Order</strong>.</li>
        <Image
          src={`/guide/office/11.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
        <li>Isi data Confirmation.</li>
        <Image
          src={`/guide/office/12.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
        <li>Lalu pilih Permintaan Lapangan yang terkait dengan Confirmation Order, makan akan ditampilkan material yang diminta di PL tersebut.</li>
        <Image
          src={`/guide/office/13.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
        <li>Cari vendor berdasarkan data Material yang sudah di input sebagai data master sebelumnya.</li>
        <Image
          src={`/guide/office/14.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
        <li>Pilih material yang sesuai untuk dikonfirmasi oleh User Lapangan. Tambahkan juga data tambahan jika diperlukan.</li>
        <Image
          src={`/guide/office/15.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
        <li>Submit untuk dikonfirmasi oleh User Lapangan.</li>
        <Image
          src={`/guide/office/16.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
      </ul>
    </div>

    {/* D. Purchase Order */}
    <div>
      <h3 className="text-md font-semibold mb-2">D. Melanjutkan ke Purchase Order:</h3>
      <ul className="list-disc ml-6 space-y-2 text-gray-700">
        <li>Setelah User Lapangan mengonfirmasi, lanjutkan ke pembuatan PO berdasarkan item yang disetujui.</li>
        <Image
          src={`/guide/office/17.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
        <Image
          src={`/guide/office/18.png`}
          width={1000}
          height={200}
          alt="Permintaan Lapangan"
          className="rounded shadow"
        />
      </ul>
    </div>

  </div>
</section>



      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm italic">
          Jika mengalami kendala, silakan hubungi Admin Aplikasi.
        </p>
      </div>
    </div>

  );
}

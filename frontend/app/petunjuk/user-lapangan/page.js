"use client";
import React from "react";
import Image from "next/image";

export default function PetunjukPenggunaan() {
  return (
    
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Petunjuk Penggunaan Aplikasi Purchasing</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-600">Untuk User Lapangan</h2>
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


      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm italic">
          Jika mengalami kendala, silakan hubungi Admin Aplikasi.
        </p>
      </div>
    </div>

  );
}

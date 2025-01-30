// app/detail-vendor/[vendorId]/page.js
'use client';  // Tambahkan 'use client' untuk menandakan ini adalah Client Component
import { usePathname, useSearchParams } from 'next/navigation';  // Import dari next/navigation
import DetailVendor from '../../../component/DetailVendor';  // Perbaiki jalur relatif

export default function VendorPage() {
  const pathname = usePathname();  // Mendapatkan pathname dari URL
  const vendorId = pathname.split('/')[2];  // Mendapatkan vendorId dari URL (/detail-vendor/[vendorId])

  if (!vendorId) {
    return <p>Loading...</p>;  // Menampilkan loading jika vendorId tidak ada
  }

  return (
    <div className="p-6">
      <DetailVendor vendorId={vendorId} />  {/* Kirim vendorId ke komponen DetailVendor */}
    </div>
  );
}

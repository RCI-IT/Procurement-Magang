'use client';  
import { usePathname, useSearchParams } from 'next/navigation';  
import DetailVendor from '../../../component/DetailVendor';  

export default function VendorPage() {
  const pathname = usePathname();  
  const vendorId = pathname.split('/')[2];  

  if (!vendorId) {
    return <p>Loading...</p>;  
  }

  return (
    <div className="p-6">
      <DetailVendor vendorId={vendorId} />  
    </div>
  );
}

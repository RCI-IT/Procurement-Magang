import Link from "next/link";
import DetailPermintaan from '../../DetailPermintaanLapangan';  

const permintaanData = [
  { id: "1", nama: "Lapangan A" },
  { id: "2", nama: "Lapangan B" },
];

export default function DaftarPermintaan() {
  return (
    <div>
      <h1>Daftar Permintaan</h1>
     <div className="p-6">
        <DetailPermintaan itemid/>  
      </div>
    </div>
  );
}

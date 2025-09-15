"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoIosNotificationsOutline } from "react-icons/io";
// import logo1 from "/assets/logo-1.png";

export default function Header() {
  const pathname = usePathname();

  // Sembunyikan header di halaman login
  if (pathname === "/login" || pathname === "/signin") return null;
  return (
    <div className="absolute top-0 right-5 flex items-center justify-between pt-5">
      <div className="grid grid-cols-[48px_1fr] gap-x-4">
        <div className="flex items-center justify-center rounded-xl z-50 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-white">
          <IoIosNotificationsOutline className="text-2xl" />
        </div>
        <div className="p-2 rounded-xl z-20 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex items-center space-x-2 bg-white overflow-hidden">
          <div className="relative rounded-full w-8 h-8 bg-blue-500">
            <Image
              src={`/assets/logo-1.png`}
              alt="Logo"
              loading="lazy"
              decoding="async"
              width={500}
              height={500}
              className="w-full h-full object-contain object-center"
            />
          </div>
          <p className="text-sm">Nama Pengguna</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";  // Menggunakan useRouter untuk mengubah URL
import Home from "./home/page";
import PermintaanLapangan from "./permintaan-lapangan/page";
import PurchaseOrder from "./purchase-order/page";
import Material from "./material/page";
import Setting from "./Setting";
import AddPermintaanLapanganForm from "./permintaan-lapangan/add/page";
import { useData } from "../context/DataContext";

export default function MainPage() {
  const router = useRouter();
  const pathname = usePathname();  // Mengambil path untuk memastikan URL yang benar
  const [page, setPage] = useState("home");  // Default halaman adalah 'home'
  const { permintaanLapanganData, setPermintaanLapanganData } = useData();

  // Fungsi untuk menambah permintaan lapangan
  const handleAddPermintaan = (newData) => {
    setPermintaanLapanganData((prevData) => [...prevData, newData]);
  };

  useEffect(() => {
    // Ambil parameter query 'page' dari URL untuk menentukan halaman yang aktif
    const params = new URLSearchParams(window.location.search);
    const pageFromURL = params.get("page") || "home";  // Default ke "home" jika tidak ada
    setPage(pageFromURL);  // Update state page dengan nilai query 'page' di URL
  }, [pathname]);  // Menjalankan ulang efek jika pathname berubah

  // Fungsi untuk menangani navigasi antar halaman
  const handleNavigate = (newPage) => {
    // Update URL sesuai dengan halaman baru yang dipilih
    router.push(`/?page=${newPage}`);
    setPage(newPage);  // Perbarui state 'page' untuk merender konten yang sesuai
  };

  const renderContent = () => {
    switch (page) {
      case "home":
        return <Home />;
      case "permintaan-lapangan":
        return (
          <PermintaanLapangan
            data={permintaanLapanganData || []}
            setActiveContent={setPage}
          />
        );
      case "purchase-order":
        return <PurchaseOrder />;
      case "material":
        return <Material />;
      case "setting":
        return <Setting />;
      case "tambah-permintaan":
        return (
          <AddPermintaanLapanganForm
            onAddPermintaan={handleAddPermintaan}
            setActiveContent={setPage}
          />
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-lg text-gray-800 font-semibold mb-4">
        <div className="flex items-center">
          {/* Navigasi berdasarkan page yang aktif */}
          {page && (
            <button
              onClick={() => handleNavigate("home")}
              className="text-blue-600 hover:underline"
            >
              {page === "home" ? "Home" : page.replace(/-/g, " ")}
            </button>
          )}
        </div>
      </nav>

      {/* Render Konten Berdasarkan Halaman yang Aktif */}
      {renderContent()}
    </div>
  );
}

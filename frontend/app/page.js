"use client";

import React from "react";
import Sidebar from "../component/sidebar";
import Home from "./Home";
import PermintaanLapangan from "./PermintaanLapangan";
import PurchaseOrder from "./PurchaseOrder";
import ConfirmationOrder from "./ConfirmationOrder";
import Material from "./material/page";
import Setting from "./Setting";
import AddPermintaanLapanganForm from "./AddPermintaanLapanganForm";
import { DataProvider, useData } from "../context/DataContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function MainContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const { permintaanLapanganData, setPermintaanLapanganData } = useData(); // ✅ Ambil data dari Context

  const handleAddPermintaan = (newData) => {
    setPermintaanLapanganData((prevData) => [...prevData, newData]);
  };

  const renderContent = () => {
    switch (page) {
      case "home":
        return < page />;
      case "permintaan-lapangan":
        return <PermintaanLapangan data={permintaanLapanganData} />;
      case "purchase-order":
        return <PurchaseOrder />;
      case "confirmation-order":
        return <ConfirmationOrder />;
      case "material":
        return <Material />;
      case "setting":
        return <Setting />;
      case "tambah-permintaan":
        return <AddPermintaanLapanganForm onAddPermintaan={handleAddPermintaan} />;
      default:
        return <Home />;
    }
  };

  return <div className="flex-1 p-6">{renderContent()}</div>;
}

export default function MainPage() {
  return (
    <DataProvider>
      <div className="flex">
        <Sidebar />
        <MainContent /> {/* Pisahkan Content agar Context bekerja dengan baik */}
      </div>
    </DataProvider>
  );
}

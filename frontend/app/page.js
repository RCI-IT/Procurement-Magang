"use client";

import React, { useState } from "react";
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

export default function MainPage() {
  const [activeContent, setActiveContent] = useState("home");
  const searchParams = useSearchParams();
  const page = searchParams.get("page"); // Ambil query parameter "page"
  const { permintaanLapanganData, setPermintaanLapanganData } = useData(); // Ambil data permintaan lapangan

  const handleAddPermintaan = (newData) => {
    setPermintaanLapanganData((prevData) => [...prevData, newData]);
  };

  const renderContent = () => {
    switch (page) {
      case "home":
        return <Home />;
      case "permintaan-lapangan":
        return (
          <PermintaanLapangan
            data={permintaanLapanganData}
            setActiveContent={setActiveContent} // Pastikan setActiveContent diteruskan ke PermintaanLapangan
          />
        );
      case "purchase-order":
        return <PurchaseOrder />;
      case "confirmation-order":
        return <ConfirmationOrder />;
      case "material":
        return <Material />;
      case "setting":
        return <Setting />;
      case "tambah-permintaan":
        return (
          <AddPermintaanLapanganForm
            onAddPermintaan={handleAddPermintaan}
            setActiveContent={setActiveContent} // Pastikan diteruskan dengan benar
          />
        );
      default:
        return <Home />;
    }
  };

  return (
    <DataProvider>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </DataProvider>
  );
}

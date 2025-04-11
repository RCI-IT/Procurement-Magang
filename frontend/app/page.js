"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";  
import Home from "./home/page";
import PermintaanLapangan from "./permintaan-lapangan/page";
import PurchaseOrder from "./purchase-order/page";
import Material from "./material/page";
import Setting from "./Setting";
import AddPermintaanLapanganForm from "./permintaan-lapangan/add/page";
import ConfirmationOrder from "./confirmation-order/page";
import { useData } from "../context/DataContext";
import { useSearchParams } from "next/navigation";

export default function MainPage() {
  const [setActiveContent] = useState("home");
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const { permintaanLapanganData, setPermintaanLapanganData } = useData();

  const handleAddPermintaan = (newData) => {
    setPermintaanLapanganData((prevData) => [...prevData, newData]);
  };

  useEffect(() => {
    if (!permintaanLapanganData) {
      setPermintaanLapanganData([]); 
    }
  }, [permintaanLapanganData, setPermintaanLapanganData]);

  const renderContent = () => {
    switch (page) {
      case "home":
        return <Home />;
      case "permintaan-lapangan":
        return (
          <PermintaanLapangan
            data={permintaanLapanganData || []} 
            setActiveContent={setActiveContent}
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
            setActiveContent={setActiveContent}
          />
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex-1 p-6">
      <nav className="flex items-center text-lg text-gray-800 font-semibold mb-4">
        <div className="flex items-center">
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

      {renderContent()}
    </div>
  );
}
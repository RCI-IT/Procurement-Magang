"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";  
import Home from "./home/page";
import PermintaanLapangan from "./permintaan-lapangan/page";
import PurchaseOrder from "./purchase-order/page";
import Material from "./material/page";
import Setting from "./Setting";
import AddPermintaanLapanganForm from "./permintaan-lapangan/add/page";
import ConfirmationOrder from "./confirmation-order/page"; // Import new page
import { useData } from "../context/DataContext";

export default function MainPage() {
  const router = useRouter();
  const pathname = usePathname();  
  const [page, setPage] = useState("home");  
  const { permintaanLapanganData, setPermintaanLapanganData } = useData();

  const handleAddPermintaan = (newData) => {
    setPermintaanLapanganData((prevData) => [...prevData, newData]);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageFromURL = params.get("page") || "home";  
    setPage(pageFromURL);  
  }, [pathname]);  

  const handleNavigate = (newPage) => {
    router.push(`/?page=${newPage}`);
    setPage(newPage); 
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

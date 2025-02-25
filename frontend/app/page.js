'use client';

import React, { useState, useEffect } from "react";
import Sidebar from "../component/sidebar";
import Home from "./Home";
import PermintaanLapangan from "./PermintaanLapangan";
import PurchaseOrder from "./PurchaseOrder";
import ConfirmationOrder from "./ConfirmationOrder";
import Material from "./Material";
import Setting from "./Setting";
import AddPermintaanLapanganForm from "./AddPermintaanLapanganForm";
import { DataProvider } from "../context/DataContext";

export default function MainPage() {
  const [permintaanLapanganData, setPermintaanLapanganData] = useState([]);
  const [activeContent, setActiveContent] = useState(null);
  const [isMounted, setIsMounted] = useState(false); // Track mounting state
  const [page, setPage] = useState(null); // Track query page

  useEffect(() => {
    setIsMounted(true); // Ensure component is mounted
  }, []);

  useEffect(() => {
    if (isMounted) {
      const queryPage = new URLSearchParams(window.location.search).get('page');
      setPage(queryPage); // Get 'page' from query after component mounts
    }
  }, [isMounted]);

  const handleAddPermintaan = (newData) => {
    setPermintaanLapanganData((prevData) => [...prevData, newData]);
  };

  // Function to render content based on query parameter
  const renderContent = () => {
    if (!isMounted || !page) return null; // Wait until mounted and query is available

    switch (page) {
      case "home":
        return <Home />;
      case "permintaan-lapangan":
        return <PermintaanLapangan data={permintaanLapanganData} setActiveContent={setActiveContent} />;
      case "purchase-order":
        return <PurchaseOrder />;
      case "confirmation-order":
        return <ConfirmationOrder />;
      case "material":
        return <Material />;
      case "setting":
        return <Setting />;
      case "tambah-permintaan":
        return <AddPermintaanLapanganForm setActiveContent={setActiveContent} onAddPermintaan={handleAddPermintaan} />;
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

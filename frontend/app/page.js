"use client";

import { useState } from "react";
import Sidebar from "./sidebar/sidebar";
import Home from "./pages/Home";
import PermintaanLapangan from "./pages/PermintaanLapangan";
import PurchaseOrder from "./pages/PurchaseOrder";
import ConfirmationOrder from "./pages/ConfirmationOrder";
import Material from "./pages/Material";
import Setting from "./pages/Setting";

export default function MainPage() {
  const [activeContent, setActiveContent] = useState("home");

  const renderContent = () => {
    switch (activeContent) {
      case "home":
        return <Home />;
      case "permintaan-lapangan":
        return <PermintaanLapangan />;
      case "purchase-order":
        return <PurchaseOrder />;
      case "confirmation-order":
        return <ConfirmationOrder />;
      case "material":
        return <Material />;
      case "setting":
        return <Setting />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex">
      <Sidebar setActiveContent={setActiveContent} />
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
}

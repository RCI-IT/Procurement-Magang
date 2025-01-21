"use client";

import { useState } from "react";
import Sidebar from "../component/sidebar";
import Home from "../component/Home";
import PermintaanLapangan from "../component/PermintaanLapangan";
import PurchaseOrder from "../component/PurchaseOrder";
import ConfirmationOrder from "../component/ConfirmationOrder";
import Material from "../component/Material";
import Setting from "../component/Setting";

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

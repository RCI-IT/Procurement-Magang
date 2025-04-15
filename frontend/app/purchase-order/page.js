"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../component/sidebar.js";
import Header from "../../component/Header.js";

export default function ConfirmationOrder() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header username={username} />
        <h1 className="text-xl font-semibold text-gray-800">Purchase Order</h1>
        <p className="mt-4 text-gray-600">kosongan</p>
      </div>
    </div>
  );
}

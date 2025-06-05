"use client";
import { fetchWithAuth } from "@/services/apiClient";
import { useEffect, useState } from "react";

export default function TandaTanganQR() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const [data, setData] = useState({
    nama: "",
    tanggal: "",
    tujuan: "",
  });
  const [qrCode, setQrCode] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/signing/generate-qrcode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      setQrCode(result.qrCode); // asumsi key-nya `qrCode`
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };
  return (
    <div className="flex h-screen">
      <div className="p-6 bg-white flex-1 h-screen shadow-md rounded-lg overflow-y-auto">
        <h2>Generate QR Code with Digital Signature</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nama:</label>
            <input
              type="text"
              name="nama"
              value={data.nama}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Tanggal:</label>
            <input
              type="date"
              name="tanggal"
              value={data.tanggal}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Tujuan:</label>
            <input
              type="text"
              name="tujuan"
              value={data.tujuan}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Generate QR Code</button>
        </form>

        {qrCode && (
          <div>
            <h3>QR Code:</h3>
            <img src={qrCode} alt="QR Code" />
          </div>
        )}
      </div>
    </div>
  );
}

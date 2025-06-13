"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithToken } from "../../../services/fetchWithToken";

export default function MaterialPage() {
  const { id } = useParams();
  const router = useRouter();

  const [material, setMaterial] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [relatedMaterials, setRelatedMaterials] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setTimeout(() => router.push("/login"), 800);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error("User JSON parse error:", error);
      router.push("/login");
    }
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, [router]);

  const getData = async () => {
    const materialData = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/materials/${id}`,
      token,
      setToken,
      () => router.push("/login")
    );

    if (!materialData) return;
    setMaterial(materialData);

    const vendorData = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/vendors/${materialData.vendorId}`,
      token,
      setToken,
      () => router.push("/login")
    );
    if (vendorData) setVendor(vendorData);

    const relatedMaterial = await fetchWithToken(
      `${process.env.NEXT_PUBLIC_API_URL}/materials?vendorId=${materialData.vendorId}`,
      token,
      setToken,
      () => router.push("/login")
    );
    if (relatedMaterial) setRelatedMaterials(relatedMaterial);

    setError(null);
  };

  useEffect(() => {
    fetchData();
    setIsLoading(false);
  }, [token]);

  const fetchData = () => {
    getData();
  };

  const formattedPrice =
    material?.price !== null
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(material?.price)
      : "Harga tidak tersedia";

  if (loading)
    return <div className="text-center text-blue-500">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;
  if (!material || !vendor || !relatedMaterials)
    return (
      <div className="text-center text-gray-500">Material tidak ditemukan.</div>
    );

  return (
    <div className="flex">
      <div className="p-6 flex-1">
        <div className="w-full"></div>
        <div className="mb-6 bg-white shadow-md p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">
                {vendor?.name || "Vendor Tidak Diketahui"}
              </h2>
              <p className="text-gray-600 text-sm">
                {vendor?.address || "Alamat tidak tersedia"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-gray-800 font-medium">
                {vendor?.phone || "Tidak ada kontak"}
              </p>
              {vendor?.phone && (
                <a
                  href={`https://wa.me/${vendor.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
                >
                  <span className="mr-2">Hubungi</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-start mb-8 bg-white shadow-md p-4 rounded-md">
          <div className="bg-gray-100 border border-gray-300 rounded p-4 flex justify-center">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${material.imageUrl}`}
              alt={material.image}
              className="object-cover max-h-72"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-2xl font-bold mb-2">{material.name}</h3>
            <p className="text-xl text-blue-600 font-semibold mb-4">
              {formattedPrice}
            </p>
            <p className="text-sm text-gray-500">
              Code:{" "}
              <span className="text-gray-700">
                {material.code || "Tidak ada kategori"}
              </span>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Kategori:{" "}
              <span className="text-gray-700">
                {material.category || "Tidak ada kategori"}
              </span>
            </p>
            <h4 className="font-bold text-lg mb-2">Deskripsi</h4>
            <p className="text-gray-700 text-sm">
              {material.description || "Tidak ada deskripsi"}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-md">
          <h4 className="font-bold text-lg mb-4">
            Material lainnya dari vendor ini
          </h4>
          {relatedMaterials.length === 0 && (
            <p className="text-center text-gray-500">
              Tidak ada material lain dari vendor ini.
            </p>
          )}
          <div className="flex justify-start gap-4">
            {relatedMaterials.map((item) => {
              const relatedImage = item.image?.startsWith("http")
                ? item.image
                : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${
                    item.image || "default-image.jpg"
                  }`;
              return (
                <div
                  key={item.id}
                  className="border rounded p-4 text-center bg-white text-sm w-40 h-48 flex flex-col items-center shadow"
                >
                  <img
                    src={relatedImage}
                    alt={item.name}
                    className="mb-2 w-20 h-20 object-cover"
                  />
                  <p className="font-semibold text-center break-words">
                    {item.name}
                  </p>
                  <p className="text-red-500">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item.price)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          {user?.role !== "USER_LAPANGAN" && (
            <button
              onClick={() => router.push(`/material/${id}/edit`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Material
            </button>
          )}
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

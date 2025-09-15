"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/services/apiClient";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";

const FILE_TYPES = [
  { value: "PERMINTAAN_LAPANGAN", label: "Permintaan Lapangan" },
  { value: "CONFIRMATION_ORDER", label: "Confirmation Order" },
  { value: "PURCHASE_ORDER", label: "Purchase Order" },
  // { value: "PL", label: "PL" },
  // { value: "CO", label: "CO" },
  // { value: "PO", label: "PO" },
];

const SIGNING_ROLES = [
  { value: "ENGINEER_REQUESTER", label: "Engineer Requester" },
  { value: "ENGINEER_CHECKER", label: "Engineer Checker" },
  { value: "LOGISTIC", label: "Logistic" },
  { value: "PIC_LAPANGAN", label: "PIC Lapangan" },
  { value: "PURCHASING", label: "Purchasing" },
  { value: "SITE_MANAGER", label: "Site Manager" },
  { value: "VENDOR", label: "Vendor" },
  { value: "FINANCE", label: "Finance" },
  { value: "DIREKSI", label: "Direksi" },
];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [authorities, setAuthorities] = useState([{ fileType: "", role: "" }]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
          { headers: { "Content-Type": "application/json" } }
        );

        if (!res.ok) throw new Error("Gagal mengambil data user");

        const data = await res.json();

        setUsername(data.username);
        setFullName(data.fullName);
        setEmail(data.email);
        setRole(data.role);

        // jika data authorities tersedia
        if (data.authorities && data.authorities.length > 0) {
          const mappedAuthorities = data.authorities.map((auth) => ({
            fileType: auth.fileType,
            role: auth.role,
          }));
          setAuthorities(mappedAuthorities);
        } else {
          setAuthorities([{ fileType: "", role: "" }]);
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error.message,
        });
        router.push("/usercontrol");
      }
    };

    if (id) fetchUser();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, role, authorities }),
        }
      );

      if (!res.ok) throw new Error("Gagal mengupdate user");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "User berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/usercontrol");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <main className="p-6 flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-4">Edit User</h1>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block font-medium">Username</label>
              <input
                type="text"
                value={username}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-medium">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="ADMIN">Admin</option>
                <option value="USER_PURCHASE">User Purchase</option>
                <option value="USER_LAPANGAN">User Lapangan</option>
              </select>
            </div>

            <h2 className="font-semibold mb-2">Signing Authorities</h2>

            {authorities.map((auth, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <select
                  value={auth.fileType}
                  onChange={(e) => {
                    const updated = [...authorities];
                    updated[i].fileType = e.target.value;
                    setAuthorities(updated);
                  }}
                  className="border p-2"
                >
                  <option value="">Pilih FileType</option>
                  {FILE_TYPES.map((ft) => (
                    <option key={ft.value} value={ft.value}>
                      {ft.label}
                    </option>
                  ))}
                </select>

                <select
                  value={auth.role}
                  onChange={(e) => {
                    const updated = [...authorities];
                    updated[i].role = e.target.value;
                    setAuthorities(updated);
                  }}
                  className="border p-2"
                >
                  <option value="">Pilih Role</option>
                  {SIGNING_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    const updated = authorities.filter((_, idx) => idx !== i);
                    setAuthorities(updated);
                  }}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  Hapus
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setAuthorities([...authorities, { fileType: "", role: "" }])
              }
              className="mb-4 px-4 py-1 bg-blue-500 text-white rounded"
            >
              + Tambah Authority
            </button>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => router.push("/usercontrol")}
                className="bg-gray-500 text-white px-4 py-2 w-32 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 w-32 rounded"
              >
                Simpan
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

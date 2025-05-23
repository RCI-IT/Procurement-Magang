"use client";

import { useState } from "react";
import { fetchWithAuth } from "../../../services/apiClient";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AddUserPage() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [showPassword, setShowPassword] = useState(false);
  // const [loggedInUsername, setLoggedInUsername] = useState("");
  const router = useRouter();

  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   if (storedUsername) setLoggedInUsername(storedUsername);
  // }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, fullName, email, password, role }),
        }
      );

      if (!res.ok) throw new Error("Gagal menambahkan user");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "User berhasil ditambahkan",
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
          <h1 className="text-3xl font-bold mb-4">Tambah User</h1>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
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

            <div className="mb-4">
              <label className="font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
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

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../component/sidebar.js";
import Header from "../../component/Header.js";
import { Eye, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

export default function User() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow] = useState(5);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);

        if (!userRes.ok) throw new Error("Gagal mengambil data");

        const userData = await userRes.json();
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);



const handleDelete = async (id) => {
  // Use SweetAlert2 for confirmation
  const result = await Swal.fire({
    title: 'Yakin ingin menghapus user ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    reverseButtons: true
  });

  if (!result.isConfirmed) return; // If the user clicks "Cancel", don't delete

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Gagal menghapus user");

    setUsers((prev) => prev.filter((user) => user.id !== id));

    // Success alert
    Swal.fire({
      title: 'User berhasil dihapus!',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    // Error alert
    Swal.fire({
      title: 'Gagal menghapus user!',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'Tutup'
    });
  }
};


  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1 overflow-auto">
          <div className="w-full">
            <Header username={username} />
          </div>

          <h1 className="text-3xl font-bold mb-4">User</h1>

          <div className="mb-4 flex justify-between space-x-2">
            <input
              type="text"
              placeholder="Cari User"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => router.push("/user/add")}
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              + User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Fullname</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => u.username.toLowerCase().includes(searchQuery))
                  .slice(0, rowsToShow)
                  .map((user, index) => (
                    <tr key={user.id}>
                      <td className="border px-4 py-2 text-center">{index + 1}</td>
                      <td className="border px-4 py-2 text-center">{user.username}</td>
                      <td className="border px-4 py-2 text-center">{user.fullName}</td>
                      <td className="border px-4 py-2 text-center">{user.email}</td>
                      <td className="border px-4 py-2 text-center">{user.role}</td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                        >
                          <Trash2 className="text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

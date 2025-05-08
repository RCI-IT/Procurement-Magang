"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../component/sidebar.js";
import Header from "../../component/Header.js";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

function PasswordCell({ password }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center justify-center gap-2">
      <span>{showPassword ? password : "Coba Tekan Ini ~>"}</span>
      <button onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function User() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsToShow, setRowsToShow] = useState(5);
  const [sortBy, setSortBy] = useState("username");
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
        if (!res.ok) throw new Error("Gagal ambil data user");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus user ini?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, Hapus!",
    });
    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Gagal menghapus user");

      setUsers((prev) => prev.filter((user) => user.id !== id));

      Swal.fire({
        title: "User berhasil dihapus!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        title: "Gagal menghapus user!",
        text: error.message,
        icon: "error",
        confirmButtonText: "Tutup",
      });
    }
  };

  const filteredUsers = users
    .filter((u) => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "username") return a.username.localeCompare(b.username);
      if (sortBy === "role") return a.role.localeCompare(b.role);
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const totalPages = Math.ceil(filteredUsers.length / rowsToShow);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsToShow, currentPage * rowsToShow);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1 overflow-auto">
          <Header username={username} />
          <br></br>
          <h1 className="text-3xl font-bold mb-4">User</h1>
          <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
            <div className="flex gap-3">
            <label className="mr-2">Urutkan :</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="username">Username</option>
                <option value="role">Role</option>
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
              <label className="mr-2">Tampilkan:</label>
              <select
                value={rowsToShow}
                onChange={(e) => {
                  setRowsToShow(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Cari User"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1"
              />
              <button
                onClick={() => router.push("/usercontrol/add")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                + User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Fullname</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Password</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2 text-center">
                      {(currentPage - 1) * rowsToShow + index + 1}
                    </td>
                    <td className="border px-4 py-2 text-center">{user.username}</td>
                    <td className="border px-4 py-2 text-center">{user.fullName}</td>
                    <td className="border px-4 py-2 text-center">{user.email}</td>
                    <td className="border px-4 py-2 text-center">
                      <PasswordCell password={user.password} />
                    </td>
                    <td className="border px-4 py-2 text-center">{user.role}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white rounded px-2 py-1"
                      >
                        <Trash2 className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-6">
  <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-2 border border-gray-300 text-blue-600 hover:bg-gray-100 disabled:text-gray-400"
    >
      «
    </button>
    {[...Array(totalPages)].map((_, index) => {
      const page = index + 1;
      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-2 border border-gray-300 ${
            currentPage === page ? "text-white bg-blue-500" : "text-blue-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      );
    })}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-3 py-2 border border-gray-300 text-blue-600 hover:bg-gray-100 disabled:text-gray-400"
    >
      »
    </button>
  </nav>
</div>

          </div>
        </main>
      </div>
    </div>
  );
}


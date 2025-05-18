"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
//import Sidebar from "../../component/sidebar.js";
//import Header from "../../component/Header.js";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/globals.css";

function PasswordCell({ password }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center justify-center gap-2">
      <span>{showPassword ? password : "Coba Tekan Ini ~>"}</span>
      <button onClick={() => setShowPassword(!showPassword)}>
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
  const [token, setToken] = useState("");
  // const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // if (!res.ok) throw new Error("Gagal ambil data user");
        if (res.status === 401 || !res.ok) {
          // Coba refresh token
          const refreshRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken = refreshData.newAccessToken;

            // Simpan token baru
            localStorage.setItem("token", newToken);

            // Panggil ulang fetch data
            const retryRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users`,
              {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
                credentials: "include",
              }
            );

            if (!retryRes.ok) throw new Error("Gagal setelah refresh token");
            const retryData = await retryRes.json();
            setUsers(retryData);
          } else {
            router.push("login");
          }
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   if (storedUsername) setUsername(storedUsername);
  // }, []);

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const totalPages = Math.ceil(filteredUsers.length / rowsToShow);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsToShow,
    currentPage * rowsToShow
  );

  return (
    <div className="user-container">
      <div className="user-content">
        <main className="user-main">
          <h1 className="user-header">User</h1>
          <div className="user-controls">
            <div className="user-controls-left">
              <label>Urutkan:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="user-select"
              >
                <option value="username">Username</option>
                <option value="role">Role</option>
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>

              <label>Tampilkan:</label>
              <select
                value={rowsToShow}
                onChange={(e) => {
                  setRowsToShow(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="user-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="user-controls-right">
              <input
                type="text"
                placeholder="Cari User"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="user-input"
              />
              <button
                onClick={() => router.push("/usercontrol/add")}
                className="user-button-add"
              >
                + User
              </button>
            </div>
          </div>

          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>Fullname</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{(currentPage - 1) * rowsToShow + index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      <PasswordCell password={user.password} />
                    </td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="user-delete-button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="user-pagination">
              <nav>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "active" : ""}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
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

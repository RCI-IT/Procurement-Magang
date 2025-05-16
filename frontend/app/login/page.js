"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/authServices"; // path menyesuaikan struktur proyek kamu

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    try {
      const data = await login(username, password); // login API
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      // Setelah login berhasil, ambil data user untuk simpan role, dsb
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data user");

      const userList = await res.json();
      const validUser = userList.find((user) => user.username === username);

      if (validUser) {
        localStorage.setItem("username", validUser.username);
        localStorage.setItem("role", validUser.role);
      }

      setMessage("Login successful!");
      router.push("/home");
    } catch (err) {
      setMessage(err.message || "Login gagal");
    }
  };

  // if (loading) {
  //   return <div className="text-center">Loading...</div>;
  // }

  // if (error) {
  //   return <div className="text-center text-red-500">{error}</div>;
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-blue-500">
      <div className="p-8 bg-blue-500 text-white rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 rounded-md text-blue-500"
        />

        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pr-10 rounded-md text-blue-500"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-2 cursor-pointer select-none text-gray-100"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-white text-blue-500 p-2 rounded-md hover:bg-blue-100"
        >
          Login
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}

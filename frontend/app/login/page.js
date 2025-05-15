"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [message, setMessage] = useState("");

  // Cek jika sudah ada yang login di localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/home"); // Jika sudah login, langsung arahkan ke halaman home
    } else {
      fetchUsers();
    }
  }, [router]);

  // Ambil data users dari API
  const fetchUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching users");
        setLoading(false);
        console.error("Error fetching users:", error);
      });
  };
  const login = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        localStorage.setItem("token", data.token); // simpan token di localStorage
        setMessage("Login successful!");
        router.push("/home");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Network error", error);
    }
  }

  const getDashboard = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`, // kirim token di header Authorization
        },
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Dashboard data: ${JSON.stringify(data)}`);
      } else {
        setMessage(data.message || "Failed to get dashboard");
      }
    } catch (error) {
      setMessage("Network error", error);
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setMessage("Logged out");
  };

  const handleLogin = () => {
    const validUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (validUser) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", validUser.username);
      localStorage.setItem("role", validUser.role);

      router.push("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>; // Menampilkan loading saat mengambil data users
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Menampilkan pesan error jika gagal fetch
  }

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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded-md text-blue-500"
        />
        <button
          onClick={login}
          className="w-full bg-white text-blue-500 p-2 rounded-md hover:bg-blue-100"
        >
          Login
        </button>
      </div>
    </div>
  );
}

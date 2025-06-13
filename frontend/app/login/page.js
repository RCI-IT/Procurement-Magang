"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/authServices";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data user");

      const userList = await res.json();
      const validUser = userList.find((user) => user.username === username);

      const userData = {
        id: validUser.id,
        username: validUser.username,
        fullName: validUser.fullName,
        role: validUser.role,
        authorities: validUser.authorities, 
        token: data.token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");

      setIsError(false);
      setMessage("Login berhasil!");
      router.push("/home");
    } catch (err) {
      setIsError(true);
      setMessage(err.message || "Login gagal");
    }
  };

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

        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              isError ? "text-red-200" : "text-green-200"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

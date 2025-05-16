// services/authService.js
'use client'

let accessToken = null;

export const login = async (username, password) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // penting agar cookie (refreshToken) dikirim
      body: JSON.stringify({ username, password }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  };
  
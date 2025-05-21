import { refreshToken } from "./authServices";

export const fetchWithToken = async (url, token, setToken, onUnauthorized) => {
  try {
    let res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (res.status === 401 || !res.ok) {
      const newToken = await refreshToken();
      if (!newToken) {
        onUnauthorized();
        return null;
      }

      localStorage.setItem("token", newToken);
      setToken(newToken); // akan trigger ulang efek jika token termasuk dependency

      res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
        credentials: "include",
      });

      if (!res) throw new Error("Gagal setelah refresh token");
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
};

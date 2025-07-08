import { refreshToken } from "./authServices";

export const fetchWithToken = async (url, token, setToken, onUnauthorized) => {
  try {
    // Lakukan fetch pertama
    let res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    // Jika token tidak valid (401), coba refresh
    if (res.status === 401 || !res.ok) {
      const newToken = await refreshToken();

      if (newToken) {
        // Simpan dan gunakan token baru
        localStorage.setItem("token", newToken);
        setToken(newToken); // akan trigger ulang efek jika token termasuk dependency

        // Ulangi fetch dengan token baru
        res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        });

        if (res.status === 401 || !res.ok) {
          // Jika tetap gagal setelah refresh token
          onUnauthorized();
          return null;
        }
      } else {
        // Gagal refresh token
        onUnauthorized();
        return null;
      }
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
};


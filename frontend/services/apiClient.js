// utils/apiClient.ts
import { refreshToken } from './authServices';

export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  const doRequest = async () => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
  };

  let res = await doRequest();

  if (res.status === 401) {
    const newToken = await refreshToken();
    if (!newToken) throw new Error("Session expired");

    token = newToken;
    localStorage.setItem("token", newToken);

    res = await doRequest();
  }

  return res.json();
};

import { apiURL } from '../../services/apiURL';
import { getTokenWithExpiry } from '../../services/localStorage';

export const getDepartemenData = async () => {
  const token = getTokenWithExpiry();
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${apiURL}/api/departments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Gagal mengambil data departemen');
  return res.json();
};

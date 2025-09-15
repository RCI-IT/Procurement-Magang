import { apiURL } from '../../services/apiURL';

export async function login(username: string, password: string) {
  const response = await fetch(`${apiURL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error('Login gagal');

  return response.json(); // { token: '...' }
}

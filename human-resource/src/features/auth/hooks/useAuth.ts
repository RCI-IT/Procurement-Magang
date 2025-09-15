import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { login } from '../authService';
import { setTokenWithExpiry } from '../../../services/localStorage';

export const useAuth = () => {
  const navigate = usePathname();
  const [error, setError] = useState('');

  const handleLogin = async (username: string, password: string) => {
    try {
      const { token } = await login(username, password);
      setTokenWithExpiry(token, 3600000); // 1 jam
      navigate('/dashboard');
    } catch (err) {
      setError('Username/password salah');
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // atau hapus item tertentu
    navigate('/login');
  };

  return { handleLogin, handleLogout, error };
};

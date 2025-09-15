'use client'

// Simpan data biasa
export const setItem = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  // Ambil data biasa
  export const getItem = (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };
  
  // Simpan dengan expired
  export const setWithExpiry = <T>(key: string, value: T, ttl: number): void => {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };
  
  // Ambil dengan expired
  export const getWithExpiry = (key: string) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
  
    try {
      const item = JSON.parse(itemStr);
      const now = new Date();
  
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
  
      return item.value;
    } catch {
      return null;
    }
  };
  
  // Token khusus
  export const getTokenWithExpiry = (): string | null => {
    const itemStr = localStorage.getItem('auth');
    if (!itemStr) return null;
  
    try {
      const item = JSON.parse(itemStr);
      const now = new Date();
  
      if (now.getTime() > item.expiry) {
        localStorage.removeItem('auth');
        return null;
      }
  
      return item.token;
    } catch {
      return null;
    }
  };
  
  export const setTokenWithExpiry = (token: string, ttl: number) => {
    const now = new Date();
    const item = {
      token,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem('auth', JSON.stringify(item));
  };
  
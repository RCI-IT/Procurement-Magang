// utils/api.ts
export const getApiUrl = (): string => {
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_API_BACKEND || 'http://192.168.110.253:4000';
    } else {
      return process.env.NEXT_PUBLIC_API_BACKEND || 'http://localhost:4000'; // Default ke localhost untuk development
    }
  };
  
import React, { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext({
  permintaanLapanganData: [],
  loading: false,
  error: null,
  refreshData: () => {},
  setPermintaanLapanganData: () => {}, 
});

export const DataProvider = ({ children }) => {
  const [permintaanLapanganData, setPermintaanLapanganData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL);
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      const data = await response.json();
      setPermintaanLapanganData(data);  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  return (
    <DataContext.Provider value={{
      permintaanLapanganData,
      loading,
      error,
      refreshData: fetchData,
      setPermintaanLapanganData,  
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};

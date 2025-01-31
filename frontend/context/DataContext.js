import React, { createContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/api/items');  
      const data = await response.json();
      setItems(data);
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ items }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return React.useContext(DataContext);
};

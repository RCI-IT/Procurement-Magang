import React from 'react';
import { useDepartemenData } from '../hooks/useDepartemenData';

export const DepartemenTable = () => {
  const { data, isLoading, error } = useDepartemenData();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading departemen</p>;

  return (
    <table>
      <thead>
        <tr><th>ID</th><th>Nama Departemen</th></tr>
      </thead>
      <tbody>
        {data.map(dep => (
          <tr key={dep.id}>
            <td>{dep.id}</td>
            <td>{dep.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

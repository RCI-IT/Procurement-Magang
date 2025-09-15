import React from 'react';
import { useKaryawanData } from '../hooks/useKaryawanData';

export const KaryawanTable = () => {
  const { data, isLoading, isNotFound } = useKaryawanData();

  if (isLoading) return <p>Loading...</p>;
  if (isNotFound) return <p>Data tidak ditemukan</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Nama</th>
        </tr>
      </thead>
      <tbody>
        {data.map(emp => (
          <tr key={emp.id}>
            <td>{emp.id}</td>
            <td>{emp.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

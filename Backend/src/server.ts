import app from './app'; 
import path from 'path';
import express from "express";

// Mengimpor aplikasi yang sudah dikonfigurasi di app.ts
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const PORT = process.env.PORT || 5000;  // Menentukan port aplikasi
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
//test
import app from './app';  // Mengimpor aplikasi yang sudah dikonfigurasi di app.ts

const PORT = process.env.PORT || 5001;  // Menentukan port aplikasi
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

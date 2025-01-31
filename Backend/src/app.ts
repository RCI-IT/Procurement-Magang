import express from 'express';
import ordersRoutes from './routes/orders';
import vendorsRoutes from './routes/vendors';
import materialsRoutes from './routes/materials';
import categoriesRoutes from './routes/categories';
import purchasesRoutes from './routes/purchases';
import usersRoutes from './routes/users';
import cors from 'cors';

 // Menambahkan CORS untuk mengirimkan permintaan dari domain lain

// Inisialisasi aplikasi Express
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());
app.use(cors()); 
// Rute-rute yang sudah didefinisikan di file routes
app.use('/orders', ordersRoutes);
app.use('/vendors', vendorsRoutes);
app.use('/materials', materialsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/purchases', purchasesRoutes);
app.use('/users', usersRoutes);

export default app;  // Menyediakan aplikasi untuk digunakan di server.ts

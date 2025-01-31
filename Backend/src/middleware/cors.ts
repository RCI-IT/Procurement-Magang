import express from 'express';
import cors from 'cors';

const app = express();

// Konfigurasi CORS
const corsOptions = {
  origin: "http://localhost:3000",  // Pastikan ini sesuai dengan frontend Anda
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));

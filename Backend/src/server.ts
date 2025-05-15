import app from './app'; 
import path from 'path';
import express from "express";

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));



const PORT = process.env.PORT || 5000;
app.listen(5000, '0.0.0.0', () => {
  console.log("Server berjalan di port 5000");
});

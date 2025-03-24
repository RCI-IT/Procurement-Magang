# Gunakan image Node.js versi terbaru dengan Alpine untuk ukuran yang lebih kecil
FROM node:18-alpine 

# Set direktori kerja dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json untuk menginstal dependencies terlebih dahulu
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Expose port yang digunakan Next.js
EXPOSE 3000

# Jalankan aplikasi dalam mode development
CMD ["npm", "run", "dev"]

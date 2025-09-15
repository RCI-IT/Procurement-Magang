# Gunakan image Node.js versi terbaru LTS sebagai base image
FROM node:18-alpine

# Set working directory di dalam container
WORKDIR /src

# Copy file package.json dan package-lock.json ke dalam container
COPY package*.json ./


# Install dependencies
RUN npm install

# Copy semua file proyek ke dalam container
COPY . .

# Prisma generate client (make sure schema.prisma is already copied)
RUN npx prisma generate

# Pastikan TypeScript sudah terinstal secara global
# RUN npm install -g typescript

# Build TypeScript sebelum menjalankan server
RUN npm run build

# Expose port sesuai dengan yang digunakan di Express (misalnya 5000)
EXPOSE 4000

# Jalankan server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

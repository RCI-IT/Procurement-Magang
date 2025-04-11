# Gunakan Node.js 20 (alpine) karena ringan & cocok untuk React Router 7
FROM node:20-alpine

# Set working directory di container
WORKDIR /app

# Copy dependency file dulu supaya cache build lebih efisien
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --ignore-engines

# Copy semua source code project
COPY . .

# Expose port Next.js
EXPOSE 3000

# Default command untuk menjalankan Next.js Development Server
CMD ["npm", "run", "dev"]

# Gunakan Node.js 20 agar kompatibel dengan React Router 7
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Gunakan --ignore-engines agar tidak error pada perbedaan versi Node.js
RUN npm install --ignore-engines

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

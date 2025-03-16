# Gunakan image Node.js versi 20 sebagai base image
FROM node:20

# Atur working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json untuk mengoptimalkan caching layer
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Build aplikasi TypeScript
RUN npm run build

# Ekspose port aplikasi (ganti sesuai kebutuhan)
EXPOSE 3000

# Jalankan aplikasi setelah build
CMD ["node", "dist/server.js"]

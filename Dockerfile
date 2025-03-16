# Gunakan Node.js versi 20
FROM node:20

# Atur working directory
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek
COPY . .

# Salin file .env agar Drizzle bisa membacanya
COPY .env .env

# Build TypeScript
RUN npm run build

# Jalankan migrasi Drizzle dengan menggunakan file .env
RUN --mount=type=secret,id=env npx drizzle-kit push

# Ekspose port aplikasi
EXPOSE 3001

# Jalankan aplikasi setelah semua setup selesai
CMD ["node", "dist/server.js"]

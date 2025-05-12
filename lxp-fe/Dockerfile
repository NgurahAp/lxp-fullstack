# Base image untuk React + Vite (pakai Node juga)
FROM node:20

# Set working directory
WORKDIR /app

# Copy file config & install deps
COPY package*.json ./
RUN npm install

# Copy seluruh file ke container
COPY . .

# Build aplikasi React untuk production
RUN npm run build

# Menggunakan serve untuk menyajikan aplikasi React
RUN npm install -g serve

# Expose port yang digunakan
EXPOSE 5173

# Command untuk menjalankan aplikasi
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
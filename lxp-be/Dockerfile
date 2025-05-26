# Gunakan Node.js versi 20 sebagai base image
FROM node:20

# Install dependencies sistem yang dibutuhkan oleh canvas
RUN apt-get update && apt-get install -y \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

# Set working directory di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json (kalau ada)
COPY package*.json ./

# Konfigurasi npm untuk mengatasi masalah jaringan
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 600000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

# Install dependencies Node.js dengan retry mechanism
RUN npm install || npm install || npm install

# Copy semua source code ke dalam container
COPY . .

# Expose port backend (ubah kalau beda)
EXPOSE 5000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]
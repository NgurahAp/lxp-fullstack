# Base image untuk React + Vite
FROM node:20

# Set working directory
WORKDIR /app

# Copy file config 
COPY package*.json ./

# Konfigurasi npm untuk mengatasi masalah jaringan
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 600000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

# Install dependencies dengan retry mechanism
RUN npm install || npm install || npm install

# Copy seluruh file ke container
COPY . .

# Expose port yang digunakan
EXPOSE 5173

# Command untuk menjalankan aplikasi dalam dev mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
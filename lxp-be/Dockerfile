# Gunakan Node.js versi 20 sebagai base image
FROM node:20

# Set working directory di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json (kalau ada)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code ke dalam container
COPY . .

# Expose port backend (ubah kalau beda)
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
CMD ["npm", "start"]

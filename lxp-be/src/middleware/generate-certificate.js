import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

/**
 * Generate a certificate for a user who has completed a training
 * @param {Object} user - User information
 * @param {Object} training - Training information
 * @returns {string} - Path to the generated certificate
 */

const generateCertificate = async (user, training) => {
  try {
    // Create directory if it doesn't exist
    const certificateDir = "public/certificates";
    if (!fs.existsSync(certificateDir)) {
      fs.mkdirSync(certificateDir, { recursive: true });
    }

    // Load template image
    const templateImage = await loadImage('public/certif.jpeg');
    
    // Create canvas with the same dimensions as the template
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext('2d');
    
    // Draw the template image
    ctx.drawImage(templateImage, 0, 0);
    
    // Set font properties for name
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    
    // Add user's name (centered horizontally in the middle of the image)
    ctx.fillText(user.name, canvas.width / 2, canvas.height / 2 - 50);
    
    // Set font properties for training title
    ctx.font = '36px Arial';
    ctx.fillStyle = '#333333';
    
    // Add training title (below the name)
    ctx.fillText(training.title, canvas.width / 2, canvas.height / 2 + 50);
    
    // Generate a unique certificate ID
    const certificateId = `KG/CERT/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}/${Math.floor(Math.random() * 10000000000000).toString()}`;
    
    // Set font properties for certificate ID
    ctx.font = '18px Arial';
    ctx.fillStyle = '#666666';
    
    // Add certificate ID
    ctx.fillText(`ID Sertifikat: ${certificateId}`, canvas.width / 2, canvas.height / 2 - 150);
    
    // Generate filename using user ID and training ID
    const fileName = `certificate-${user.id}-${training.id}.jpeg`;
    const filePath = path.join(certificateDir, fileName);
    
    // Create a write stream and save the image
    const out = fs.createWriteStream(filePath);
    const stream = canvas.createJPEGStream({ quality: 0.95 });
    stream.pipe(out);
    
    return new Promise((resolve, reject) => {
      out.on('finish', () => resolve(filePath));
      out.on('error', reject);
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

export default generateCertificate;
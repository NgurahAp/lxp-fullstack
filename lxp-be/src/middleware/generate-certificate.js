
import { createCanvas, loadImage, registerFont } from "canvas";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import fs from "fs";
import path from "path";

const calculateFinalScore = (scores) => {
  if (!scores || scores.length === 0) return 0;
  
  // Calculate average of totalScores
  const totalScoreSum = scores.reduce((sum, score) => sum + score.totalScore, 0);
  return Math.round(totalScoreSum / scores.length);
};

/**
 * Generate certificate image and save to database
 * @param {string} userId - User ID
 * @param {string} trainingId - Training ID
 * @param {string} userName - User's full name
 * @param {string} trainingTitle - Training title
 * @param {number} finalScore - Final score achieved
 * @param {object} tx - Prisma transaction object
 * @returns {Promise<object>} - The created certificate
 */
const generateAndSaveCertificate = async (userId, trainingId, userName, trainingTitle, finalScore, tx) => {
  try {
    console.log(`Generating certificate for user ${userId} in training ${trainingId}`);
    
    // Check if certificate already exists
    const existingCertificate = await tx.certificate.findUnique({
      where: {
        trainingId_userId: {
          trainingId,
          userId
        }
      }
    });

    if (existingCertificate) {
      console.log(`Certificate already exists: ${existingCertificate.id}`);
      return existingCertificate;
    }
    
    // Generate a unique certificate number
    const certificateNumber = generateCertificateNumber();
    console.log(`Generated certificate number: ${certificateNumber}`);
    
    // Generate the certificate image
    const certificatePath = await createCertificateImage(userName, trainingTitle, certificateNumber);
    console.log(`Certificate image created at: ${certificatePath}`);
    
    // Save certificate to database
    const certificate = await tx.certificate.create({
      data: {
        certificateNumber,
        trainingId,
        userId,
        issuedDate: new Date(),
        expiryDate: getExpiryDate(),
        finalScore,
        status: 'active',
        filePath: certificatePath,
        metadata: {
          generatedAt: new Date().toISOString(),
          template: 'standard'
        }
      }
    });
    
    console.log(`Certificate saved to database with ID: ${certificate.id}`);
    return certificate;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

/**
 * Generate a unique certificate number
 * @returns {string} - Certificate number
 */
const generateCertificateNumber = () => {
  const prefix = 'KG/CERT';
  const date = moment().format('YYYY/MM/DD');
  const random = Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0');
  return `${prefix}/${date}/${random}`;
};

/**
 * Get expiry date (1 year from now)
 * @returns {Date} - Expiry date
 */
const getExpiryDate = () => {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 5);
  return expiryDate;
};

/**
 * Create certificate image from template
 * @param {string} userName - User's full name
 * @param {string} trainingTitle - Training title
 * @param {string} certificateNumber - Certificate number
 * @returns {Promise<string>} - Path to saved certificate image
 */
const createCertificateImage = async (userName, trainingTitle, certificateNumber) => {
  try {
    console.log('Creating certificate image...');
    
    // Register the Poppins font
    try {
      // Resolve font path using runtime path resolution
      const fontPath = path.resolve(process.cwd(), 'fonts', 'Poppins-Regular.ttf');
      console.log(`Looking for font at: ${fontPath}`);
      
      if (fs.existsSync(fontPath)) {
        console.log('Font file exists, registering...');
        registerFont(fontPath, { family: 'Poppins' });
      } else {
        console.log('Font file not found, using fallback fonts');
        // We'll use a fallback font in the font settings
      }
    } catch (fontError) {
      console.error('Error registering font:', fontError);
      // Continue with default fonts
    }
    
    // Try multiple locations for the template file
    let template;
    const possibleTemplatePaths = [
      path.resolve(process.cwd(), 'public', 'certif.jpeg'),
    ];
    
    console.log('Trying to locate certificate template...');
    for (const templatePath of possibleTemplatePaths) {
      console.log(`Checking path: ${templatePath}`);
      if (fs.existsSync(templatePath)) {
        console.log(`Template found at: ${templatePath}`);
        template = await loadImage(templatePath);
        break;
      }
    }
    
    if (!template) {
      throw new Error('Certificate template not found in any of the expected locations');
    }
    
    // Create canvas with template dimensions
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');
    
    // Draw template image
    ctx.drawImage(template, 0, 0, template.width, template.height);
    
    // Set font styles
    const fontFamily = 'Poppins, Arial, sans-serif';
    
    // Draw certificate ID
    ctx.font = `48px ${fontFamily}`;
    ctx.fillStyle = '#503445';
    ctx.textAlign = 'center';
    ctx.fillText(`ID Sertifikat : ${certificateNumber}`, template.width / 2, 560);
    
    // Draw participant name
    ctx.font = `bold 24px ${fontFamily}`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(userName, template.width / 2, 380);
    
    // Draw training title
    ctx.font = `18px ${fontFamily}`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(trainingTitle, template.width / 2, 700);
    
    // Draw current date
    const currentDate = moment().format('DD MMMM YYYY');
    ctx.font = `16px ${fontFamily}`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(`Jakarta, ${currentDate}`, template.width / 2, 640);
    
    // Create directory if it doesn't exist
    const certificatesDir = path.resolve(process.cwd(), 'public', 'certificates');
    console.log(`Creating certificates directory if needed: ${certificatesDir}`);
    
    if (!fs.existsSync(certificatesDir)) {
      console.log('Directory does not exist, creating...');
      fs.mkdirSync(certificatesDir, { recursive: true });
    }
    
    // Save the certificate as PNG
    const fileName = `certificate-${certificateNumber.replace(/\//g, '-')}.png`;
    const outputPath = path.join(certificatesDir, fileName);
    console.log(`Saving certificate to: ${outputPath}`);
    
    // Use a promise to handle file saving
    return new Promise((resolve, reject) => {
      const outStream = fs.createWriteStream(outputPath);
      const pngStream = canvas.createPNGStream();
      
      outStream.on('finish', () => {
        console.log('Certificate file written successfully');
        resolve(`/certificates/${fileName}`);
      });
      
      outStream.on('error', (err) => {
        console.error('Error writing certificate file:', err);
        reject(err);
      });
      
      pngStream.pipe(outStream);
    });
    
  } catch (error) {
    console.error('Error creating certificate image:', error);
    throw error;
  }
};

export { calculateFinalScore, generateAndSaveCertificate, generateCertificateNumber, getExpiryDate, createCertificateImage };
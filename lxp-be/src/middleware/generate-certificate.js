import { createCanvas, loadImage, registerFont } from "canvas";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import fs from "fs";
import path from "path";

const calculateFinalScore = (scores) => {
  if (!scores || scores.length === 0) return 0;
  const totalScoreSum = scores.reduce((sum, score) => sum + score.totalScore, 0);
  return Math.round(totalScoreSum / scores.length);
};

const generateAndSaveCertificate = async (userId, trainingId, userName, trainingTitle, finalScore, tx) => {
  try {
    console.log(`Generating certificate for user ${userId} in training ${trainingId}`);

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

    const certificateNumber = generateCertificateNumber();
    console.log(`Generated certificate number: ${certificateNumber}`);

    const certificatePath = await createCertificateImage(userName, trainingTitle, certificateNumber);
    console.log(`Certificate image created at: ${certificatePath}`);

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

const generateCertificateNumber = () => {
  const prefix = 'KG/CERT';
  const date = moment().format('YYYY/MM/DD');
  const random = Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0');
  return `${prefix}/${date}/${random}`;
};

const getExpiryDate = () => {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 5);
  return expiryDate;
};

const createCertificateImage = async (userName, trainingTitle, certificateNumber) => {
  try {
    console.log('Creating certificate image...');

    const fontDir = path.resolve(process.cwd(), 'fonts');

    const cinzelPath = path.join(fontDir, 'CinzelDecorative-Bold.ttf');
    const openSansPath = path.join(fontDir, 'OpenSans-Regular.ttf');
    const openSansBoldPath = path.join(fontDir, 'OpenSans_Condensed-SemiBoldItalic.ttf');


    if (fs.existsSync(cinzelPath)) {
      registerFont(cinzelPath, { family: 'Cinzel Decorative' });
      console.log('Cinzel Decorative font registered.');
    } else {
      console.warn('Cinzel Decorative font not found!');
    }

    if (fs.existsSync(openSansPath)) {
      registerFont(openSansPath, { family: 'Open Sans' });
      console.log('Open Sans font registered.');
    } else {
      console.warn('Open Sans font not found!');
    }

     if (fs.existsSync(openSansBoldPath)) {
      registerFont(openSansBoldPath, { family: 'Open Sans Bold' });
      console.log('Open Sans font registered.');
    } else {
      console.warn('Open Sans font not found!');
    }

    let template;
    const possibleTemplatePaths = [
      path.resolve(process.cwd(), 'public', 'certif.jpeg'),
    ];

    for (const templatePath of possibleTemplatePaths) {
      if (fs.existsSync(templatePath)) {
        template = await loadImage(templatePath);
        break;
      }
    }

    if (!template) throw new Error('Certificate template not found.');

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(template, 0, 0, template.width, template.height);

    // Sertifikat ID
    ctx.font = `52px 'Open Sans'`;
    ctx.fillStyle = '#6A3F63';
    ctx.textAlign = 'center';
    ctx.fillText(`ID Sertifikat : ${certificateNumber}`, template.width / 2, 558);

    // Participant Name
    ctx.font = `italic bold 85px 'Cinzel Decorative'`;
    ctx.fillStyle = '#EBB61E';
    ctx.textAlign = 'center';
    ctx.fillText(userName, template.width / 2, 945);

    // Training Title
    ctx.font = `bold italic 60px 'Open Sans Bold'`;
    ctx.fillStyle = '#6A3F63';
    ctx.textAlign = 'center';
    ctx.fillText(trainingTitle, template.width / 2, 1250);

    // Date
    const currentDate = moment().format('DD MMMM YYYY');
    ctx.font = `italic 45px 'Open Sans'`;
    ctx.fillStyle = '#6A3F63';
    ctx.textAlign = 'center';
    ctx.fillText(`Pada Tanggal ${currentDate}`, template.width / 2, 1450);


    const certificatesDir = path.resolve(process.cwd(), 'public', 'certificates');
    if (!fs.existsSync(certificatesDir)) fs.mkdirSync(certificatesDir, { recursive: true });

    const fileName = `certificate-${certificateNumber.replace(/\//g, '-')}.png`;
    const outputPath = path.join(certificatesDir, fileName);

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

export {
  calculateFinalScore,
  generateAndSaveCertificate,
  generateCertificateNumber,
  getExpiryDate,
  createCertificateImage
};

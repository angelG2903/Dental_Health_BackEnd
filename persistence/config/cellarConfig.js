const { S3Client } = require('@aws-sdk/client-s3');

// Configuración para Cellar con AWS SDK v3
const s3Client = new S3Client({
  endpoint: 'https://cellar-c2.services.clever-cloud.com', // Endpoint de Cellar
  region: 'fr-par', // Región estándar
  credentials: {
    accessKeyId: process.env.CELLAR_ACCESS_KEY, // Access Key
    secretAccessKey: process.env.CELLAR_SECRET_KEY, // Secret Key
  },
});

module.exports = s3Client;
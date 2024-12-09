const s3Client = require('../../persistence/config/cellarConfig');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

const uploadFile = async (bucketName, filePath, fileName, mimeType) => {
    try {
        const fileContent = fs.readFileSync(filePath); // Lee el archivo desde la ruta normalizada
        console.log('Archivo leído correctamente:', filePath);

        const params = {
            Bucket: bucketName,
            Key: fileName, // Nombre único del archivo
            Body: fileContent,
            ContentType: mimeType, // Tipo MIME del archivo
            ACL: 'public-read', // Hacerlo accesible públicamente
        };

        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);

        console.log('Archivo subido con éxito:', fileName);
        return `https://cellar-c2.services.clever-cloud.com/${bucketName}/${fileName}`;
    } catch (error) {
        console.error('Error al subir el archivo:', {
            bucketName,
            filePath,
            fileName,
            mimeType,
            error: error.message,
        });
        throw new Error(`Fallo al subir el archivo a Cellar: ${error.message}`);
    }
};

module.exports = uploadFile;
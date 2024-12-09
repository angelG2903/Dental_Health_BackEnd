const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar el almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'infrastructure/temp_uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombra el archivo con una marca de tiempo
    }
});

// Filtro para validar el tipo de archivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes y archivos PDF.'));
    }
};

// Configurar el middleware de multer
const upload = multer({
    storage,
    fileFilter,
    /* limits: { fileSize: 5 * 1024 * 1024 }  */
});

module.exports = upload;

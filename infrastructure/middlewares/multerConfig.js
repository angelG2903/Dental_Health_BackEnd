const multer = require('multer');
const path = require('path');

// Configurar el almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'infrastructure/temp_uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombra el archivo con una marca de tiempo
    }
});

// Configurar el middleware de multer
const upload = multer({ storage: storage });

module.exports = upload;

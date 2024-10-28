const { Promotion, Doctor, Login } = require('../../domain/models');
const fs = require('fs');
const path = require('path');

// Función para mover archivos de la carpeta temporal a la carpeta final
function moveFile(tempPath, finalPath) {
    fs.rename(tempPath, finalPath, (err) => {
        if (err) throw err;
    });
}

// Función para eliminar archivos de la carpeta temporal
function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) throw err;
    });
}


exports.register = async (req, res) => {

    const { id } = req.params;

    const { title, description } = req.body;

    // Manejo de archivos subidos
    let promotionalImage = null;

    // Rutas de directorio
    const tempUploadDir = 'infrastructure/temp_uploads/';
    const finalUploadDir = 'infrastructure/uploads/';

    // Validación de archivos subidos
    if (req.files && req.files['promotionalImage'] && req.files['promotionalImage'][0]) {
        promotionalImage = req.files['promotionalImage'][0].filename;
            
    }

    try {

        if (!title || !description) {
            if (promotionalImage) deleteFile(path.join(tempUploadDir, promotionalImage));
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const validationId = await Doctor.findOne({ where: { id } });
        
        if (!validationId) {
            if (promotionalImage) deleteFile(path.join(tempUploadDir, promotionalImage));
            return res.status(404).json({ error: 'Doctor not found' });
        }

        await Promotion.create({ doctorId: id, title, description, promotionalImage });

        if (promotionalImage) moveFile(path.join(tempUploadDir, promotionalImage), path.join(finalUploadDir, promotionalImage));

        res.status(201).json({ doctorId: id, title, description });

    } catch (error) {
        if (promotionalImage) deleteFile(path.join(tempUploadDir, promotionalImage));
        res.status(500).json({ error: 'server error', details: error.message });
    }
}


exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.findAll({
            include: {
                model: Doctor,
                attributes: ['id'],
                include: {
                    model: Login,
                    attributes: ['name']
                },
            }
        });

        // Construir la URL completa para cada imagen de promoción
        // const baseUrl = req.protocol + '://' + req.get('host');

        const baseUrl = req.protocol + '://' + '192.168.100.4:5000'; // http://localhost:3000
        const imageDirectory = 'infrastructure/uploads/'; // Directorio donde están almacenadas las imágenes

        const promotionsWithImageUrls = promotions.map(promotion => {
            return {
                ...promotion.toJSON(), // Convertir instancia de Sequelize a objeto plano
                promotionalImageUrl: promotion.promotionalImage ? `${baseUrl}/${imageDirectory}${promotion.promotionalImage}` : null
            };
        });

        res.status(200).json(promotionsWithImageUrls);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};


exports.getPromotionById = async (req, res) => {
    const { id } = req.params;

    try {
        const promotion = await Promotion.findOne({
            where: { id },
            include: {
                model: Doctor,
                attributes: ['id'],
                include: {
                    model: Login,
                    attributes: ['name']
                },
            }
        });

        // Construir la URL completa de la imagen
        const baseUrl = req.protocol + '://' + req.get('host');
        const imageDirectory = 'infrastructure/uploads/';
        const promotionalImageUrl = promotion.promotionalImage ? `${baseUrl}/${imageDirectory}${promotion.promotionalImage}` : null;

        res.status(200).json({ ...promotion.toJSON(), promotionalImageUrl });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}


exports.updatePromotion = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    // Rutas de directorio
    const tempUploadDir = 'infrastructure/temp_uploads/';
    const finalUploadDir = 'infrastructure/uploads/';

    let promotionalImage = null;

    // Validación de archivos subidos
    if (req.files && req.files['promotionalImage'] && req.files['promotionalImage'][0]) {
        promotionalImage = req.files['promotionalImage'][0].filename;
    }

    try {
        
        const promotion = await Promotion.findOne({ where: { id } });

        if (!promotion) {
            if (promotionalImage) deleteFile(path.join(tempUploadDir, promotionalImage));
            return res.status(404).json({ error: 'Promotion not found' });
        }

        if (!title || !description) {
            if (promotionalImage) deleteFile(path.join(tempUploadDir, promotionalImage));
            return res.status(400).json({ error: 'Title and description are required' });
        }

        // Si hay una nueva imagen, eliminar la anterior y mover la nueva
        if (promotionalImage) {
            // Eliminar la imagen anterior si existe
            if (promotion.promotionalImage) {
                deleteFile(path.join(finalUploadDir, promotion.promotionalImage));
            }
            // Mover la nueva imagen al directorio final
            moveFile(path.join(tempUploadDir, promotionalImage), path.join(finalUploadDir, promotionalImage));
        } else {
            // Si no hay una nueva imagen, mantener la existente
            promotionalImage = promotion.promotionalImage;
        }

        await Promotion.update(
            { title, description, promotionalImage },
            { where: { id } }
        );

        res.status(200).json({ message: 'Promotion updated successfully' });
    } catch (error) {
        if (promotionalImage) deleteFile(path.join(tempUploadDir, promotionalImage));
        res.status(500).json({ error: 'server error', details: error.message });
    }
}

exports.deletePromotion = async (req, res) => {
    const { id } = req.params;

    const finalUploadDir = 'infrastructure/uploads/';

    try {
        const promotion = await Promotion.findOne({ where: { id } });

        if (!promotion) {
            return res.status(404).json({ error: 'Promotion not found' });
        }

        // Eliminar la imagen asociada si existe
        if (promotion.promotionalImage) {
            deleteFile(path.join(finalUploadDir, promotion.promotionalImage));
        }

        await Promotion.destroy({ where: { id } });

        res.status(200).json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}




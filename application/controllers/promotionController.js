const { Promotion, Doctor, Login } = require('../../domain/models');
const fs = require('fs/promises');
const path = require('path'); // Para manejar rutas de archivo
const uploadFile = require('../../infrastructure/utils/uploadFile');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../../persistence/config/cellarConfig');

exports.register = async (req, res) => {

    const { id } = req.params;

    const { title, description } = req.body;

    // Manejo de archivos subidos
    let promotionalImage = null;

    if (req.files && req.files['promotionalImage'] && req.files['promotionalImage'][0]) {
        promotionalImage = req.files['promotionalImage'][0];
    }

    try {

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const validationId = await Doctor.findOne({ where: { id } });
        if (!validationId) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        let imageUrl = null;

        const bucketName = process.env.CELLAR_BUCKET_NAME;
        if (promotionalImage) {
            const fileName = `promotions/${Date.now()}_${promotionalImage.originalname}`;
            const mimeType = promotionalImage.mimetype;
            console.log('Subiendo archivo:', promotionalImage);
            console.log('Detalles del archivo:', {
                bucketName,
                filePath: promotionalImage.path,
                fileName,
                mimeType,
            });
            const normalizedPath = path.resolve(promotionalImage.path); // Normaliza la ruta
            console.log('Ruta normalizada:', normalizedPath);

            imageUrl = await uploadFile(bucketName, normalizedPath, fileName, mimeType);

            console.log('Archivo subido. URL:', imageUrl);
        }

        await Promotion.create({
            doctorId: id,
            title,
            description,
            promotionalImage: imageUrl,
        });

        res.status(201).json({ doctorId: id, title, description, promotionalImage: imageUrl });
    } catch (error) {
        console.error('Error al registrar la promoción:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    } finally {
        if (promotionalImage && promotionalImage.path) {
            try {
                await fs.unlink(promotionalImage.path); // Intentar eliminar el archivo
                console.log('Archivo temporal eliminado correctamente');
            } catch (unlinkError) {
                if (unlinkError.code !== 'ENOENT') { // Ignorar si el archivo no existe
                    console.error('Error al eliminar el archivo temporal:', unlinkError);
                }
            }
        }
    }
};


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

        const promotionsWithImageUrls = promotions.map(promotion => {
            return {
                ...promotion.toJSON(),
                promotionalImageUrl: promotion.promotionalImage || null
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

        const promotionalImageUrl = promotion.promotionalImage || null;

        res.status(200).json({ ...promotion.toJSON(), promotionalImageUrl });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}


exports.updatePromotion = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    let promotionalImage = null;

    // Validación de archivos subidos
    if (req.files && req.files['promotionalImage'] && req.files['promotionalImage'][0]) {
        promotionalImage = req.files['promotionalImage'][0];
    }

    try {

        const promotion = await Promotion.findOne({ where: { id } });

        if (!promotion) {
            if (promotionalImage) await fs.unlink(promotionalImage.path); // Eliminar el archivo temporal si no se encuentra la promoción
            return res.status(404).json({ error: 'Promotion not found' });
        }

        if (!title || !description) {
            if (promotionalImage) await fs.unlink(promotionalImage.path);
            return res.status(400).json({ error: 'Title and description are required' });
        }

        let newImageUrl = promotion.promotionalImage; // Mantener la URL anterior si no se sube una nueva

        // Si se sube una nueva imagen, manejar la lógica de Cellar
        if (promotionalImage) {
            const bucketName = process.env.CELLAR_BUCKET_NAME; // Reemplaza con tu bucket en Cellar
            const fileName = `promotions/${Date.now()}_${promotionalImage.originalname}`;
            const mimeType = promotionalImage.mimetype;

            // Subir la nueva imagen a Cellar
            const fileContent = await fs.readFile(promotionalImage.path);
            const uploadParams = {
                Bucket: bucketName,
                Key: fileName,
                Body: fileContent,
                ContentType: mimeType,
                ACL: 'public-read',
            };

            const uploadCommand = new PutObjectCommand(uploadParams);
            await s3Client.send(uploadCommand);
            newImageUrl = `https://cellar-c2.services.clever-cloud.com/${bucketName}/${fileName}`;

            // Eliminar la imagen anterior del bucket si existe
            if (promotion.promotionalImage) {
                const oldFileName = promotion.promotionalImage.split(`${bucketName}/`)[1];
                if (oldFileName) {
                    const deleteParams = {
                        Bucket: bucketName,
                        Key: oldFileName,
                    };
                    const deleteCommand = new DeleteObjectCommand(deleteParams);
                    await s3Client.send(deleteCommand);
                }
            }

            // Eliminar el archivo temporal después de subir
            await fs.unlink(promotionalImage.path);
        }

        // Actualizar la promoción en la base de datos
        await Promotion.update(
            { title, description, promotionalImage: newImageUrl },
            { where: { id } }
        );

        res.status(200).json({ message: 'Promotion updated successfully', promotionalImage: newImageUrl });
    } catch (error) {
        if (promotionalImage && promotionalImage.path) {
            try {
                await fs.unlink(promotionalImage.path);
            } catch (unlinkError) {
                if (unlinkError.code !== 'ENOENT') { // Ignorar si el archivo no existe
                    console.error('Error al eliminar el archivo temporal:', unlinkError);
                }
            }
        }
        console.error('Error al actualizar la promoción:', error);
        res.status(500).json({ error: 'server error', details: error.message });
    }
}

exports.deletePromotion = async (req, res) => {
    const { id } = req.params;

    try {
        const promotion = await Promotion.findOne({ where: { id } });

        if (!promotion) {
            return res.status(404).json({ error: 'Promotion not found' });
        }

        // Eliminar la imagen asociada si existe
        if (promotion.promotionalImage) {
            const bucketName = process.env.CELLAR_BUCKET_NAME; // Reemplaza con el nombre de tu bucket

            // Extrae el nombre del archivo desde la URL si guardaste la URL completa
            const fileName = promotion.promotionalImage.split(`${bucketName}/`)[1];

            if (fileName) {
                const deleteParams = {
                    Bucket: bucketName,
                    Key: fileName,
                };

                const deleteCommand = new DeleteObjectCommand(deleteParams);
                await s3Client.send(deleteCommand);
                console.log(`Archivo eliminado del bucket: ${fileName}`);
            }
        }

        // Eliminar la promoción de la base de datos
        await Promotion.destroy({ where: { id } });

        res.status(200).json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        console.error('Error al eliminar la promoción:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
}




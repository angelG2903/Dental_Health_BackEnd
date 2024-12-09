const { Login, Patient, Doctor, MedicalHistory, CardiovascularSystem, EtsDisease, PathologicalHistory, OralCavity, Promotion } = require('../../domain/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const uploadFile = require('../../infrastructure/utils/uploadFile');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../../persistence/config/cellarConfig');

const validGender = ['femenino', 'masculino'];

exports.registerDoctor = async (req, res) => {
    const {
        name,
        lastName,
        gender,
        birthDate,
        phoneNumber,
        email,
        password,
        degree,
        professionalLicense,
        specialty,
        specialtyLicense,
        clinicName,
        clinicAddress
    } = req.body;

    let profilePicture = null;
    let clinicLogo = null;
    let authorizationFile = null;

    // Validación de archivos subidos
    if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        profilePicture = req.files['profilePicture'][0];
    }

    if (req.files && req.files['clinicLogo'] && req.files['clinicLogo'][0]) {
        clinicLogo = req.files['clinicLogo'][0];
    }

    if (req.files && req.files['authorizationFile'] && req.files['authorizationFile'][0]) {
        authorizationFile = req.files['authorizationFile'][0];
    }

    try {

        if (!validGender.includes(gender)) {
            return res.status(400).json({ error: 'Invalid gender' });
        }

        // Subir imagen al servidor
        let imageUrlProfile = null;
        const bucketName = process.env.CELLAR_BUCKET_NAME;
        if (profilePicture) {
            const fileName = `auths/${Date.now()}_${profilePicture.originalname}`;
            const mimeType = profilePicture.mimetype;
            console.log('Subiendo archivo:', profilePicture);
            console.log('Detalles del archivo:', {
                bucketName,
                filePath: profilePicture.path,
                fileName,
                mimeType,
            });
            const normalizedPath = path.resolve(profilePicture.path); // Normaliza la ruta
            console.log('Ruta normalizada:', normalizedPath);

            imageUrlProfile = await uploadFile(bucketName, normalizedPath, fileName, mimeType);

            console.log('Archivo subido. URL:', imageUrlProfile);
        }

        const role = 'doctor';
        const hashedPassword = await bcrypt.hash(password, 12);
        const newLogin = await Login.create({ name, lastName, gender, birthDate, phoneNumber, profilePicture: imageUrlProfile, email, password: hashedPassword, role });

        // doctor
        let imageUrlLogo = null;
        if (clinicLogo) {
            const fileName = `auths/${Date.now()}_${clinicLogo.originalname}`;
            const mimeType = clinicLogo.mimetype;
            console.log('Subiendo archivo:', clinicLogo);
            console.log('Detalles del archivo:', {
                bucketName,
                filePath: clinicLogo.path,
                fileName,
                mimeType,
            });
            const normalizedPath = path.resolve(clinicLogo.path); // Normaliza la ruta
            console.log('Ruta normalizada:', normalizedPath);

            imageUrlLogo = await uploadFile(bucketName, normalizedPath, fileName, mimeType);

            console.log('Archivo subido. URL:', imageUrlLogo);
        }

        const newDoctor = await Doctor.create({ loginId: newLogin.id, degree, professionalLicense, specialty, specialtyLicense, clinicName, clinicLogo: imageUrlLogo, clinicAddress, authorizationFile });
        if (newDoctor.id === null) {
            const doct = await Login.findOne({
                where: { id: newLogin.id }
            })
            await doct.destroy();
            return res.status(400).json({ error: 'Error al crear registro del doctor' });
        }

        const token = jwt.sign({ loginId: newLogin.id, role: newLogin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    } finally {
        if (profilePicture && profilePicture.path) {
            try {
                await fs.unlink(profilePicture.path); // Intentar eliminar el archivo
                console.log('Archivo temporal eliminado correctamente');
            } catch (unlinkError) {
                if (unlinkError.code !== 'ENOENT') { // Ignorar si el archivo no existe
                    console.error('Error al eliminar el archivo temporal:', unlinkError);
                }
            }
        } else if (clinicLogo && clinicLogo.path) {
            try {
                await fs.unlink(clinicLogo.path); // Intentar eliminar el archivo
                console.log('Archivo temporal eliminado correctamente');
            } catch (unlinkError) {
                if (unlinkError.code !== 'ENOENT') { // Ignorar si el archivo no existe
                    console.error('Error al eliminar el archivo temporal:', unlinkError);
                }
            }
        }
    }
};

exports.registerPatient = async (req, res) => {
    const {
        name,
        lastName,
        gender,
        birthDate,
        phoneNumber,
        email,
        password,
        maritalStatus,
        occupation,
        address,
        origin
    } = req.body;

    // Manejo de archivos subidos
    let profilePicture = null;

    // Validación de archivos subidos
    if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        profilePicture = req.files['profilePicture'][0];
    }

    try {

        if (!validGender.includes(gender)) {
            return res.status(400).json({ error: 'Invalid gender' });
        }

        // Subir imagen al servidor
        let imageUrlProfile = null;
        const bucketName = process.env.CELLAR_BUCKET_NAME;
        if (profilePicture) {
            const fileName = `auths/${Date.now()}_${profilePicture.originalname}`;
            const mimeType = profilePicture.mimetype;
            console.log('Subiendo archivo:', profilePicture);
            console.log('Detalles del archivo:', {
                bucketName,
                filePath: profilePicture.path,
                fileName,
                mimeType,
            });
            const normalizedPath = path.resolve(profilePicture.path); // Normaliza la ruta
            console.log('Ruta normalizada:', normalizedPath);

            imageUrlProfile = await uploadFile(bucketName, normalizedPath, fileName, mimeType);

            console.log('Archivo subido. URL:', imageUrlProfile);
        }

        const role = 'patient';
        const hashedPassword = await bcrypt.hash(password, 12);
        const newLogin = await Login.create({ name, lastName, gender, birthDate, phoneNumber, profilePicture: imageUrlProfile, email, password: hashedPassword, role });

        await Patient.create({ loginId: newLogin.id, maritalStatus, occupation, address, origin })

        const token = jwt.sign({ loginId: newLogin.id, role: newLogin.role }, process.env.JWT_SECRET, { expiresIn: '1H' });

        res.status(201).json({ token, loginId: newLogin.id, role: newLogin.role });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    } finally {
        if (profilePicture && profilePicture.path) {
            try {
                await fs.unlink(profilePicture.path); // Intentar eliminar el archivo
                console.log('Archivo temporal eliminado correctamente');
            } catch (unlinkError) {
                if (unlinkError.code !== 'ENOENT') { // Ignorar si el archivo no existe
                    console.error('Error al eliminar el archivo temporal:', unlinkError);
                }
            }
        }
    }
};

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            include: [{
                model: Login,
                attributes: ['name', 'lastName', 'gender', 'birthDate', 'phoneNumber', 'email', 'profilePicture']
            }]
        });

        const patientsWithImageUrls = patients.map(patient => {
            const patientData = patient.toJSON(); // Convertir instancia de Sequelize a objeto plano

            return {
                ...patientData,
                profilePictureUrl: patientData.Login ? patientData.Login.profilePicture : null // Añadir la URL de la imagen de perfil
            };
        });

        res.status(200).json(patientsWithImageUrls);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.getPatientById = async (req, res) => {

    const { id } = req.params;

    try {

        const patient = await Patient.findOne({
            where: { id },
            include: [{
                model: Login,
                attributes: ['name', 'lastName', 'gender', 'birthDate', 'phoneNumber', 'email', 'profilePicture', 'role']
            }]
        });

        // Verificar si se encontró el paciente
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const profilePictureUrl = patient.Login.profilePicture || null;

        res.status(200).json({ ...patient.toJSON(), profilePictureUrl });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};


exports.getDoctorById = async (req, res) => {

    const token = req.cookies.token || req.headers['authorization']; // O también puedes obtenerlo del Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        // Verificar el token con la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const doctor = await Doctor.findOne({
            where: { loginId: decoded.loginId }, // Buscar el doctor por ID
            include: [{
                model: Login,
                attributes: ['name', 'lastName', 'gender', 'birthDate', 'phoneNumber', 'email', 'profilePicture', 'role']
            }]
        });

        // Verificar si se encontró el doctor
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const profilePictureUrl = doctor.Login.profilePicture || null;
        const clinicLogoUrl = doctor.clinicLogo || null;

        res.status(200).json({ ...doctor.toJSON(), profilePictureUrl, clinicLogoUrl });

    } catch (error) {
        // Manejo de errores
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token inválido' });
        }
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.getDoctorByIdReal = async (req, res) => {

    const { id } = req.params;

    try {

        const doctor = await Doctor.findOne({
            where: { id },
            include: [Login]
        });

        // Verificar si se encontró el doctor
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const profilePictureUrl = doctor.Login.profilePicture || null;
        const clinicLogoUrl = doctor.clinicLogo || null;

        res.status(200).json({ ...doctor.toJSON(), profilePictureUrl, clinicLogoUrl });

    } catch (error) {
        // Manejo de errores
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token inválido' });
        }
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.updatePatient = async (req, res) => {
    const { id } = req.params;
    const {
        name, lastName, gender, birthDate, phoneNumber, maritalStatus, occupation, address, origin
    } = req.body;

    // Manejo de archivos subidos
    let profilePicture = null;

    // Validación de archivos subidos
    if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        profilePicture = req.files['profilePicture'][0];
    }

    try {

        if (!validGender.includes(gender)) {
            if (profilePicture) await fs.unlink(profilePicture.path);
            return res.status(400).json({ error: 'Invalid gender' });
        }

        const patient = await Patient.findByPk(id, {
            include: [Login]
        });

        if (!patient) {
            if (profilePicture) await fs.unlink(profilePicture.path);
            return res.status(404).json({ error: 'Patient not found' });
        }

        let newImageUrl = patient.Login.profilePicture;

        // Si se sube una nueva imagen, manejar la lógica de Cellar
        if (profilePicture) {
            const bucketName = process.env.CELLAR_BUCKET_NAME; // Reemplaza con tu bucket en Cellar
            const fileName = `auths/${Date.now()}_${profilePicture.originalname}`;
            const mimeType = profilePicture.mimetype;

            // Subir la nueva imagen a Cellar
            const fileContent = await fs.readFile(profilePicture.path);
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
            if (patient.Login.profilePicture) {
                const oldFileName = patient.Login.profilePicture.split(`${bucketName}/`)[1];
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
            await fs.unlink(profilePicture.path);
        }

        await patient.Login.update({ name, lastName, gender, birthDate, phoneNumber, profilePicture: newImageUrl });
        await patient.update({ maritalStatus, occupation, address, origin });

        res.status(200).json({ message: 'Patient updated successfully' });
    } catch (error) {
        if (profilePicture && profilePicture.path) {
            try {
                await fs.unlink(profilePicture.path);
            } catch (unlinkError) {
                if (unlinkError.code !== 'ENOENT') { // Ignorar si el archivo no existe
                    console.error('Error al eliminar el archivo temporal:', unlinkError);
                }
            }
        }
        res.status(500).json({ error: 'server error', details: error.message });
    }
};


exports.updateDoctor = async (req, res) => {
    const { id } = req.params;
    const {
        name, lastName, gender, birthDate, phoneNumber, degree, professionalLicense, specialty, specialtyLicense, clinicName, clinicAddress
    } = req.body;

    let profilePicture = null;
    let clinicLogo = null;
    let authorizationFile = null;

    // Validación de archivos subidos
    if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        profilePicture = req.files['profilePicture'][0];
    }

    if (req.files && req.files['clinicLogo'] && req.files['clinicLogo'][0]) {
        clinicLogo = req.files['clinicLogo'][0];
    }

    if (req.files && req.files['authorizationFile'] && req.files['authorizationFile'][0]) {
        authorizationFile = req.files['authorizationFile'][0];
    }


    try {

        if (!validGender.includes(gender)) {
            if (profilePicture) await fs.unlink(profilePicture.path);
            if (clinicLogo) await fs.unlink(clinicLogo.path);
            return res.status(400).json({ error: 'Invalid gender' });
        }

        const doctor = await Doctor.findByPk(id, {
            include: [Login]
        });

        if (!doctor) {
            if (profilePicture) await fs.unlink(profilePicture.path);
            if (clinicLogo) await fs.unlink(clinicLogo.path);
            return res.status(404).json({ error: 'Doctor not found' });
        }

        let newImageUrl = doctor.Login.profilePicture;

        if (profilePicture) {
            const bucketName = process.env.CELLAR_BUCKET_NAME; // Reemplaza con tu bucket en Cellar
            const fileName = `auths/${Date.now()}_${profilePicture.originalname}`;
            const mimeType = profilePicture.mimetype;

            // Subir la nueva imagen a Cellar
            const fileContent = await fs.readFile(profilePicture.path);
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
            if (doctor.Login.profilePicture) {
                const oldFileName = doctor.Login.profilePicture.split(`${bucketName}/`)[1];
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
            await fs.unlink(profilePicture.path);
        }

        // Logo
        let newImageUrlLogo = doctor.clinicLogo;

        if (clinicLogo) {
            const bucketName = process.env.CELLAR_BUCKET_NAME; // Reemplaza con tu bucket en Cellar
            const fileName = `auths/${Date.now()}_${clinicLogo.originalname}`;
            const mimeType = clinicLogo.mimetype;

            // Subir la nueva imagen a Cellar
            const fileContent = await fs.readFile(clinicLogo.path);
            const uploadParams = {
                Bucket: bucketName,
                Key: fileName,
                Body: fileContent,
                ContentType: mimeType,
                ACL: 'public-read',
            };

            const uploadCommand = new PutObjectCommand(uploadParams);
            await s3Client.send(uploadCommand);
            newImageUrlLogo = `https://cellar-c2.services.clever-cloud.com/${bucketName}/${fileName}`;

            // Eliminar la imagen anterior del bucket si existe
            if (doctor.clinicLogo) {
                const oldFileName = doctor.clinicLogo.split(`${bucketName}/`)[1];
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
            await fs.unlink(clinicLogo.path);
        }

        await doctor.Login.update({ name, lastName, gender, birthDate, phoneNumber, profilePicture: newImageUrl });
        await doctor.update({ degree, professionalLicense, specialty, specialtyLicense, clinicName, clinicAddress, clinicLogo: newImageUrlLogo, authorizationFile });

        res.status(200).json({ message: 'Doctor updated successfully' });
    } catch (error) {
        if (profilePicture && profilePicture.path) {
            try {
                await fs.unlink(profilePicture.path);
            } catch (unlinkError) {
                if (unlinkError.code !== 'ENOENT') { // Ignorar si el archivo no existe
                    console.error('Error al eliminar el archivo temporal:', unlinkError);
                }
            }
        } else if (clinicLogo && clinicLogo.path) {
            try {
                await fs.unlink(clinicLogo.path);
            } catch (unlinkError) {
                if (unlinkError.code !== 'ENOENT') { // Ignorar si el archivo no existe
                    console.error('Error al eliminar el archivo temporal:', unlinkError);
                }
            }
        }
        res.status(500).json({ error: 'server error', details: error.message });
    }
};


exports.deletePatient = async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await Patient.findByPk(id, {
            include: [Login, MedicalHistory, CardiovascularSystem, EtsDisease, PathologicalHistory, OralCavity]
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Eliminar la imagen asociada si existe
        if (patient.Login.profilePicture) {
            const bucketName = process.env.CELLAR_BUCKET_NAME; // Reemplaza con el nombre de tu bucket

            // Extrae el nombre del archivo desde la URL si guardaste la URL completa
            const fileName = patient.Login.profilePicture.split(`${bucketName}/`)[1];

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

        // Eliminar asociaciones si existen
        if (patient.MedicalHistory) {
            await patient.MedicalHistory.destroy();
        }

        if (patient.CardiovascularSystem) {
            await patient.CardiovascularSystem.destroy();
        }

        if (patient.EtsDisease) {
            await patient.EtsDisease.destroy();
        }

        if (patient.PathologicalHistory) {
            await patient.PathologicalHistory.destroy();
        }

        if (patient.OralCavity) {
            await patient.OralCavity.destroy();
        }

        await patient.destroy();
        await patient.Login.destroy();

        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    const { id } = req.params;

    try {
        const doctor = await Doctor.findByPk(id, {
            include: [Login, Promotion]
        });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Eliminar la imagen asociada si existe
        if (doctor.Login.profilePicture) {
            const bucketName = process.env.CELLAR_BUCKET_NAME; // Reemplaza con el nombre de tu bucket

            // Extrae el nombre del archivo desde la URL si guardaste la URL completa
            const fileName = doctor.Login.profilePicture.split(`${bucketName}/`)[1];

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

        if (doctor.clinicLogo) {
            const bucketName = process.env.CELLAR_BUCKET_NAME; // Reemplaza con el nombre de tu bucket

            // Extrae el nombre del archivo desde la URL si guardaste la URL completa
            const fileName = doctor.clinicLogo.split(`${bucketName}/`)[1];

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

        if (doctor.Promotion) {
            await doctor.Promotion.destroy();
        }

        await doctor.destroy();
        await doctor.Login.destroy();

        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const login = await Login.findOne({ where: { email } });
        if (!login) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, login.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ loginId: login.id, role: login.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({ token, role: login.role });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.userInfo = async (req, res) => {

    const token = req.cookies.token || req.headers['authorization']; // O también puedes obtenerlo del Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patient = await Patient.findOne({
            where: { loginId: decoded.loginId },
            include: [Login]
        });

        // Verificar si se encontró el paciente
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const profilePictureUrl = patient.Login.profilePicture || null;

        res.status(200).json({ ...patient.toJSON(), profilePictureUrl });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.checkEmailDoctor = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await Login.findOne({ where: { email } });

        if (user) {
            return res.status(200).json({ exists: true }); // El correo ya está registrado

        } else {
            res.status(200).json({ exists: false });
        }

        // El correo no está registrado
    } catch (error) {
        res.status(500).json({ error: "Error al verificar el correo" });
    }
};

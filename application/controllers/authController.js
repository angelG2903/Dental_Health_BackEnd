const { Login, Patient, Doctor, MedicalHistory, CardiovascularSystem, EtsDisease, PathologicalHistory, OralCavity, Promotion } = require('../../domain/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Función para mover archivos de la carpeta temporal a la carpeta final
function moveFile(tempPath, finalPath) {
    try {
        fs.renameSync(tempPath, finalPath);
        console.log('Archivo movido correctamente');    
    } catch (err) {
        if (err.code === 'ENOENT') {
            // El archivo no existe, continuar con el programa
            console.warn(`Archivo no encontrado para mover: ${tempPath}`);
        } else {
            console.error(`Error al mover archivo de ${tempPath} a ${finalPath}:`, err.message);
        }
    }
}

// Función para eliminar archivos de la carpeta temporal
function deleteFile(filePath) {
    try {
        fs.unlinkSync(filePath);
        console.log('Archivo eliminado correctamente');
    } catch (error) {
        if (err.code === 'ENOENT') {
            // El archivo no existe, continuar con el programa
            console.warn(`Archivo no encontrado para eliminar: ${filePath}`);
        } else {
            console.error(`Error al eliminar archivo en ${filePath}:`, err.message);
        }
    }
}


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

    // Manejo de archivos subidos
    let profilePicture = null;
    let clinicLogo = null;
    let authorizationFile = null;

    // Rutas de directorio
    const tempUploadDir = 'infrastructure/temp_uploads/';
    const finalUploadDir = 'infrastructure/uploads/';


    // Validación de archivos subidos
    if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        profilePicture = req.files['profilePicture'][0].filename;
    }

    if (req.files && req.files['clinicLogo'] && req.files['clinicLogo'][0]) {
        clinicLogo = req.files['clinicLogo'][0].filename;
    }

    if (req.files && req.files['authorizationFile'] && req.files['authorizationFile'][0]) {
        authorizationFile = req.files['authorizationFile'][0].filename;
    }

    if (!validGender.includes(gender)){
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        if (clinicLogo) deleteFile(path.join(tempUploadDir, clinicLogo));
        if (authorizationFile) deleteFile(path.join(tempUploadDir, authorizationFile));
        return res.status(400).json({ error: 'Invalid gender' });
    }

    try {
        const role = 'doctor';
        const hashedPassword = await bcrypt.hash(password, 12);
        const newLogin = await Login.create({ name, lastName, gender, birthDate, phoneNumber, profilePicture, email, password: hashedPassword, role });

        
        await Doctor.create({ loginId: newLogin.id, degree, professionalLicense, specialty, specialtyLicense, clinicName, clinicLogo, clinicAddress, authorizationFile });
        

        const token = jwt.sign({ loginId: newLogin.id, role: newLogin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        if (profilePicture) moveFile(path.join(tempUploadDir, profilePicture), path.join(finalUploadDir, profilePicture));
        if (clinicLogo) moveFile(path.join(tempUploadDir, clinicLogo), path.join(finalUploadDir, clinicLogo));
        if (authorizationFile) moveFile(path.join(tempUploadDir, authorizationFile), path.join(finalUploadDir, authorizationFile));

        // respuesta solo para comprobar token
        res.status(201).json({ token });
    } catch (error) {
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        if (clinicLogo) deleteFile(path.join(tempUploadDir, clinicLogo));
        if (authorizationFile) deleteFile(path.join(tempUploadDir, authorizationFile));
        res.status(500).json({ error: 'server error', details: error.message });
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

    // Rutas de directorio
    const tempUploadDir = 'infrastructure/temp_uploads/';
    const finalUploadDir = 'infrastructure/uploads/';

    // Validación de archivos subidos
    if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        profilePicture = req.files['profilePicture'][0].filename;
    }


    if (!validGender.includes(gender)){
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        return res.status(400).json({ error: 'Invalid gender' });
    }

    try {
        const role = 'patient';
        const hashedPassword = await bcrypt.hash(password, 12);
        const newLogin = await Login.create({ name, lastName, gender, birthDate, phoneNumber, profilePicture, email, password: hashedPassword, role });

        await Patient.create({ loginId: newLogin.id, maritalStatus, occupation, address, origin })

        const token = jwt.sign({ loginId: newLogin.id, role: newLogin.role }, process.env.JWT_SECRET, { expiresIn: '1H' });

        if (profilePicture) moveFile(path.join(tempUploadDir, profilePicture), path.join(finalUploadDir, profilePicture));

        // respuesta solo para comprobar token
        res.status(201).json({ token, loginId: newLogin.id, role: newLogin.role });
    } catch (error) {
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        res.status(500).json({ error: 'server error', details: error.message });
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

        // Construir la URL completa para cada imagen de promoción
        const baseUrl = req.protocol + '://' + req.get('host'); // http://localhost:3000
        const imageDirectory = 'infrastructure/uploads/'; // Directorio donde están almacenadas las imágenes

        // Crear la lista de pacientes con las URLs de las imágenes
        const patientsWithImageUrls = patients.map(patient => {
            const patientData = patient.toJSON(); // Convertir instancia de Sequelize a objeto plano
            
            // Verificar si existe 'profilePicture' en el objeto 'Login' relacionado
            const profilePictureUrl = patientData.Login && patientData.Login.profilePicture 
                ? `${baseUrl}/${imageDirectory}${patientData.Login.profilePicture}` 
                : null;

            return {
                ...patientData,
                profilePictureUrl, // Añadir la URL de la imagen de perfil
            };
        });

        res.status(200).json(patientsWithImageUrls);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
};

exports.getPatientById = async (req, res) => {
    const { id } = req.params; // Obtener el ID del paciente desde los parámetros de la solicitud

    try {
        const patient = await Patient.findOne({
            where: { id }, // Buscar el paciente por ID
            include: [{
                model: Login,
                attributes: ['name', 'lastName', 'gender', 'birthDate', 'phoneNumber', 'email', 'profilePicture']
            }]
        });

        // Verificar si se encontró el paciente
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Construir la URL base para las imágenes
        const baseUrl = req.protocol + '://' + req.get('host'); // Ejemplo: http://localhost:3000
        const imageDirectory = 'infrastructure/uploads/'; // Directorio donde están almacenadas las imágenes

        // Convertir el paciente encontrado en un objeto plano de JavaScript
        const patientData = patient.toJSON();

        // Verificar si existe 'profilePicture' en el objeto 'Login' relacionado
        const profilePictureUrl = patientData.Login && patientData.Login.profilePicture 
            ? `${baseUrl}/${imageDirectory}${patientData.Login.profilePicture}` 
            : null;

        // Crear el objeto de respuesta con la URL de la imagen de perfil
        const patientWithImageUrl = {
            ...patientData,
            profilePictureUrl, // Añadir la URL de la imagen de perfil
        };

        res.status(200).json(patientWithImageUrl);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};


exports.getDoctorById = async (req, res) => {
    const { id } = req.params; // Obtener el ID del doctor desde los parámetros de la solicitud

    try {
        const doctor = await Doctor.findOne({
            where: { id }, // Buscar el doctor por ID
            include: [{
                model: Login,
                attributes: ['name', 'lastName', 'gender', 'birthDate', 'phoneNumber', 'email', 'profilePicture']
            }]
        });

        // Verificar si se encontró el doctor
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Construir la URL base para las imágenes
        const baseUrl = req.protocol + '://' + req.get('host'); // Ejemplo: http://localhost:3000
        const imageDirectory = 'infrastructure/uploads/'; // Directorio donde están almacenadas las imágenes

        // Convertir el doctor encontrado en un objeto plano de JavaScript
        const doctorData = doctor.toJSON();

        // Verificar si existe 'profilePicture' en el objeto 'Login' relacionado
        const profilePictureUrl = doctorData.Login && doctorData.Login.profilePicture 
            ? `${baseUrl}/${imageDirectory}${doctorData.Login.profilePicture}` 
            : null;

        // Verificar si existe 'clinicLogo' en el objeto 'Doctor'
        const clinicLogoUrl = doctorData.clinicLogo 
            ? `${baseUrl}/${imageDirectory}${doctorData.clinicLogo}` 
            : null;

        // Verificar si existe 'authorizationFile' en el objeto 'Doctor'
        const authorizationFileUrl = doctorData.authorizationFile 
            ? `${baseUrl}/${imageDirectory}${doctorData.authorizationFile}` 
            : null;

        // Crear el objeto de respuesta con las URL de las imágenes
        const doctorWithImageUrls = {
            ...doctorData,
            profilePictureUrl,   
            clinicLogoUrl,       
            authorizationFileUrl
        };

        res.status(200).json(doctorWithImageUrls);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

exports.updatePatient = async (req, res) => {
    const { id } = req.params;
    const {
        name, lastName, gender, birthDate, phoneNumber, maritalStatus, occupation, address, origin
    } = req.body;

    // Rutas de directorio
    const tempUploadDir = 'infrastructure/temp_uploads/';
    const finalUploadDir = 'infrastructure/uploads/';

    // Manejo de archivos subidos
    let profilePicture = null;

    // Validación de archivos subidos
    if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        profilePicture = req.files['profilePicture'][0].filename;
    }

    if (!validGender.includes(gender)){
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        return res.status(400).json({ error: 'Invalid gender' });
    }

    try {
        const patient = await Patient.findByPk(id, {
            include: [Login]
        });

        if (!patient) {
            if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Si hay una nueva imagen, eliminar la anterior y mover la nueva
        if (profilePicture) {
            // Eliminar la imagen anterior si existe
            if (patient.Login.profilePicture) {
                deleteFile(path.join(finalUploadDir, patient.Login.profilePicture));
            }
            // Mover la nueva imagen al directorio final
            moveFile(path.join(tempUploadDir, profilePicture), path.join(finalUploadDir, profilePicture));
        } else {
            // Si no hay una nueva imagen, mantener la existente
            profilePicture = patient.Login.profilePicture;
        }

        await patient.Login.update({ name, lastName, gender, birthDate, phoneNumber, profilePicture });
        await patient.update({ maritalStatus, occupation, address, origin });

        res.status(200).json({ message: 'Patient updated successfully' });
    } catch (error) {
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        res.status(500).json({ error: 'server error', details: error.message });
    }
};


exports.updateDoctor = async (req, res) => {
    const { id } = req.params;
    const {
        name, lastName, gender, birthDate, phoneNumber, degree, professionalLicense, specialty, specialtyLicense, clinicName, clinicAddress
    } = req.body;

    // Manejo de archivos subidos
    let profilePicture = null;
    let clinicLogo = null;
    let authorizationFile = null;

    // Rutas de directorio
    const tempUploadDir = 'infrastructure/temp_uploads/';
    const finalUploadDir = 'infrastructure/uploads/';

    // Validación de archivos subidos
    if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        profilePicture = req.files['profilePicture'][0].filename;
    }

    if (req.files && req.files['clinicLogo'] && req.files['clinicLogo'][0]) {
        clinicLogo = req.files['clinicLogo'][0].filename;
    }

    if (req.files && req.files['authorizationFile'] && req.files['authorizationFile'][0]) {
        authorizationFile = req.files['authorizationFile'][0].filename;   
    }

    if (!validGender.includes(gender)){
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        if (clinicLogo) deleteFile(path.join(tempUploadDir, clinicLogo));
        if (authorizationFile) deleteFile(path.join(tempUploadDir, authorizationFile));
        return res.status(400).json({ error: 'Invalid gender' });
    }

    try {
        const doctor = await Doctor.findByPk(id, {
            include: [Login]
        });

        if (!doctor) {
            if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
            if (clinicLogo) deleteFile(path.join(tempUploadDir, clinicLogo));
            if (authorizationFile) deleteFile(path.join(tempUploadDir, authorizationFile));
            return res.status(404).json({ error: 'Doctor not found' });
        }

        if (profilePicture) {
            if (doctor.Login.profilePicture) {
                deleteFile(path.join(finalUploadDir, doctor.Login.profilePicture));
            }
            moveFile(path.join(tempUploadDir, profilePicture), path.join(finalUploadDir, profilePicture));
        } else {
            profilePicture = doctor.Login.profilePicture;
        }

        if (clinicLogo) {
            if (doctor.clinicLogo) {
                deleteFile(path.join(finalUploadDir, doctor.clinicLogo));
            }
            moveFile(path.join(tempUploadDir, clinicLogo), path.join(finalUploadDir, clinicLogo));
        } else {
            clinicLogo = doctor.clinicLogo;
        }

        if (authorizationFile) {
            if (doctor.authorizationFile) {
                deleteFile(path.join(finalUploadDir, doctor.authorizationFile));
            }
            moveFile(path.join(tempUploadDir, authorizationFile), path.join(finalUploadDir, authorizationFile));
        } else {
            authorizationFile = doctor.authorizationFile;
        }

        await doctor.Login.update({ name, lastName, gender, birthDate, phoneNumber, profilePicture });
        await doctor.update({ degree, professionalLicense, specialty, specialtyLicense, clinicName, clinicAddress, clinicLogo, authorizationFile });

        res.status(200).json({ message: 'Doctor updated successfully' });
    } catch (error) {
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        if (clinicLogo) deleteFile(path.join(tempUploadDir, clinicLogo));
        if (authorizationFile) deleteFile(path.join(tempUploadDir, authorizationFile));
        res.status(500).json({ error: 'server error', details: error.message });
    }
};


exports.deletePatient = async (req, res) => {
    const { id } = req.params;
    const finalUploadDir = 'infrastructure/uploads/';

    try {
        const patient = await Patient.findByPk(id, {
            include: [Login, MedicalHistory, CardiovascularSystem, EtsDisease, PathologicalHistory, OralCavity]
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Eliminar archivos si es necesario
        if (patient.Login.profilePicture) {
            try {
                deleteFile(path.join(finalUploadDir, patient.Login.profilePicture));
            } catch (err) {
                if (err.code === 'ENOENT') {
                    // El archivo no existe, continuar con el programa
                    console.warn(`Archivo no encontrado para eliminar`);
                } else {
                    console.error(`Error al eliminar archivo`, err.message);
                }
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
    const finalUploadDir = 'infrastructure/uploads/';

    try {
        const doctor = await Doctor.findByPk(id, {
            include: [Login, Promotion]
        });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        if (doctor.Login.profilePicture) {
            try {
                deleteFile(path.join(finalUploadDir, doctor.Login.profilePicture));
            } catch (err) {
                if (err.code === 'ENOENT') {
                    // El archivo no existe, continuar con el programa
                    console.warn(`Archivo no encontrado para eliminar`);
                } else {
                    console.error(`Error al eliminar archivo`, err.message);
                }
            }
        }

        if (doctor.clinicLogo) {
            try {
                deleteFile(path.join(finalUploadDir, doctor.clinicLogo));
            } catch (err) {
                if (err.code === 'ENOENT') {
                    // El archivo no existe, continuar con el programa
                    console.warn(`Archivo no encontrado para eliminar`);
                } else {
                    console.error(`Error al eliminar archivo`, err.message);
                }
            }
        }

        if (doctor.authorizationFile) {
            try {
                deleteFile(path.join(finalUploadDir, doctor.authorizationFile));
            } catch (err) {
                if (err.code === 'ENOENT') {
                    // El archivo no existe, continuar con el programa
                    console.warn(`Archivo no encontrado para eliminar`);
                } else {
                    console.error(`Error al eliminar archivo`, err.message);
                }
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
        if (!isMatch){
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ loginId: login.id, role: login.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.userInfo = async (req, res) => {

    const token = req.cookies.token; // O también puedes obtenerlo del Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        // Verificar el token con la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Enviar solo la información que el frontend necesita
        res.json({
            role: decoded.role,
            loginId: decoded.loginId,
        });
    } catch (err) {
        res.status(403).json({ message: 'Token inválido o expirado' });
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

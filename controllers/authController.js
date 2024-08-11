const { Login, Patient, Doctor } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
        role,
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
    const tempUploadDir = 'temp_uploads/';
    const finalUploadDir = 'uploads/';

    const validRoles = ['doctor'];

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

    // validaciones 
    if (!validRoles.includes(role)){
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        if (clinicLogo) deleteFile(path.join(tempUploadDir, clinicLogo));
        if (authorizationFile) deleteFile(path.join(tempUploadDir, authorizationFile));
        return res.status(400).json({ error: 'Invalid role' });
    }

    if (!validGender.includes(gender)){
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        if (clinicLogo) deleteFile(path.join(tempUploadDir, clinicLogo));
        if (authorizationFile) deleteFile(path.join(tempUploadDir, authorizationFile));
        return res.status(400).json({ error: 'Invalid gender' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newLogin = await Login.create({ name, lastName, gender, birthDate, phoneNumber, profilePicture, email, password: hashedPassword, role });

        // Depende del rol
        if (role === 'doctor') {
            await Doctor.create({ loginId: newLogin.id, degree, professionalLicense, specialty, specialtyLicense, clinicName, clinicLogo, clinicAddress, authorizationFile });
        }

        const token = jwt.sign({ loginId: newLogin.id, role: newLogin.role }, process.env.JWT_SECRET, { expiresIn: '1H' });
        
        if (profilePicture) moveFile(path.join(tempUploadDir, profilePicture), path.join(finalUploadDir, profilePicture));
        if (clinicLogo) moveFile(path.join(tempUploadDir, clinicLogo), path.join(finalUploadDir, clinicLogo));
        if (authorizationFile) moveFile(path.join(tempUploadDir, authorizationFile), path.join(finalUploadDir, authorizationFile));

        // respuesta solo para comprobar token
        res.status(201).json({ token, loginId: newLogin.id, role: newLogin.role });
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
        role,
        maritalStatus,
        occupation,
        address,
        origin
    } = req.body;

    // Manejo de archivos subidos
    let profilePicture = null;

    const validRoles = ['patient'];

    // Rutas de directorio
    const tempUploadDir = 'temp_uploads/';
    const finalUploadDir = 'uploads/';

     // Validación de archivos subidos
     if (req.files && req.files['profilePicture'] && req.files['profilePicture'][0]) {
        profilePicture = req.files['profilePicture'][0].filename;
    }

    // validaciones 
    if (!validRoles.includes(role)){
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        return res.status(400).json({ error: 'Invalid role' });
    }

    if (!validGender.includes(gender)){
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
        return res.status(400).json({ error: 'Invalid gender' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newLogin = await Login.create({ name, lastName, gender, birthDate, phoneNumber, profilePicture, email, password: hashedPassword, role });

        // Depende del rol
        if (role === 'patient') {
            await Patient.create({ loginId: newLogin.id, maritalStatus, occupation, address, origin })
        }

        const token = jwt.sign({ loginId: newLogin.id, role: newLogin.role }, process.env.JWT_SECRET, { expiresIn: '1H' });

        if (profilePicture) moveFile(path.join(tempUploadDir, profilePicture), path.join(finalUploadDir, profilePicture));

        // respuesta solo para comprobar token
        res.status(201).json({ token, loginId: newLogin.id, role: newLogin.role });
    } catch (error) {
        if (profilePicture) deleteFile(path.join(tempUploadDir, profilePicture));
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

        const token = jwt.sign({ loginId: login.id, role: login.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, loginId: login.id, role: login.role });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// no lo veo necesario
exports.logout = (req, res) => {
    try {
        // Invalidar el token en el lado del cliente eliminándolo (por ejemplo, eliminándolo del almacenamiento local)
        // Elimina el token de localStorage del lado del front end
        // localStorage.removeItem('token');
        
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

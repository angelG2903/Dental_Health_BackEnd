const { Login, Patient, Doctor } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validRoles = ['doctor', 'patient'];
const validGender = ['femenino', 'masculino'];

exports.register = async (req, res) => {
    const { 
        name, 
        lastName, 
        gender, 
        birthDate, 
        phoneNumber, 
        profilePicture, 
        email, 
        password, 
        role,
        maritalStatus,
        occupation,
        address,
        origin,
        degree,
        professionalLicense,
        specialty,
        specialtyLicense,
        clinicName,
        clinicLogo,
        clinicAddress,
        authorizationFile
    } = req.body;

    if (!validRoles.includes(role)){
        return res.status(400).json({ error: 'Invalid role' });
    }

    if (!validGender.includes(gender)){
        return res.status(400).json({ error: 'Invalid gender' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newLogin = await Login.create({ name, lastName, gender, birthDate, phoneNumber, profilePicture, email, password: hashedPassword, role });


        // Depende del rol
        if (role === 'patient') {
            await Patient.create({ loginId: newLogin.id, maritalStatus, occupation, address, origin })
        } else if (role === 'doctor') {
            await Doctor.create({ loginId: newLogin.id, degree, professionalLicense, specialty, specialtyLicense, clinicName, clinicLogo, clinicAddress, authorizationFile });
        }

        const token = jwt.sign({ loginId: newLogin.id, role: newLogin.role }, process.env.JWT_SECRET, { expiresIn: '1H' });

        // respuesta solo para comprobar token
        res.status(201).json({ token, loginId: newLogin.id, role: newLogin.role });
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

        const token = jwt.sign({ loginId: login.id, role: login.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, loginId: login.id, role: login.role });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
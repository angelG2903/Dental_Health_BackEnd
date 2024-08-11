const express = require('express');
const { registerDoctor, registerPatient, login } = require('../controllers/authController')
const upload = require('../middlewares/multerConfig');

const router = express.Router();

router.post('/registerDoctor', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'clinicLogo', maxCount: 1 },
    { name: 'authorizationFile', maxCount: 1 },
]), registerDoctor);

router.post('/registerPatient', upload.fields([
    { name: 'profilePicture', maxCount: 1 }
]), registerPatient);

router.post('/login', login);

module.exports = router;
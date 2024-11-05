const express = require('express');
const { registerDoctor, registerPatient, getAllPatients, getPatientById, getDoctorById, updatePatient, updateDoctor, deletePatient, deleteDoctor, login, userInfo, checkEmailDoctor } = require('../../application/controllers/authController')
const upload = require('../../infrastructure/middlewares/multerConfig');

const router = express.Router();

router.post('/registerDoctor', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'clinicLogo', maxCount: 1 },
    { name: 'authorizationFile', maxCount: 1 }
]), registerDoctor);

router.post('/registerPatient', upload.fields([
    { name: 'profilePicture', maxCount: 1 }
]), registerPatient);

router.get('/getPatient', getAllPatients);
router.get('/getPatient/:id', getPatientById);
router.get('/getDoctor', getDoctorById);

router.put('/updatePatient/:id', upload.fields([
    { name: 'profilePicture' }
]),updatePatient);

router.put('/updateDoctor/:id', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'clinicLogo', maxCount: 1 },
    { name: 'authorizationFile', maxCount: 1 }
]), updateDoctor);

router.delete('/deletePatient/:id', deletePatient);
router.delete('/deleteDoctor/:id', deleteDoctor);

router.post('/login',upload.none(), login);
router.get('/userInfo', userInfo);
router.post('/checkEmailDoctor', checkEmailDoctor);

module.exports = router;
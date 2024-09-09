const express = require('express');
const { register, update, deleteExpe, getAllMedicalForm, getMedicalFormById } = require('../../application/controllers/medicalFormController');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');

const router = express.Router();

router.post('/register/:id', register);
router.get('/get', getAllMedicalForm);
router.get('/get/:id', getMedicalFormById);
router.put('/update/:id', update);
router.delete('/delete/:id', deleteExpe);

module.exports = router;
const express = require('express');
const { register, update, deleteExpe, getAllMedicalForm, getMedicalFormById } = require('../../application/controllers/medicalFormController');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');
const upload = require('../../infrastructure/middlewares/multerConfig');

const router = express.Router();

router.post('/register/:id', upload.none(), register);
router.get('/get/:id', getAllMedicalForm);
router.get('/getExam/:id', getMedicalFormById);
router.put('/update/:id', upload.none(), update);
router.delete('/delete/:id', deleteExpe);

module.exports = router;
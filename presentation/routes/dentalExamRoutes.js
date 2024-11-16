const express = require('express');
const { create, getAllDentalExams, updateDentalExam, deleteDentalExam, getAllDentalExamsById } = require('../../application/controllers/dentalExamController');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');

const router = express.Router();

router.post('/create/:id', create);
router.get('/getAll/:id', getAllDentalExams);
router.get('/get/:id', getAllDentalExamsById);
router.put('/update/:id', updateDentalExam);
router.delete('/delete/:id', deleteDentalExam);

module.exports = router;
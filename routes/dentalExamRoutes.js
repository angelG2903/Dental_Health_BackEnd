const express = require('express');
const { create, getAllDentalExams, updateDentalExam, deleteDentalExam } = require('../controllers/dentalExamController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/create/:id', create);
router.get('/get/:id', getAllDentalExams);
router.put('/update/:id/:examId', updateDentalExam);
router.delete('/delete/:id/:examId', deleteDentalExam);

module.exports = router;
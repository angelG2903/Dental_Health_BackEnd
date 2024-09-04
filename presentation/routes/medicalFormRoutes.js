const express = require('express');
const { register, update, deleteExpe, find } = require('../../application/controllers/medicalFormController');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');

const router = express.Router();

router.post('/register', register);
router.put('/update/:id', update);
router.delete('/delete/:id', deleteExpe);
router.get('/get/:id', find);

module.exports = router;
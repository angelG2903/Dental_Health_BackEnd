const express = require('express');
const { register, update, deleteExpe, find } = require('../controllers/medicalFormController');

const router = express.Router();

router.post('/register', register);
router.put('/update/:id', update);
router.delete('/delete/:id', deleteExpe);
router.get('/get/:id', find);

module.exports = router;
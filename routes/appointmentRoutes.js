const express = require('express');
const { register, aceptApp, cancelApp } = require('../controllers/appointmentController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/create/:id', register);
router.post('/acept/:id', aceptApp);
router.post('/cancel/:id', cancelApp);

module.exports = router;
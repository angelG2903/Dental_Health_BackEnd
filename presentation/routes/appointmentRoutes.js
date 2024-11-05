const express = require('express');
const { register, aceptApp, cancelApp, getAppointments } = require('../../application/controllers/appointmentController');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');

const router = express.Router();

router.get('/getAppointments', getAppointments);
router.post('/create/:id', register);
router.post('/acept/:id', aceptApp);
router.post('/cancel/:id', cancelApp);

module.exports = router;
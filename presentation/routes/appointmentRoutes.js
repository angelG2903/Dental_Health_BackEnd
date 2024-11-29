const express = require('express');
const { register, aceptApp, cancelApp, getAppointments, availableHours } = require('../../application/controllers/appointmentController');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');

const router = express.Router();

router.get('/getAppointments', getAppointments);
router.get('/availableHours', availableHours);
router.post('/create/:id', register);
router.post('/acept/:id', aceptApp);
router.post('/cancel/:id', cancelApp);

module.exports = router;
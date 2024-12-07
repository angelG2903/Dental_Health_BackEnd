const express = require('express');
const { register, aceptApp, cancelApp, getAppointments, getAppointmentsByPatient, availableHours } = require('../../application/controllers/appointmentController');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');

const router = express.Router();

router.get('/getAppointments', getAppointments);
router.get('/getAppointmentsById', getAppointmentsByPatient);
router.get('/availableHours', availableHours);
router.post('/create/:id', register);
router.put('/confirm/:id', aceptApp);
router.put('/cancel/:id', cancelApp);

module.exports = router;
const express = require('express');
const { getNotifications, getNotificationsById, deletedNotifications } = require('../../application/controllers/notificationController');

const router = express.Router();

router.get('/getNotifications', getNotifications);
router.get('/getNotificationsById/:id', getNotificationsById);
router.delete('/delete/:id', deletedNotifications);

module.exports = router;
const express = require('express');
const { getNotifications } = require('../../application/controllers/notificationController');

const router = express.Router();

router.get('/getNotifications', getNotifications);

module.exports = router;
const express = require('express');
const { getNotifications, deletedNotifications } = require('../../application/controllers/notificationController');

const router = express.Router();

router.get('/getNotifications', getNotifications);
router.delete('/delete/:id', deletedNotifications);

module.exports = router;
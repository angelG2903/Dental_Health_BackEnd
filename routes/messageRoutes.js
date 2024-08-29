const express = require('express');
const { getMessages, saveMessage } = require('../controllers/messageController');

const router = express.Router();

router.post('/messages', saveMessage);
router.get('/messages', getMessages);

module.exports = router;
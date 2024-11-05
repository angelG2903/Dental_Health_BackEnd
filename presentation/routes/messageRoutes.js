const express = require('express');
const { getMessages, saveMessage } = require('../../application/controllers/messageController');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');

const router = express.Router();

router.post('/messages', saveMessage);
router.get('/messages', getMessages);

module.exports = router;
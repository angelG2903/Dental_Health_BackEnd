const express = require('express');
const { register, getAllPromotions, getPromotionById, updatePromotion, deletePromotion } = require('../../application/controllers/promotionController');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');

const router = express.Router();

router.post('/create/:id', register);
router.get('/get', getAllPromotions);
router.get('/get/:id', getPromotionById);
router.put('/update/:id', updatePromotion);
router.delete('/delete/:id', deletePromotion);

module.exports = router;
const express = require('express');
const { register, getAllPromotions, getPromotionById, updatePromotion, deletePromotion } = require('../../application/controllers/promotionController');
const upload = require('../../infrastructure/middlewares/multerConfig');
const verifyToken = require('../../infrastructure/middlewares/verifyToken');

const router = express.Router();

router.post('/create/:id', upload.fields([
    { name: 'promotionalImage', maxCount: 1 }
]), register);

router.get('/get', getAllPromotions);
router.get('/get/:id', getPromotionById);

router.put('/update/:id', upload.fields([
    { name: 'promotionalImage', maxCount: 1 }
]), updatePromotion);

router.delete('/delete/:id', deletePromotion);

module.exports = router;

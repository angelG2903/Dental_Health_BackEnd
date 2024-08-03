const { Promotion, Doctor, Login } = require('../models');

exports.register = async (req, res) => {

    const { id } = req.params;

    const { title, description, promotionalImage } = req.body;

    try {

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const validationId = await Doctor.findOne({ where: { id } });
        
        if (!validationId) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        await Promotion.create({ doctorId: id, title, description, promotionalImage });

        res.status(201).json({ doctorId: id, title, description });

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}

exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.findAll({
            include: {
                model: Doctor,
                attributes: ['id'],
                include: {
                    model: Login,
                    attributes: ['name']
                },
            }
        });
        res.status(200).json(promotions);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}

exports.getPromotionById = async (req, res) => {
    const { id } = req.params;

    try {
        const promotion = await Promotion.findOne({
            where: { id },
            include: {
                model: Doctor,
                attributes: ['id'],
                include: {
                    model: Login,
                    attributes: ['name']
                },
            }
        });

        if (!promotion) {
            return res.status(404).json({ error: 'Promotion not found' });
        }

        res.status(200).json(promotion);
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}


exports.updatePromotion = async (req, res) => {
    const { id } = req.params;
    const { title, description, promotionalImage } = req.body;

    try {
        const promotion = await Promotion.findOne({ where: { id } });

        if (!promotion) {
            return res.status(404).json({ error: 'Promotion not found' });
        }

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        await Promotion.update(
            { title, description, promotionalImage },
            { where: { id } }
        );

        res.status(200).json({ message: 'Promotion updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}

exports.deletePromotion = async (req, res) => {
    const { id } = req.params;

    try {
        const promotion = await Promotion.findOne({ where: { id } });

        if (!promotion) {
            return res.status(404).json({ error: 'Promotion not found' });
        }

        await Promotion.destroy({ where: { id } });

        res.status(200).json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}




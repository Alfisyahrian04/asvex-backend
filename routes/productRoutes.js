const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    const data = await Product.find().sort({createdAt: -1});
    res.json(data);
});

router.post('/', async (req, res) => {
    try {
        const p = new Product(req.body);
        await p.save();
        res.json({ success: true, product: p });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.patch('/:id/status', async (req, res) => {
    const data = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json({ success: true, product: data });
});

router.delete('/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;

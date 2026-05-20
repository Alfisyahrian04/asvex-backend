const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
    try {
        const { items } = req.body;
        // Proteksi Stok
        for (const item of items) {
            const p = await Product.findById(item._id);
            if (!p || p.stock < item.qty) return res.status(400).json({ success: false, message: "Stok Habis!" });
        }
        const newOrder = new Order(req.body);
        await newOrder.save();
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } });
        }
        res.json({ success: true, order: newOrder });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/user/:id', async (req, res) => {
    const data = await Order.find({ buyerId: req.params.id }).sort({createdAt: -1});
    res.json(data);
});

router.get('/all', async (req, res) => {
    const data = await Order.find().sort({createdAt: -1});
    res.json(data);
});

router.get('/seller/:id', async (req, res) => {
    const data = await Order.find({ sellerId: req.params.id }).sort({createdAt: -1});
    res.json(data);
});

router.patch('/:id/status', async (req, res) => {
    const data = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json({ success: true, order: data });
});

router.delete('/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

router.delete('/system/clear-all', async (req, res) => {
    await Order.deleteMany({});
    res.json({ message: "Data dibersihkan" });
});

module.exports = router;

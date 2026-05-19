const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// 1. Buat Pesanan
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        // Potong Stok
        for (const item of req.body.items) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } });
        }
        res.json({ success: true, order: newOrder });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 2. Ambil History User (KRUSIAL)
router.get('/user/:id', async (req, res) => {
    try {
        // Cari pesanan berdasarkan buyerId
        const orders = await Order.find({ buyerId: req.params.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json([]); }
});

// 3. Ambil Semua (Admin)
router.get('/all', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

// 4. Update Status & Delete
router.patch('/:id/status', async (req, res) => {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, order: updated });
});
router.delete('/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;

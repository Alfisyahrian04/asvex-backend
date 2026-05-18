const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create Order & Deduct Stock
router.post('/', async (req, res) => {
    try {
        const { items } = req.body;

        // 1. Validasi Stok Terlebih Dahulu
        for (const item of items) {
            const p = await Product.findById(item._id);
            if (!p || p.stock < item.qty) {
                return res.status(400).json({ success: false, message: `Stok ${item.name} tidak cukup!` });
            }
        }

        // 2. Simpan Order
        const newOrder = new Order({ 
            ...req.body, 
            orderId: 'INV-' + Date.now(),
            status: 'Diproses' // Status awal langsung diproses
        });
        await newOrder.save();

        // 3. POTONG STOK DI DATABASE MONGODB
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } });
        }

        res.json({ success: true, order: newOrder });
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message }); 
    }
});

router.get('/', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

router.patch('/:id/status', async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json({ success: true, order: updated });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;

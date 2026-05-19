
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
    const newOrder = new Order({ ...req.body, orderId: 'INV-' + Date.now() });
    await newOrder.save();
    // Potong Stok
    for (const item of req.body.items) {
        await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } });
    }
    res.json({ success: true, order: newOrder });
});

router.get('/history/:email', async (req, res) => {
    const data = await Order.find({ buyerEmail: req.params.email }).sort({createdAt: -1});
    res.json(data);
});

router.get('/seller/:id', async (req, res) => {
    const data = await Order.find({ sellerId: req.params.id }).sort({createdAt: -1});
    res.json(data);
});

router.get('/all', async (req, res) => {
    const data = await Order.find().sort({createdAt: -1});
    res.json(data);
});

router.patch('/:id/status', async (req, res) => {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, order: updated });
});

router.delete('/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;

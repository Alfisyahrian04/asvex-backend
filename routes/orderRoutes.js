const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
    try {
        const { items } = req.body;
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

router.patch('/:id/complete', async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { 
            status: 'Completed', isRated: true,
            review: { rating, comment, date: new Date() } 
        }, { new: true });
        
        for (const item of order.items) {
            const p = await Product.findById(item._id);
            const newTotal = p.totalReviews + 1;
            const newAvg = ((p.avgRating * p.totalReviews) + rating) / newTotal;
            await Product.findByIdAndUpdate(item._id, { avgRating: newAvg, totalReviews: newTotal });
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/user/:id', async (req, res) => {
    const data = await Order.find({ buyerId: req.params.id }).sort({createdAt: -1});
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
    const data = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json({ success: true, order: data });
});

router.delete('/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    for (const item of req.body.items) {
        await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } });
    }
    res.json({ success: true, order: newOrder });
});

router.patch('/:id/complete', async (req, res) => {
    const { rating, comment } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { 
        status: 'Completed', 
        review: { rating, comment, date: new Date() } 
    }, { new: true });
    
    // Update Akumulasi Rating Product
    for (const item of order.items) {
        const p = await Product.findById(item._id);
        const newTotal = p.totalReviews + 1;
        const newAvg = ((p.avgRating * p.totalReviews) + rating) / newTotal;
        await Product.findByIdAndUpdate(item._id, { avgRating: newAvg, totalReviews: newTotal });
    }
    res.json({ success: true });
});

router.get('/user/:id', async (req, res) => {
    const data = await Order.find({ buyerId: req.params.id }).sort({createdAt: -1});
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

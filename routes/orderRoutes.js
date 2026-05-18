const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
    const newOrder = new Order({
        ...req.body,
        orderId: 'INV-' + Date.now()
    });
    await newOrder.save();
    res.json({ success: true, order: newOrder });
});

router.get('/', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

module.exports = router;

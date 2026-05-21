const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
    try {
        const { total, items } = req.body;
        const adminFee = Math.round(total * 0.03); // Potongan 3%
        const sellerIncome = total - adminFee;
        const newOrder = new Order({ ...req.body, adminFee, sellerIncome, orderId: 'INV-' + Date.now() });
        await newOrder.save();
        for (const item of items) { await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } }); }
        res.json({ success: true, order: newOrder });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/user/:id', async (req, res) => res.json(await Order.find({ buyerId: req.params.id }).sort({createdAt:-1})));
router.get('/all', async (req, res) => res.json(await Order.find().sort({createdAt:-1})));
router.patch('/:id/status', async (req, res) => {
    const o = await Order.findByIdAndUpdate(req.params.id, req.body, {new:true});
    res.json({ success: true, order: o });
});
module.exports = router;

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// 1. Buat Pesanan
router.post('/', async (req, res) => {
    try {
        const { items, buyerId, buyerEmail, buyerName, customerName, address, total, sellerId, paymentProof } = req.body;
        
        // Simpan Order
        const newOrder = new Order({
            orderId: 'INV-' + Date.now(),
            buyerId, buyerEmail, buyerName, customerName, address,
            items, total, sellerId, paymentProof,
            status: 'Waiting_Payment'
        });
        
        await newOrder.save();

        // Potong Stok
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } });
        }

        res.json({ success: true, order: newOrder });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 2. Ambil History User (FIXED)
router.get('/user/:id', async (req, res) => {
    try {
        // Mencari berdasarkan buyerId ATAU buyerEmail agar lebih akurat
        const orders = await Order.find({ 
            $or: [{ buyerId: req.params.id }, { buyerEmail: req.params.id }] 
        }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json({ success: false, message: "Gagal mengambil data" }); }
} );

// 3. Ambil Semua (Admin) & Seller
router.get('/all', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

router.get('/seller/:id', async (req, res) => {
    const orders = await Order.find({ sellerId: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
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

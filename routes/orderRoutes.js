const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// 1. BUAT PESANAN (FIXED FIELD: buyerPhone, customerName, address)
router.post('/', async (req, res) => {
    try {
        const { items } = req.body;
        // Proteksi Stok Minus
        for (const item of items) {
            const p = await Product.findById(item._id);
            if (!p || p.stock < item.qty) return res.status(400).json({ success: false, message: `Stok ${item.name} tidak cukup!` });
        }
        
        const newOrder = new Order(req.body);
        await newOrder.save();
        
        // Potong Stok Otomatis
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } });
        }
        res.json({ success: true, order: newOrder });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 2. SELESAIKAN ORDER & RATING AKUMULASI (POIN 3 & 9)
router.patch('/:id/complete', async (req, res) => {
    try {
        const { score, comment } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { 
            status: 'Completed', 
            isRated: true,
            review: { score, comment, date: new Date() } 
        }, { new: true });
        
        // Update Akumulasi Rating di Setiap Produk yang Dibeli
        for (const item of order.items) {
            const p = await Product.findById(item._id);
            const newTotalReviews = p.totalReviews + 1;
            const newAvgRating = ((p.avgRating * p.totalReviews) + score) / newTotalReviews;
            await Product.findByIdAndUpdate(item._id, { 
                avgRating: newAvgRating, 
                totalReviews: newTotalReviews 
            });
        }
        res.json({ success: true });
    } catch (err) { res.status(500).json(err); }
});

// 3. STATISTIK PENDAPATAN SELLER (POIN 5 - ALA GOJEK)
router.get('/seller-stats/:id', async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.params.id, status: 'Funds_Released' });
        const now = new Date();
        const startDay = new Date(now.setHours(0,0,0,0));
        const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const daily = orders.filter(o => o.createdAt >= startDay).reduce((a, b) => a + b.total, 0);
        const monthly = orders.filter(o => o.createdAt >= startMonth).reduce((a, b) => a + b.total, 0);
        const totalIncome = orders.reduce((a, b) => a + b.total, 0);

        res.json({ daily, monthly, totalIncome, count: orders.length });
    } catch (err) { res.status(500).json(err); }
});

// 4. AMBIL DATA PESANAN (BUYER, SELLER, ADMIN)
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

// 5. UPDATE STATUS (Dukung upload bukti transfer admin & retur resi)
router.patch('/:id/status', async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, order: updated });
    } catch (err) { res.status(500).json(err); }
});

// 6. HAPUS PESANAN
router.delete('/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;

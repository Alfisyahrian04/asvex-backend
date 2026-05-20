const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// ======================================================
// 1. ENDPOINT: BUAT PESANAN BARU (CHECKOUT BUYER)
// ======================================================
router.post('/', async (req, res) => {
    try {
        const { items } = req.body;

        // --- PROTEKSI STOK MINUS (Poin 11 & 13) ---
        for (const item of items) {
            const p = await Product.findById(item._id);
            if (!p || p.stock < item.qty) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Stok ${item.name} tidak mencukupi atau sudah habis!` 
                });
            }
        }

        // Simpan pesanan ke database
        const newOrder = new Order({
            ...req.body,
            status: 'Waiting_Payment'
        });
        const savedOrder = await newOrder.save();

        // --- POTONG STOK OTOMATIS (Poin 13) ---
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, { 
                $inc: { stock: -item.qty } 
            });
        }

        res.status(201).json({ success: true, order: savedOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================================================
// 2. ENDPOINT: SELESAIKAN ORDER & RATING (POIN 3 & 9)
// ======================================================
router.patch('/:id/complete', async (req, res) => {
    try {
        const { score, comment } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });
        if (order.isRated) return res.status(400).json({ message: "Anda sudah memberikan rating!" });

        // Update Status Order ke Completed
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { 
            status: 'Completed', 
            isRated: true,
            review: { score: Number(score), comment, date: new Date() } 
        }, { new: true });
        
        // --- UPDATE AKUMULASI RATING PRODUK (Poin 3) ---
        for (const item of updatedOrder.items) {
            const p = await Product.findById(item._id);
            if (p) {
                const newTotalReviews = (p.totalReviews || 0) + 1;
                const newAvgRating = (((p.avgRating || 0) * (p.totalReviews || 0)) + Number(score)) / newTotalReviews;
                
                await Product.findByIdAndUpdate(item._id, { 
                    avgRating: newAvgRating, 
                    totalReviews: newTotalReviews 
                });
            }
        }

        res.json({ success: true, order: updatedOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================================================
// 3. ENDPOINT: STATS PENDAPATAN SELLER (POIN 5 - GOJEK STYLE)
// ======================================================
router.get('/seller-stats/:id', async (req, res) => {
    try {
        // Hanya menghitung dana yang sudah lunas/cair ke seller
        const orders = await Order.find({ 
            sellerId: req.params.id, 
            status: { $in: ['Completed', 'Funds_Released'] } 
        });

        const now = new Date();
        const startDay = new Date(now.setHours(0,0,0,0));
        const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const daily = orders.filter(o => o.createdAt >= startDay).reduce((a, b) => a + b.total, 0);
        const monthly = orders.filter(o => o.createdAt >= startMonth).reduce((a, b) => a + b.total, 0);
        const totalAllTime = orders.reduce((a, b) => a + b.total, 0);

        res.json({ 
            daily, 
            monthly, 
            total: totalAllTime, 
            count: orders.length 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================================================
// 4. ENDPOINT: AMBIL DATA (BUYER, SELLER, ADMIN)
// ======================================================

// Ambil History Pesanan Buyer (History Fix)
router.get('/user/:id', async (req, res) => {
    try {
        const orders = await Order.find({ buyerId: req.params.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json([]); }
});

// Ambil Pesanan Masuk Seller
router.get('/seller/:id', async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.params.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json([]); }
});

// Ambil Semua Pesanan (Admin)
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) { res.status(500).json([]); }
});

// ======================================================
// 5. ENDPOINT: UPDATE STATUS & DELETE (ADMIN/SELLER)
// ======================================================

// Update Status (Proses, Kirim, Upload Bukti Cair, dll)
router.patch('/:id/status', async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, order: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Hapus/Cancel Pesanan (Poin 13)
router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Data pesanan berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

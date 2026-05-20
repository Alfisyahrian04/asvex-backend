const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// 1. BUAT PESANAN (DENGAN PROTEKSI STOK MINUS)
router.post('/', async (req, res) => {
    try {
        const { items, buyerId, buyerEmail, buyerName, customerName, address, total, sellerId, paymentProof } = req.body;

        // CEK STOK DULU SEBELUM PROSES
        for (const item of items) {
            const p = await Product.findById(item._id);
            if (!p || p.stock < item.qty) {
                return res.status(400).json({ success: false, message: `Stok ${item.name} habis atau tidak cukup!` });
            }
        }

        // SIMPAN PESANAN
        const newOrder = new Order({
            orderId: 'INV-' + Date.now(),
            buyerId, buyerEmail, buyerName,
            customerName, address, // Pastikan field ini masuk
            items, total, sellerId, paymentProof,
            status: 'Waiting_Payment'
        });
        await newOrder.save();

        // POTONG STOK (Hanya jika pesanan berhasil disimpan)
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } });
        }

        res.json({ success: true, order: newOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. AMBIL SEMUA DATA (ADMIN)
router.get('/all', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

// 3. AMBIL HISTORY USER
router.get('/user/:id', async (req, res) => {
    const orders = await Order.find({ buyerId: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
});

// 4. AMBIL PESANAN SELLER
router.get('/seller/:id', async (req, res) => {
    const orders = await Order.find({ sellerId: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
});

// 5. FITUR CLEAR SEMUA DATA (HANYA UNTUK MEMBERSIHKAN BUG)
router.delete('/clear-all-transactions', async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ success: true, message: "Semua history & transaksi telah dihapus!" });
    } catch (err) { res.status(500).json(err); }
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

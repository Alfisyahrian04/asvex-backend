const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// 1. BUAT PESANAN & POTONG STOK
router.post('/', async (req, res) => {
    try {
        const { items } = req.body;
        // Validasi Stok
        for (const item of items) {
            const p = await Product.findById(item._id);
            if (!p || p.stock < item.qty) return res.status(400).json({ success: false, message: `Stok ${p.name} tidak cukup!` });
        }
        // Simpan Order
        const newOrder = new Order({ ...req.body, orderId: 'INV-' + Date.now(), status: 'Pending' });
        await newOrder.save();
        // POTONG STOK
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } });
        }
        res.json({ success: true, order: newOrder });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 2. AMBIL SEMUA PESANAN
router.get('/', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

// 3. UPDATE STATUS (PROSES/KIRIM/SELESAI)
router.patch('/:id/status', async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json({ success: true, order: updated });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// 4. HAPUS / CANCEL PESANAN
router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Pesanan dihapus" });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;

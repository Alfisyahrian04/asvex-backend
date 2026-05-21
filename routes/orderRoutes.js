const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Pastikan path benar
const Product = require('../models/Product'); // Pastikan path benar

// 1. Buat Pesanan (Buyer)
router.post('/', async (req, res) => {
    try {
        const { total, items } = req.body;
        
        // Logic Poin PPN & Fee Admin
        const adminFee = Math.round(total * 0.03); 
        const sellerIncome = total - adminFee;

        const newOrder = new Order({ 
            ...req.body, 
            adminFee, 
            sellerIncome, 
            orderId: 'INV-' + Date.now() 
        });

        await newOrder.save();

        // Update Stok Otomatis
        for (const item of items) { 
            await Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.qty } }); 
        }

        res.json({ success: true, order: newOrder });
    } catch (e) { 
        res.status(500).json({ message: e.message }); 
    }
});

// 2. Ambil History Buyer
router.get('/user/:id', async (req, res) => {
    try {
        const data = await Order.find({ buyerId: req.params.id }).sort({createdAt: -1});
        res.json(data);
    } catch (e) {
        res.status(500).json([]);
    }
});

// 3. Ambil Pesanan Seller
router.get('/seller/:id', async (req, res) => {
    try {
        const data = await Order.find({ sellerId: req.params.id }).sort({createdAt: -1});
        res.json(data);
    } catch (e) {
        res.status(500).json([]);
    }
});

// 4. Ambil Semua (Admin)
router.get('/all', async (req, res) => {
    try {
        const data = await Order.find().sort({createdAt: -1});
        res.json(data);
    } catch (e) {
        res.status(500).json([]);
    }
});

// 5. Update Status (CS/Admin/Seller)
router.patch('/:id/status', async (req, res) => {
    try {
        const o = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json({ success: true, order: o });
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

module.exports = router; // PASTIKAN ADA BARIS INI

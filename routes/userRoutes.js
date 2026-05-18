const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// 1. ENDPOINT: BUAT PESANAN BARU (CHECKOUT)
router.post('/', async (req, res) => {
    try {
        const { items, customerName, address, total, paymentMethod, paymentProof } = req.body;

        // --- TAHAP 1: VALIDASI STOK ---
        for (const item of items) {
            const product = await Product.findById(item._id);
            
            if (!product) {
                return res.status(404).json({ success: false, message: `Produk ${item.name} tidak ditemukan!` });
            }

            if (product.stock < item.qty) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Stok ${product.name} tidak cukup! Sisa stok: ${product.stock}` 
                });
            }
        }

        // --- TAHAP 2: SIMPAN PESANAN KE DATABASE ---
        const newOrder = new Order({
            orderId: 'INV-' + Date.now(), // Generate ID unik otomatis
            customerName,
            address,
            items,
            total,
            paymentMethod,
            paymentProof, // Ini akan menyimpan gambar bukti transfer (Base64)
            status: 'Pending'
        });

        const savedOrder = await newOrder.save();

        // --- TAHAP 3: POTONG STOK OTOMATIS ---
        for (const item of items) {
            await Product.findByIdAndUpdate(item._id, {
                $inc: { stock: -item.qty } // Mengurangi stok berdasarkan jumlah yang dibeli
            });
        }

        // Kirim respon sukses
        res.status(201).json({ 
            success: true, 
            message: "Pesanan berhasil dibuat dan stok telah diperbarui.",
            order: savedOrder 
        });

    } catch (err) {
        console.error("Order Error:", err);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
});

// 2. ENDPOINT: AMBIL SEMUA DATA PESANAN (UNTUK ADMIN)
router.get('/', async (req, res) => {
    try {
        // Ambil semua order, urutkan dari yang terbaru (descending)
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. ENDPOINT: UPDATE STATUS PESANAN (OPSIONAL)
router.patch('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        );
        res.json({ success: true, order: updatedOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

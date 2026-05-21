const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// 1. Get All Products (Untuk Buyer)
router.get('/', async (req, res) => {
    const products = await Product.find({ stock: { $gt: 0 } }).sort({ createdAt: -1 });
    res.json(products);
});

// 2. Upload Produk (Hanya Seller)
router.post('/', protect, authorize('seller', 'admin'), async (req, res) => {
    try {
        const { price } = req.body;
        // HITUNG PPN 11% OTOMATIS
        const tax = price * 0.11;
        const priceWithTax = price + tax;

        const product = new Product({
            ...req.body,
            sellerId: req.user._id,
            sellerName: req.user.username,
            priceWithTax: Math.round(priceWithTax)
        });

        await product.save();
        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Update Stok (Hanya Seller Pemilik Produk)
router.patch('/:id/stock', protect, authorize('seller', 'admin'), async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Bukan produk Anda!" });
    }
    product.stock = req.body.stock;
    await product.save();
    res.json({ success: true });
});

module.exports = router;

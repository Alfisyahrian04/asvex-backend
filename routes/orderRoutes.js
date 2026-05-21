const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
    try {
        const { items, total } = req.body;
        
        // HITUNG POTONGAN ADMIN 3%
        const adminFee = total * 0.03;
        const sellerIncome = total - adminFee;

        const newOrder = new Order({
            ...req.body,
            orderId: 'INV-' + Date.now(),
            buyerId: req.user._id,
            buyerName: req.user.username,
            adminFee: Math.round(adminFee),
            sellerIncome: Math.round(sellerIncome)
        });

        await newOrder.save();
        res.json({ success: true, order: newOrder });
    } catch (err) {
        res.status(500).json(err);
    }
});

// CAIRKAN DANA KE SELLER (Hanya Admin setelah status Completed)
router.post('/:id/release-funds', protect, authorize('admin'), async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order.status !== 'Completed') return res.status(400).json({ message: "Order belum selesai!" });

    // Tambah Saldo Seller
    const seller = await User.findById(order.sellerId);
    seller.balance += order.sellerIncome;
    
    order.status = 'Completed'; // Final Status
    await seller.save();
    await order.save();
    
    res.json({ success: true, message: "Dana berhasil dicairkan ke Seller" });
});

module.exports = router;

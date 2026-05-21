const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// 1. STATISTIK SELLER (POIN SELLER PANEL HOME)
router.get('/seller/stats', protect, authorize('seller'), async (req, res) => {
    const orders = await Order.find({ sellerId: req.user._id, status: 'Completed' });
    
    const now = new Date();
    const startDay = new Date(now.setHours(0,0,0,0));
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailyInc = orders.filter(o => o.createdAt >= startDay).reduce((a, b) => a + b.sellerIncome, 0);
    const monthlyInc = orders.filter(o => o.createdAt >= startMonth).reduce((a, b) => a + b.sellerIncome, 0);

    res.json({
        daily: dailyInc,
        monthly: monthlyInc,
        totalBalance: req.user.balance,
        totalOrders: orders.length
    });
});

// 2. LIST KOMPLAIN UNTUK CS (POIN CS PANEL)
router.get('/cs/complaints', protect, authorize('customer_service', 'admin'), async (req, res) => {
    const complaints = await Order.find({ status: 'Complaint' }).sort({ createdAt: -1 });
    res.json(complaints);
});

module.exports = router;

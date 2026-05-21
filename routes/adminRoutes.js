const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ======================================================
// 1. DASHBOARD: AMBIL SEMUA DATA TRANSAKSI (REKBER)
// ======================================================
router.get('/orders/all', protect, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================================================
// 2. REKBER: KONFIRMASI DANA MASUK DARI BUYER
// ======================================================
router.patch('/orders/:id/approve-payment', protect, authorize('admin'), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: 'Escrow_Held' }, 
            { new: true }
        );
        res.json({ success: true, message: "Pembayaran terverifikasi. Dana ditahan di Rekber.", order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================================================
// 3. REKBER: CAIRKAN DANA KE SELLER (POIN 11)
// ======================================================
router.patch('/orders/:id/release-funds', protect, authorize('admin'), async (req, res) => {
    try {
        const { adminTransferProof } = req.body;
        if (!adminTransferProof) return res.status(400).json({ message: "Bukti transfer wajib diupload!" });

        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { 
                status: 'Funds_Released',
                adminTransferProof: adminTransferProof // Simpan bukti transfer admin ke seller
            }, 
            { new: true }
        );

        res.json({ success: true, message: "Dana berhasil dicairkan ke Seller.", order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================================================
// 4. COMPLAIN: HANDLE REFUND KE BUYER (POIN 2)
// ======================================================
router.patch('/orders/:id/refund', protect, authorize('admin'), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status: 'Cancelled' }, 
            { new: true }
        );
        res.json({ success: true, message: "Dana telah di-refund ke Buyer.", order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================================================
// 5. SELLER MGMT: AMBIL SEMUA SELLER
// ======================================================
router.get('/sellers', protect, authorize('admin'), async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller' }).select('-password');
        res.json(sellers);
    } catch (err) {
        res.status(500).json([]);
    }
});

// ======================================================
// 6. SELLER MGMT: BANNED / SUSPEND SELLER (POIN 12)
// ======================================================
router.patch('/seller/:id/status', protect, authorize('admin'), async (req, res) => {
    try {
        const { status } = req.body; // 'active' atau 'banned'
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ success: true, message: `Status Seller berhasil diubah menjadi ${status}` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ======================================================
// 7. SYSTEM: HAPUS PESANAN (CANCEL TOTAL)
// ======================================================
router.delete('/orders/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Pesanan berhasil dihapus dari sistem." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'customer_service', 'admin'], default: 'buyer' },
    status: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
    avatar: { type: String, default: "https://via.placeholder.com/150" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    isVerifiedSeller: { type: Boolean, default: false },
    // Saldo Seller
    balance: { type: Number, default: 0 },
    // Rekening untuk Pencairan
    bankInfo: { provider: String, accNumber: String, accName: String },
    walletInfo: { provider: String, phone: String, accName: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    status: { type: String, enum: ['active', 'banned'], default: 'active' }, // Untuk fitur Suspend (Poin 12)
    
    // Simpan Info Bank & Wallet secara Terpisah (Poin 6)
    bankInfo: {
        provider: { type: String, default: null }, // BCA, Mandiri, BRI, BNI
        accNumber: { type: String, default: null },
        accName: { type: String, default: null }
    },
    walletInfo: {
        provider: { type: String, default: null }, // Dana, Gopay, OVO
        phone: { type: String, default: null },
        accName: { type: String, default: null }
    },
    
    // Fitur Ganti Password (Poin 10)
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null }
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin', 'customer_service'], default: 'buyer' },
    status: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
    balance: { type: Number, default: 0 },
    bankInfo: { provider: String, accNumber: String, accName: String },
    walletInfo: { provider: String, phone: String, accName: String },
    otp: String, otpExpires: Date
});
module.exports = mongoose.model('User', UserSchema);

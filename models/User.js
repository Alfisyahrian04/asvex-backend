const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null }
});
module.exports = mongoose.model('User', UserSchema);

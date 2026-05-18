const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Untuk versi simple, simpan teks biasa. Untuk production nanti gunakan bcrypt.
    role: { type: String, default: 'user' }, // 'user' atau 'admin'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

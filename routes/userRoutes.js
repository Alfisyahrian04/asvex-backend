const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Gunakan secret key dari .env atau default
const JWT_SECRET = process.env.JWT_SECRET || "ALFI_SECRET_KEY_99";

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, adminKey } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: "Email sudah terdaftar!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        let role = 'user';
        if (adminKey === "ALFI_ADMIN_PRO") role = 'admin'; // Kunci daftar jadi admin

        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.json({ success: true, message: "Berhasil Daftar! Silakan Login." });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "User tidak ditemukan!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Password salah!" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, user: { username: user.username, role: user.role } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;

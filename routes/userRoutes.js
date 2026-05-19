const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "ALFI123";

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role, adminKey } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: "Email sudah terdaftar!" });

        const hashed = await bcrypt.hash(password, 10);
        let finalRole = role;
        if (adminKey === "ALFI_ADMIN_PRO") finalRole = 'admin';

        const newUser = new User({ username, email, password: hashed, role: finalRole });
        await newUser.save();
        res.json({ success: true, message: "Berhasil Daftar!" });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ success: false, message: "Email tidak ditemukan!" });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Password salah!" });

        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, token, user: { id: user._id, username: user.username, role: user.role, email: user.email } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;

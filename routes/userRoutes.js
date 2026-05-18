const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "alfigadget_super_secret_key"; // Ganti dengan kata rahasia apapun

// 1. REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, adminKey } = req.body;

        // Cek email sudah ada?
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar" });

        // Acak Password (Hashing)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tentukan Role (Jika adminKey benar, jadi admin)
        let role = 'user';
        if (adminKey === "ALFI_ADMIN_PRO") role = 'admin'; // Kunci rahasia buat daftar jadi admin

        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();

        res.json({ success: true, message: "Registrasi Berhasil!" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

        // Cek Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password Salah!" });

        // Buat Token (Kunci Digital)
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            success: true,
            token,
            user: { username: user.username, role: user.role, id: user._id }
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mengambil Secret Key dari .env (Railway) atau default jika tidak ada
const JWT_SECRET = process.env.JWT_SECRET || "ALFI123";

// ==========================================
// 1. ENDPOINT: REGISTER (DAFTAR AKUN)
// ==========================================
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, adminKey } = req.body;

        // Validasi input kosong
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Data tidak lengkap!" });
        }

        // Cek apakah email sudah terdaftar
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email sudah digunakan!" });
        }

        // Enkripsi Password (Hashing) agar aman
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Penentuan Role (Hanya yang tahu ADMIN_KEY yang bisa jadi admin)
        let role = 'user';
        if (adminKey === "ALFI_ADMIN_PRO") {
            role = 'admin';
        }

        // Simpan User Baru
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "Registrasi Berhasil! Silakan Login." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server saat mendaftar." });
    }
});

// ==========================================
// 2. ENDPOINT: LOGIN (MASUK AKUN)
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Email tidak terdaftar!" });
        }

        // Cek apakah password benar
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password salah!" });
        }

        // Buat Token Keamanan (JWT) berlaku selama 1 hari
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Kirim respon sukses beserta data user (tanpa password)
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server saat login." });
    }
});

// ==========================================
// 3. ENDPOINT: GANTI PASSWORD (USER MENU)
// ==========================================
router.put('/change-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ success: false, message: "Data tidak lengkap!" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password baru minimal 6 karakter!" });
        }

        // Enkripsi Password Baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update di database
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan!" });
        }

        res.json({ success: true, message: "Password berhasil diperbarui! Silakan login ulang." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Gagal mengganti password." });
    }
});

module.exports = router;

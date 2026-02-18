const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// POST /api/admin/login
router.post('/login', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }

    if (password === process.env.ADMIN_PASSWORD) {
        // Return successful login and the "token" (which is just the password for this MVP)
        // In a real app, this would generate a JWT
        res.json({
            success: true,
            message: 'Login successful',
            token: process.env.ADMIN_PASSWORD
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// GET /api/admin/verify
// Check if current token is valid
router.get('/verify', (req, res) => {
    const adminToken = req.headers['x-admin-token'];

    if (adminToken && adminToken === process.env.ADMIN_PASSWORD) {
        res.json({ success: true, valid: true });
    } else {
        res.status(401).json({ success: false, valid: false });
    }
});

module.exports = router;

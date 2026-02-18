const dotenv = require('dotenv');
dotenv.config();

const adminAuth = (req, res, next) => {
    // Get token from header
    const adminToken = req.headers['x-admin-token'];

    // Check if token exists matches the secret
    // For this MVP we use a simple shared secret as the "token"
    if (adminToken && adminToken === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid admin credentials' });
    }
};

module.exports = adminAuth;

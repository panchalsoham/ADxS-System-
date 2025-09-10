const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

// In-memory storage for reset tokens (should use database in production)
const resetTokens = new Map();

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'panchalsoham123@gmail.com',
        pass: 'Panchal123'
    }
});

// Request password reset
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Generate unique reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiryTime = Date.now() + 3600000; // Token valid for 1 hour
        
        // Store token (should save in database in production)
        resetTokens.set(resetToken, {
            email,
            expiry: expiryTime
        });

        // Create reset link
        const resetLink = `http://yourdomain.com/reset-password.html?token=${resetToken}`;

        // Send email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset link sent to your email' });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Failed to process password reset request' });
    }
});

// Verify reset token
app.post('/api/verify-reset-token', (req, res) => {
    const { token } = req.body;
    const tokenData = resetTokens.get(token);

    if (!tokenData) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (Date.now() > tokenData.expiry) {
        resetTokens.delete(token);
        return res.status(400).json({ error: 'Token has expired' });
    }

    res.json({ valid: true });
});

// Reset password
app.post('/api/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const tokenData = resetTokens.get(token);

        if (!tokenData || Date.now() > tokenData.expiry) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database (example)
        // await User.updatePassword(tokenData.email, hashedPassword);

        // Clear used token
        resetTokens.delete(token);

        res.json({ message: 'Password successfully reset' });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
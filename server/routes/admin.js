import express from 'express';
import jwt from 'jsonwebtoken';
import { ADMIN_PASSWORD } from '../middleware/auth.js';

const router = express.Router();

// POST /api/admin/login - Admin login
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign(
    { admin: true },
    process.env.JWT_SECRET || 'kwaaba-jwt-secret-change-in-production',
    { expiresIn: '30d' }
  );

  res.json({
    success: true,
    token,
    message: 'Login successful',
  });
});

// GET /api/admin/verify - Verify token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kwaaba-jwt-secret-change-in-production');
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(403).json({ authenticated: false, error: 'Invalid token' });
  }
});

export default router;
import jwt from 'jsonwebtoken';

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kwaaba2026';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kwaaba-jwt-secret-change-in-production');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}
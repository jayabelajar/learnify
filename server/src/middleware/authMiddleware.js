import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    res.status(401);
    return next(new Error('Authentication token required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'learnify_dev_secret');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      return next(new Error('User not found'));
    }
    next();
  } catch (_error) {
    res.status(401);
    next(new Error('Invalid or expired token'));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error('You are not authorized to access this resource'));
    }
    next();
  };
}

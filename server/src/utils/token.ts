import jwt from 'jsonwebtoken';

export function generateToken(user) {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'learnify_dev_secret',
    { expiresIn }
  );
}

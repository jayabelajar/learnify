import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/token.js';

const authPayload = (user) => ({
  token: generateToken(user),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  }
});

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, role });
  res.status(201).json(authPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password, role } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await (user as any).matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (role && user.role !== role) {
    res.status(403);
    throw new Error(`This account is not registered as ${role}`);
  }

  res.json(authPayload(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');
const AppError = require('../utils/appError');
const config = require('../config/env');

const sign = (user) => jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1d' });

const register = async ({ name, email, password }) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new AppError('Email already registered', 409);
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });
  return { user: { id: user.id, name: user.name, email: user.email }, token: sign(user) };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new AppError('Invalid credentials', 401);
  return { user: { id: user.id, name: user.name, email: user.email }, token: sign(user) };
};

const profile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, createdAt: true } });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

module.exports = { register, login, profile };

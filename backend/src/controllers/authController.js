const authService = require('../services/authService');

const register = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await authService.register(req.body) }); } catch (e) { next(e); }
};
const login = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await authService.login(req.body) }); } catch (e) { next(e); }
};
const logout = async (req, res) => res.status(200).json({ success: true, message: 'Logout successful. Discard token client-side.' });
const profile = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await authService.profile(req.user.userId) }); } catch (e) { next(e); }
};

module.exports = { register, login, logout, profile };

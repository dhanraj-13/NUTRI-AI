const { exportUserData } = require('../services/exportService');

const exportCsv = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await exportUserData(req.user.userId) }); } catch (e) { next(e); }
};

module.exports = { exportCsv };

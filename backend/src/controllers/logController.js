const logService = require('../services/logService');
const { refreshDailyAnalytics } = require('../analytics/analyticsService');
const { generateRecommendations } = require('../ai/recommendationEngine');
const { emitToUser } = require('../sockets/socketBus');

const broadcast = async (userId, consumedAt) => {
  const analytics = await refreshDailyAnalytics(userId, consumedAt);
  const recs = await generateRecommendations(userId, 7).catch(() => null);
  emitToUser(userId, 'analytics_updated', analytics);
  if (recs) emitToUser(userId, 'recommendations_updated', recs);
};

const create = async (req, res, next) => {
  try {
    const row = await logService.createLog(req.user.userId, req.body);
    await broadcast(req.user.userId, row.consumedAt);
    emitToUser(req.user.userId, 'nutrition_log_created', row);
    res.status(201).json({ success: true, data: row });
  } catch (e) { next(e); }
};

const list = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await logService.listLogs(req.user.userId) }); } catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try {
    const row = await logService.updateLog(req.user.userId, req.params.id, req.body);
    await broadcast(req.user.userId, row.consumedAt);
    emitToUser(req.user.userId, 'nutrition_log_updated', row);
    res.status(200).json({ success: true, data: row });
  } catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try {
    await logService.deleteLog(req.user.userId, req.params.id);
    await broadcast(req.user.userId, new Date());
    emitToUser(req.user.userId, 'nutrition_log_deleted', { id: req.params.id });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (e) { next(e); }
};

module.exports = { create, list, update, remove };

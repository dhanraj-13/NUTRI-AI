const { generateRecommendations } = require('../ai/recommendationEngine');
const { getAnalyticsSnapshot } = require('../analytics/analyticsService');

const recommendations = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await generateRecommendations(req.user.userId, Number(req.query.horizonDays || 7)) }); } catch (e) { next(e); }
};

const nutritionAnalysis = async (req, res, next) => {
  try {
    const history = await getAnalyticsSnapshot(req.user.userId);
    const latest = history[0] || null;
    res.status(200).json({ success: true, data: { latest, trend: history } });
  } catch (e) { next(e); }
};

const hydrationAnalysis = async (req, res, next) => {
  try {
    const history = await getAnalyticsSnapshot(req.user.userId);
    res.status(200).json({ success: true, data: history.map((h) => ({ date: h.trackedDate, hydrationTotalMl: h.hydrationTotalMl, hydrationScore: h.hydrationScore })) });
  } catch (e) { next(e); }
};

const focusFoods = async (req, res, next) => {
  try {
    const rec = await generateRecommendations(req.user.userId, Number(req.query.horizonDays || 7));
    res.status(200).json({ success: true, data: rec.foods });
  } catch (e) { next(e); }
};

module.exports = { recommendations, nutritionAnalysis, hydrationAnalysis, focusFoods };

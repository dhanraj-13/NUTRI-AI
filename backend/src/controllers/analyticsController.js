const { getAnalyticsSnapshot } = require('../analytics/analyticsService');

const analytics = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await getAnalyticsSnapshot(req.user.userId) }); } catch (e) { next(e); }
};

const macroAnalysis = async (req, res, next) => {
  try {
    const history = await getAnalyticsSnapshot(req.user.userId);
    res.status(200).json({
      success: true,
      data: history.map((h) => ({
        date: h.trackedDate,
        proteinTotal: h.proteinTotal,
        carbsTotal: h.carbsTotal,
        fatsTotal: h.fatsTotal
      }))
    });
  } catch (e) { next(e); }
};

const nutritionScore = async (req, res, next) => {
  try {
    const history = await getAnalyticsSnapshot(req.user.userId);
    const latest = history[0] || null;
    res.status(200).json({ success: true, data: latest ? { nutritionScore: latest.nutritionScore, productivityNutritionScore: latest.productivityNutritionScore } : null });
  } catch (e) { next(e); }
};

module.exports = { analytics, macroAnalysis, nutritionScore };

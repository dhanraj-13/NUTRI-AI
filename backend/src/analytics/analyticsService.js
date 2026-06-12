const prisma = require('../prisma/client');

const toDayStart = (value) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
};

const computeScores = (totals) => {
  const hydrationScore = Math.min(100, (totals.hydrationTotalMl / 2500) * 100);
  const macroBalance = Math.max(0, 100 - Math.abs(totals.proteinTotal - 90) - Math.abs(totals.carbsTotal - 250) * 0.2 - Math.abs(totals.fatsTotal - 70) * 0.5);
  const nutritionScore = Math.max(0, Math.min(100, (macroBalance * 0.7) + (hydrationScore * 0.3)));
  const consistencyScore = Math.max(0, Math.min(100, 100 - Math.abs(totals.caloriesTotal - 2100) * 0.04));
  const productivityNutritionScore = Math.round((nutritionScore * 0.6) + (hydrationScore * 0.25) + (consistencyScore * 0.15));
  return { hydrationScore, nutritionScore, consistencyScore, productivityNutritionScore };
};

const refreshDailyAnalytics = async (userId, dateLike = new Date()) => {
  const dayStart = toDayStart(dateLike);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const logs = await prisma.nutritionLog.findMany({
    where: { userId, consumedAt: { gte: dayStart, lt: dayEnd } },
    include: { food: true }
  });

  const totals = logs.reduce((acc, l) => {
    acc.caloriesTotal += l.totalCalories;
    acc.proteinTotal += l.totalProtein;
    acc.carbsTotal += l.totalCarbs;
    acc.fatsTotal += l.totalFats;
    acc.hydrationTotalMl += l.hydrationMl;
    return acc;
  }, { caloriesTotal: 0, proteinTotal: 0, carbsTotal: 0, fatsTotal: 0, hydrationTotalMl: 0 });

  const scores = computeScores(totals);
  const analytics = await prisma.analytics.upsert({
    where: { userId_trackedDate: { userId, trackedDate: dayStart } },
    create: { userId, trackedDate: dayStart, ...totals, ...scores },
    update: { ...totals, ...scores }
  });

  return analytics;
};

const getAnalyticsSnapshot = async (userId) => {
  const records = await prisma.analytics.findMany({ where: { userId }, orderBy: { trackedDate: 'desc' }, take: 14 });
  return records;
};

module.exports = { refreshDailyAnalytics, getAnalyticsSnapshot };

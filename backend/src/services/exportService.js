const fs = require('fs');
const path = require('path');
const prisma = require('../prisma/client');
const config = require('../config/env');
const { writeCsv } = require('../utils/csv');

const ensureExportFolder = () => {
  if (!fs.existsSync(config.exportsRoot)) fs.mkdirSync(config.exportsRoot, { recursive: true });
};

const exportUserData = async (userId) => {
  ensureExportFolder();

  const [logs, analytics, recommendations] = await Promise.all([
    prisma.nutritionLog.findMany({ where: { userId }, include: { food: true }, orderBy: { consumedAt: 'desc' } }),
    prisma.analytics.findMany({ where: { userId }, orderBy: { trackedDate: 'desc' } }),
    prisma.aiRecommendation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  ]);

  const logsCsv = logs.map((l) => ({
    log_id: l.id,
    consumed_at: l.consumedAt.toISOString(),
    food_name: l.food.foodName,
    calories: l.totalCalories,
    protein: l.totalProtein,
    carbs: l.totalCarbs,
    fats: l.totalFats,
    hydration_ml: l.hydrationMl,
    meal_type: l.mealType
  }));

  const analyticsCsv = analytics.map((a) => ({
    date: a.trackedDate.toISOString(),
    calories_total: a.caloriesTotal,
    protein_total: a.proteinTotal,
    carbs_total: a.carbsTotal,
    fats_total: a.fatsTotal,
    hydration_total_ml: a.hydrationTotalMl,
    hydration_score: a.hydrationScore,
    nutrition_score: a.nutritionScore,
    productivity_nutrition_score: a.productivityNutritionScore,
    consistency_score: a.consistencyScore
  }));

  const recCsv = recommendations.map((r) => ({
    recommendation_id: r.id,
    created_at: r.createdAt.toISOString(),
    type: r.recommendationType,
    title: r.title,
    summary: r.summary,
    food_ids: r.foodIds.join('|')
  }));

  const files = {
    nutrition_logs: writeCsv(path.join(config.exportsRoot, 'nutrition_logs.csv'), logsCsv),
    analytics: writeCsv(path.join(config.exportsRoot, 'analytics.csv'), analyticsCsv),
    recommendations: writeCsv(path.join(config.exportsRoot, 'recommendations.csv'), recCsv)
  };

  return files;
};

module.exports = { exportUserData };

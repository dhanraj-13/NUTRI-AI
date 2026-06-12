const prisma = require('../prisma/client');
const AppError = require('../utils/appError');

const generateRecommendations = async (userId, horizonDays = 7) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - horizonDays);

  const logs = await prisma.nutritionLog.findMany({
    where: { userId, consumedAt: { gte: start, lte: now } },
    include: { food: true }
  });

  if (!logs.length) throw new AppError('No nutrition behavior found for recommendations', 404);

  const totals = logs.reduce((a, l) => {
    a.cal += l.totalCalories;
    a.protein += l.totalProtein;
    a.hydration += l.hydrationMl;
    return a;
  }, { cal: 0, protein: 0, hydration: 0 });

  const avg = { cal: totals.cal / horizonDays, protein: totals.protein / horizonDays, hydration: totals.hydration / horizonDays };

  const candidates = await prisma.nutritionFood.findMany({
    where: {
      OR: [
        { foodCategory: { contains: 'fruit', mode: 'insensitive' } },
        { healthBenefits: { contains: 'energy', mode: 'insensitive' } },
        { protein: { gte: 12 } }
      ]
    },
    orderBy: [{ hydrationScore: 'desc' }, { protein: 'desc' }],
    take: 12
  });

  const recommendationType = avg.hydration < 1800 ? 'hydration_focus' : (avg.protein < 75 ? 'protein_focus' : 'balanced_focus');
  const summary = `Daily avg ${Math.round(avg.cal)} kcal, ${Math.round(avg.protein)}g protein, ${Math.round(avg.hydration)}ml hydration. Prioritize ${recommendationType}.`;

  const saved = await prisma.aiRecommendation.create({
    data: {
      userId,
      recommendationType,
      title: 'AI Nutrition Productivity Plan',
      summary,
      foodIds: candidates.slice(0, 5).map((f) => f.id),
      meta: { avg, horizonDays }
    }
  });

  return { saved, recommendationType, summary, foods: candidates.slice(0, 5) };
};

module.exports = { generateRecommendations };

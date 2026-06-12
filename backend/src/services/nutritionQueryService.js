const prisma = require('../prisma/client');
const cache = require('../utils/cache');

const buildWhere = (q) => ({
  ...(q.search ? { foodName: { contains: q.search, mode: 'insensitive' } } : {}),
  ...(q.mealType ? { mealType: q.mealType } : {}),
  ...(q.dietType ? { dietType: q.dietType } : {}),
  ...(q.foodCategory ? { foodCategory: q.foodCategory } : {}),
  ...(q.minCalories || q.maxCalories ? { calories: { ...(q.minCalories !== undefined ? { gte: Number(q.minCalories) } : {}), ...(q.maxCalories !== undefined ? { lte: Number(q.maxCalories) } : {}) } } : {}),
  ...(q.minProtein ? { protein: { gte: Number(q.minProtein) } } : {}),
  ...(q.maxCarbs ? { carbs: { lte: Number(q.maxCarbs) } } : {}),
  ...(q.maxFats ? { fats: { lte: Number(q.maxFats) } } : {})
});

const listFoods = async (query) => {
  const cacheKey = `foods:${JSON.stringify(query)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const skip = (page - 1) * limit;
  const where = buildWhere(query);
  const [items, total] = await Promise.all([
    prisma.nutritionFood.findMany({ where, skip, take: limit, orderBy: { foodName: 'asc' } }),
    prisma.nutritionFood.count({ where })
  ]);

  const payload = { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  cache.set(cacheKey, payload, 15000);
  return payload;
};

const getFoodById = (id) => prisma.nutritionFood.findUnique({ where: { id } });

module.exports = { listFoods, getFoodById };

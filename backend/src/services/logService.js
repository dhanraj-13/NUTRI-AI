const prisma = require('../prisma/client');
const AppError = require('../utils/appError');

const buildLogPayload = (food, payload) => ({
  foodId: payload.foodId,
  quantity: payload.quantity,
  mealType: payload.mealType,
  consumedAt: new Date(payload.consumedAt),
  hydrationMl: payload.hydrationMl ?? 0,
  notes: payload.notes,
  totalCalories: food.calories * payload.quantity,
  totalProtein: food.protein * payload.quantity,
  totalCarbs: food.carbs * payload.quantity,
  totalFats: food.fats * payload.quantity
});

const createLog = async (userId, payload) => {
  const food = await prisma.nutritionFood.findUnique({ where: { id: payload.foodId } });
  if (!food) throw new AppError('Food not found', 404);
  return prisma.nutritionLog.create({ data: { userId, ...buildLogPayload(food, payload) }, include: { food: true } });
};

const updateLog = async (userId, id, payload) => {
  const existing = await prisma.nutritionLog.findFirst({ where: { userId, id }, include: { food: true } });
  if (!existing) throw new AppError('Nutrition log not found', 404);

  const food = payload.foodId ? await prisma.nutritionFood.findUnique({ where: { id: payload.foodId } }) : existing.food;
  if (!food) throw new AppError('Food not found', 404);

  const quantity = payload.quantity ?? existing.quantity;

  return prisma.nutritionLog.update({
    where: { id },
    data: {
      foodId: payload.foodId,
      quantity,
      mealType: payload.mealType,
      consumedAt: payload.consumedAt ? new Date(payload.consumedAt) : undefined,
      hydrationMl: payload.hydrationMl,
      notes: payload.notes,
      totalCalories: food.calories * quantity,
      totalProtein: food.protein * quantity,
      totalCarbs: food.carbs * quantity,
      totalFats: food.fats * quantity
    },
    include: { food: true }
  });
};

const deleteLog = async (userId, id) => {
  const row = await prisma.nutritionLog.findFirst({ where: { userId, id } });
  if (!row) throw new AppError('Nutrition log not found', 404);
  await prisma.nutritionLog.delete({ where: { id } });
};

const listLogs = (userId) => prisma.nutritionLog.findMany({ where: { userId }, include: { food: true }, orderBy: { consumedAt: 'desc' } });

module.exports = { createLog, updateLog, deleteLog, listLogs };

const { z } = require('zod');

const nutritionLogSchema = z.object({
  foodId: z.string().min(1),
  quantity: z.coerce.number().positive().max(10),
  mealType: z.string().min(2),
  hydrationMl: z.coerce.number().int().min(0).max(5000).default(0),
  consumedAt: z.string().datetime(),
  notes: z.string().max(500).optional()
});

const updateLogSchema = nutritionLogSchema.partial();

module.exports = { nutritionLogSchema, updateLogSchema };

const { z } = require('zod');

const foodFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  mealType: z.string().optional(),
  dietType: z.string().optional(),
  foodCategory: z.string().optional(),
  minCalories: z.coerce.number().optional(),
  maxCalories: z.coerce.number().optional(),
  minProtein: z.coerce.number().optional(),
  maxCarbs: z.coerce.number().optional(),
  maxFats: z.coerce.number().optional()
});

module.exports = { foodFilterSchema };

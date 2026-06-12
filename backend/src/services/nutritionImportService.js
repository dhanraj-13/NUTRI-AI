const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const prisma = require('../prisma/client');
const AppError = require('../utils/appError');
const config = require('../config/env');

const requiredFields = [
  'food_name','calories','protein','carbs','fats','fiber','serving_size',
  'food_category','meal_type','diet_type','health_benefits','image_path'
];

const mapRow = (row) => ({
  foodName: row.food_name,
  calories: Number(row.calories),
  protein: Number(row.protein),
  carbs: Number(row.carbs),
  fats: Number(row.fats),
  fiber: Number(row.fiber),
  servingSize: row.serving_size,
  foodCategory: row.food_category,
  mealType: row.meal_type,
  dietType: row.diet_type,
  hydrationScore: Number(row.hydration_score ?? 5),
  satietyScore: Number(row.satiety_score ?? 5),
  healthBenefits: row.health_benefits,
  imagePath: row.image_path
});

const validateHeaders = (headers) => {
  const missing = requiredFields.filter((field) => !headers.includes(field));
  if (missing.length) {
    throw new AppError('Invalid CSV structure', 400, { missing, requiredFields });
  }
};

const importNutritionCsv = async (csvPath = config.nutritionCsvWithImages) => {
  if (!fs.existsSync(csvPath)) throw new AppError('CSV file not found', 404, { csvPath });
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parse(text, { columns: true, skip_empty_lines: true, trim: true });
  if (!rows.length) throw new AppError('CSV contains no records', 400);
  validateHeaders(Object.keys(rows[0]));

  let inserted = 0;
  let skipped = 0;
  let invalid = 0;

  for (const row of rows) {
    const payload = mapRow(row);
    if ([payload.calories, payload.protein, payload.carbs, payload.fats, payload.fiber].some(Number.isNaN)) {
      invalid += 1;
      continue;
    }
    const imageAbsolute = path.join(config.datasetRoot, payload.imagePath);
    if (!fs.existsSync(imageAbsolute)) {
      invalid += 1;
      continue;
    }

    const existing = await prisma.nutritionFood.findUnique({ where: { foodName: payload.foodName } });
    if (existing) {
      skipped += 1;
      continue;
    }

    await prisma.nutritionFood.create({ data: payload });
    inserted += 1;
  }

  return { inserted, skipped, invalid, total: rows.length, csvPath };
};

module.exports = { importNutritionCsv };

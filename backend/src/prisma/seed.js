const { importNutritionCsv } = require('../services/nutritionImportService');
const config = require('../config/env');
const prisma = require('./client');

async function main() {
  const result = await importNutritionCsv(config.nutritionCsvWithImages);
  console.log(result);
}

main().finally(async () => prisma.$disconnect());

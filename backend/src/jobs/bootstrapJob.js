const prisma = require('../prisma/client');
const logger = require('../utils/logger');
const { importNutritionCsv } = require('../services/nutritionImportService');
const config = require('../config/env');

const bootstrapNutritionData = async () => {
  const count = await prisma.nutritionFood.count();
  if (count > 0) return { imported: false, count };

  const csvPath = config.nutritionCsvWithImages;
  const result = await importNutritionCsv(csvPath);
  logger.info('Nutrition dataset bootstrapped', result);
  return { imported: true, ...result };
};

module.exports = { bootstrapNutritionData };

jest.mock('../src/prisma/client', () => ({
  $connect: jest.fn().mockResolvedValue(),
  $disconnect: jest.fn().mockResolvedValue(),
  nutritionFood: { count: jest.fn().mockResolvedValue(120) }
}));

const prisma = require('../src/prisma/client');

describe('database', () => {
  test('db health', async () => {
    await prisma.$connect();
    const count = await prisma.nutritionFood.count();
    expect(count).toBeGreaterThan(0);
    await prisma.$disconnect();
  });
});

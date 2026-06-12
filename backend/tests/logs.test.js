const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/prisma/client', () => ({
  nutritionFood: { findUnique: jest.fn() },
  nutritionLog: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
  analytics: { upsert: jest.fn() },
  aiRecommendation: { create: jest.fn() }
}));

const prisma = require('../src/prisma/client');
const app = require('../app');
const token = jwt.sign({ userId: 'u1', email: 'u@u.com' }, process.env.JWT_SECRET || 'development_secret');

describe('nutrition log', () => {
  test('create nutrition log', async () => {
    prisma.nutritionFood.findUnique.mockResolvedValue({ id: 'f1', calories: 100, protein: 5, carbs: 10, fats: 2 });
    prisma.nutritionLog.create.mockResolvedValue({ id: 'l1', consumedAt: new Date().toISOString() });
    prisma.nutritionLog.findMany.mockResolvedValue([]);
    prisma.analytics.upsert.mockResolvedValue({ id: 'a1' });
    prisma.aiRecommendation.create.mockResolvedValue({ id: 'r1' });

    const res = await request(app)
      .post('/nutrition-log')
      .set('Authorization', `Bearer ${token}`)
      .send({ foodId: 'f1', quantity: 1, mealType: 'breakfast', hydrationMl: 250, consumedAt: new Date().toISOString() });

    expect(res.statusCode).toBe(201);
  });
});

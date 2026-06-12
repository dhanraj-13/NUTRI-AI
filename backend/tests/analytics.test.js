const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/prisma/client', () => ({
  analytics: { findMany: jest.fn() }
}));

const prisma = require('../src/prisma/client');
const app = require('../app');
const token = jwt.sign({ userId: 'u1', email: 'u@u.com' }, process.env.JWT_SECRET || 'development_secret');

describe('analytics', () => {
  test('get analytics snapshot', async () => {
    prisma.analytics.findMany.mockResolvedValue([{ id: 'a1', nutritionScore: 80, productivityNutritionScore: 78 }]);
    const res = await request(app).get('/analytics').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

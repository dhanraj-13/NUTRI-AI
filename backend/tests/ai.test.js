const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/prisma/client', () => ({
  nutritionLog: { findMany: jest.fn() },
  nutritionFood: { findMany: jest.fn() },
  aiRecommendation: { create: jest.fn() }
}));

const prisma = require('../src/prisma/client');
const app = require('../app');
const token = jwt.sign({ userId: 'u1', email: 'u@u.com' }, process.env.JWT_SECRET || 'development_secret');

describe('ai', () => {
  test('recommendations empty behavior dataset', async () => {
    prisma.nutritionLog.findMany.mockResolvedValue([]);
    const res = await request(app).get('/recommendations').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});

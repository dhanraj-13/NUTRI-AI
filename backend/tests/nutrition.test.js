const request = require('supertest');

jest.mock('../src/prisma/client', () => ({
  nutritionFood: { findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn() }
}));

const prisma = require('../src/prisma/client');
const app = require('../app');

describe('nutrition foods', () => {
  test('foods search with pagination', async () => {
    prisma.nutritionFood.findMany.mockResolvedValue([{ id: 'f1', foodName: 'Apple' }]);
    prisma.nutritionFood.count.mockResolvedValue(1);
    const res = await request(app).get('/foods?search=apple&page=1&limit=20');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.pagination.total).toBe(1);
  });
});

const request = require('supertest');

jest.mock('../src/prisma/client', () => ({
  user: { findUnique: jest.fn(), create: jest.fn() }
}));

const prisma = require('../src/prisma/client');
const app = require('../app');

describe('auth', () => {
  test('register returns token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'u1', name: 'Alex', email: 'a@a.com', password: '$hash' });
    const res = await request(app).post('/register').send({ name: 'Alex', email: 'a@a.com', password: 'password1' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.token).toBeTruthy();
  });

  test('profile protected', async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(401);
  });
});

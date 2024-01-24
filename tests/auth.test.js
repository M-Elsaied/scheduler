const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

// Load test-specific configurations
require('./config/testConfig');

beforeEach(async () => {
  await User.deleteMany({});
});

beforeEach(async () => {
  await User.deleteMany({});
}, 10000); // Increase the timeout to 10000 milliseconds (10 seconds)


// Disconnect from the test database after all tests
afterAll(() => {
  mongoose.disconnect();
});

describe('User Authentication', () => {
  it('should allow a new user to register', async () => {
    const response = await supertest(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'Patient'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should prevent duplicate registrations', async () => {
    // Register user for the first time
    await supertest(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'Patient'
      });

    // Attempt to register again with same credentials
    const response = await supertest(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'Patient'
      });

    expect(response.status).toBe(400);
    expect(response.body.msg).toContain('User already exists');
  });

  it('should authenticate a registered user', async () => {
    await supertest(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'Patient'
      });

    const response = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should reject login with incorrect credentials', async () => {
    await supertest(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'Patient'
      });

    const response = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongPassword'
      });

    expect(response.status).toBe(400);
    expect(response.body.msg).toContain('Incorrect password');
  });
});

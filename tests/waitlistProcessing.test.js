const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { processWaitlist } = require('../controllers/waitlistController');
const User = require('../models/User');
const Waitlist = require('../models/Waitlist');
const Appointment = require('../models/Appointment');
const jwt = require('jsonwebtoken');

function generateTestJWT(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}

async function createTestUser(role) {
  const user = await User.create({
    username: `${role.toLowerCase()}test`,
    email: `${role.toLowerCase()}test@example.com`,
    password: '123456',
    role: role
  });
  return {
    id: user._id,
    token: generateTestJWT(user._id)
  };
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Appointment.deleteMany({});
  await Waitlist.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Waitlist Processing', () => {
  it('Should create a waitlist entry and have the correct FIFO behavior', async () => {
[OLD CODE: Insert any additional setup or utility functions here]
  });

  it('Should automatically schedule patients from waitlist into vacant slots', async () => {
[OLD CODE: Insert any additional setup or utility functions here]
  });
});

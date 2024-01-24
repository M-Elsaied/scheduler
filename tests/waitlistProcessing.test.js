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
  const randomSuffix = Math.floor(Math.random() * 1000); // Add a random suffix to the username
  const user = await User.create({
    username: `${role.toLowerCase()}test${randomSuffix}`,
    email: `${role.toLowerCase()}test${randomSuffix}@example.com`,
    password: '123456',
    role: role,
  });
  return {
    id: user._id,
    token: generateTestJWT(user._id),
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
  let doctorUser;
  let patientUser1;
  let patientUser2;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    // Create test users (doctor and patients)
    doctorUser = await createTestUser('Doctor');
    patientUser1 = await createTestUser('Patient');
    patientUser2 = await createTestUser('Patient');
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('Should create a waitlist entry and have the correct FIFO behavior', async () => {
    // Create a waitlist entry for the doctor
    const waitlistEntry1 = await Waitlist.create({
      patient: patientUser1.id,
      provider: doctorUser.id,
      service: 'Service Name',
      location: 'Sheraton',
    });

    // Create another waitlist entry for the same doctor
    const waitlistEntry2 = await Waitlist.create({
      patient: patientUser2.id,
      provider: doctorUser.id,
      service: 'Service Name',
      location: 'Sheraton',
    });

    // Perform assertions to check the FIFO behavior
    expect(waitlistEntry1.createdAt).toBeLessThan(waitlistEntry2.createdAt);
  });

  it('Should automatically schedule patients from waitlist into vacant slots', async () => {
    // Simulate vacant appointment slots
    // Insert code to create vacant slots in the Appointment model

    // Create waitlist entries for the doctor
    const waitlistEntry1 = await Waitlist.create({
      patient: patientUser1.id,
      provider: doctorUser.id,
      service: 'Service Name',
      location: 'Sheraton',
    });

    const waitlistEntry2 = await Waitlist.create({
      patient: patientUser2.id,
      provider: doctorUser.id,
      service: 'Service Name',
      location: 'Sheraton',
    });

    // Trigger the waitlist processing function
    await processWaitlist(doctorUser.id); // Replace with the actual function to process waitlist

    // Check if appointments have been scheduled for patients
    const patient1Appointment = await Appointment.findOne({ patient: patientUser1.id });
    const patient2Appointment = await Appointment.findOne({ patient: patientUser2.id });

    expect(patient1Appointment).not.toBeNull();
    expect(patient2Appointment).not.toBeNull();
  });
});

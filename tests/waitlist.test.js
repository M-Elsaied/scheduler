const supertest = require('supertest');
const connectDB = require('../config/database');
const app = require('../app');
const Waitlist = require('../models/Waitlist');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { processWaitlistEntries } = require('../jobs/waitlistProcessor');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let patientToken;
let doctorToken;
let adminToken;
let doctorId;
let patientId;

beforeAll(async () => {
  await connectDB();
  console.log('Connected to the database');

  const adminUser = new User({
    username: 'admin1',
    email: 'admin1@example.com',
    password: 'password',
    role: 'Admin',
  });
  await adminUser.save();
  console.log('Admin user created');

  const patientUser = new User({
    username: 'patient1',
    email: 'patient1@example.com',
    password: 'password',
    role: 'Patient',
  });
  await patientUser.save();
  patientId = patientUser._id;
  console.log('Patient user created');

  const doctorUser = new User({
    username: 'doctor1',
    email: 'doctor1@example.com',
    password: 'password',
    role: 'Doctor',
  });
  await doctorUser.save();
  doctorId = doctorUser._id;
  console.log('Doctor user created');

  patientToken = generateToken(patientUser);
  doctorToken = generateToken(doctorUser);
  adminToken = generateToken(adminUser);
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log('Disconnected from the database');
});

afterEach(async () => {
  await Waitlist.deleteMany({});
  await Appointment.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared collections');
});

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}

describe('Waitlist mechanics tests', () => {
  test('it should create a waitlist entry as an admin', async () => {
    const waitlistEntry = {
      service: 'Check-up',
      location: 'Sheraton',
      patient: patientId,
      provider: doctorId,
    };

    const response = await supertest(app)
      .post('/api/waitlist')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(waitlistEntry);

    console.log('Response:', response.statusCode);

    expect(response.statusCode).toBe(201);
  });

  test('it should process waitlist entries when an appointment slot opens as a doctor', async () => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 30 * 60000);

    await new Appointment({
      provider: doctorId,
      startTime: startTime,
      endTime: endTime,
      service: 'Check-up',
      patient: patientId,
    }).save();

    console.log('Appointment created');

    await processWaitlistEntries();
    console.log('Processed waitlist entries');

    const waitlistEntries = await Waitlist.find({ provider: doctorId, status: 'Processed' });
    console.log('Waitlist entries:', waitlistEntries);

    expect(waitlistEntries.length).toBeGreaterThan(0);
  });

  test('it should automatically schedule patients from waitlist using the cron job as a doctor', async (done) => {
    const waitlistCronJob = require('../jobs/scheduler').waitlistCronJob;
    waitlistCronJob();

    setTimeout(async () => {
      const scheduledAppointmentsCount = await Appointment.find({}).countDocuments();
      console.log('Scheduled appointments count:', scheduledAppointmentsCount);
      expect(scheduledAppointmentsCount).toBeGreaterThan(0);
      done();
    }, 10000); // Increased timeout to 10 seconds
  });
});
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
  const adminUser = new User({
    username: 'admin1',
    email: 'admin1@example.com',
    password: 'password',
    role: 'Admin',
  });
  await adminUser.save();

  const patientUser = new User({
    username: 'patient1',
    email: 'patient1@example.com',
    password: 'password',
    role: 'Patient',
  });
  await patientUser.save();
  patientId = patientUser._id;

  const doctorUser = new User({
    username: 'doctor1',
    email: 'doctor1@example.com',
    password: 'password',
    role: 'Doctor',
  });
  await doctorUser.save();
  doctorId = doctorUser._id;

  patientToken = generateToken(patientUser);
  doctorToken = generateToken(doctorUser);
  adminToken = generateToken(adminUser);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Waitlist.deleteMany({});
  await Appointment.deleteMany({});
  await User.deleteMany({});
});

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}

describe('Waitlist mechanics tests', () => {
  test('it should create a waitlist entry as an admin', async () => {
    const startTime = new Date();

    const waitlistEntry = {
      service: 'Check-up',
      location: 'Sheraton',
      patient: patientId,
      provider: doctorId,
      appointmentTime: startTime, // Include appointment time

    };

    const response = await supertest(app)
      .post('/api/waitlist')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(waitlistEntry);


    expect(response.statusCode).toBe(201);
  });

  test('it should process waitlist entries when an appointment slot opens as a doctor', async () => {
    // Step 1: Create waitlist entries that match the criteria
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 30 * 60000);

    // Create a waitlist entry with the appointment time
    const waitlistEntry1 = new Waitlist({
      service: 'Check-up',
      location: 'Sheraton',
      patient: patientId,
      provider: doctorId,
      status: 'Pending',
      appointmentTime: startTime, // Include appointment time
    });
    await waitlistEntry1.save();

    // Step 2: Simulate the opening of an appointment slot
    const appointment = new Appointment({
      provider: doctorId,
      startTime: startTime,
      endTime: endTime,
      service: 'Check-up',
      patient: patientId, // Ensure it's available
      location: 'Sheraton',
    });
    await appointment.save();

    // Step 3: Trigger the processing of waitlist entries
    await processWaitlistEntries();

    // Step 4: Check if waitlist entries have been processed and assigned
    const processedWaitlistEntries = await Waitlist.find({
      provider: doctorId,
      status: 'Processed',
    });

    // Assertions
    expect(processedWaitlistEntries.length).toBe(1); // There should be one processed entry
    expect(processedWaitlistEntries[0].status).toBe('Processed');
    expect(processedWaitlistEntries[0].appointmentTime).toBe(startTime); // Ensure appointment time matches
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
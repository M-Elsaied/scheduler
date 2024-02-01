const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

require('./config/testConfig');

async function createUser(role) {
  const randomSuffix = Math.floor(Math.random() * 100000); // Add a random suffix to the username
  return await User.create({
    username: `${role.toLowerCase()}test1${randomSuffix}`,
    email: `${role.toLowerCase()}test1${randomSuffix}@scheduler.com`,
    password: '123456',
    role: role
  });
}

async function createAppointment(patient, provider, startTime, endTime, service, location) {
  return await Appointment.create({
    patient,
    provider,
    startTime,
    endTime,
    service,
    location
  });
}



const secret = process.env.JWT_SECRET;
const payload = { role: 'Super Admin' };

// Generate the token
// const superAdminToken = jwt.sign(payload, secret);
// const superAdminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjdjY2UzMjdlZWMxZTBlMGQxZTQ1OCIsImlhdCI6MTcwNjU0NDk3OCwiZXhwIjoxNzA2NjMxMzc4fQ.EDILyh2b9C2wOxD_PzVYwFFAkNvQgYwrW8tfTkojvbM'

// // Verify the token
// jwt.verify(superAdminToken, secret, (err, decoded) => {
//   if (err) {
//     console.error('Token verification failed:', err);
//   } else {
//     console.log('Token is valid. Decoded payload:', decoded);
//   }
// });

let superAdminToken;
let superAdminId;

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const superAdminUser = await createUser('Super Admin');
  await superAdminUser.save();
  superAdminId = superAdminUser._id;
  superAdminToken = generateToken(superAdminUser)
});

beforeEach(async () => {
  await Appointment.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Appointment Search', () => {
  it('should retrieve all appointments when no filters are applied', async () => {
    const patient = await createUser('Patient');
    const provider = await createUser('Doctor');
    await createAppointment(patient._id, provider._id, new Date(), new Date(), 'Checkup', 'Sheraton');

    const response = await supertest(app)
      .get('/api/appointments/search')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .catch((error) => {
        console.error('Error during the HTTP request:', error);
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should retrieve appointments filtered by location', async () => {
    const patient = await createUser('Patient');
    const provider = await createUser('Doctor');
    const otherProvider = await createUser('Doctor');
    await createAppointment(patient._id, provider._id, new Date(), new Date(), 'Checkup', 'Sheraton');
    await createAppointment(patient._id, otherProvider._id, new Date(), new Date(), 'Consultation', 'Sheraton');

    const response = await supertest(app)
      .get('/api/appointments/search?location=Sheraton')
      .set('Authorization', `Bearer ${superAdminToken}`);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        location: 'Sheraton'
      })
    ]));
  });

  it('should retrieve appointments filtered by provider', async () => {
    const patient = await createUser('Patient');
    const provider = await createUser('Doctor');
    const otherProvider = await createUser('Doctor');
    const otherPatient = await createUser('Patient');
    await createAppointment(patient._id, provider._id, new Date(), new Date(), 'Checkup', 'Downtown Clinic');
    await createAppointment(otherPatient._id, otherProvider._id, new Date(), new Date(), 'Consultation', 'Sheraton');

    const response = await supertest(app)
      .get(`/api/appointments/search?provider=${provider._id}`)
      .set('Authorization', `Bearer ${superAdminToken}`);
    // Simplified expectation to check if the response contains the expected provider _id
    expect(response.body[0].provider._id.toString()).toEqual(provider._id.toString());
  });


  it('should retrieve appointments filtered by service', async () => {
    const patient = await createUser('Patient');
    const provider = await createUser('Doctor');
    const otherService = 'Surgery';
    await createAppointment(patient._id, provider._id, new Date(), new Date(), 'Checkup', 'Downtown Clinic');
    await createAppointment(patient._id, provider._id, new Date(), new Date(), otherService, 'Sheraton');

    const response = await supertest(app)
      .get(`/api/appointments/search?service=${otherService}`)
      .set('Authorization', `Bearer ${superAdminToken}`);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        service: otherService
      })
    ]));
  });

  it('should retrieve appointments filtered by date range', async () => {
    const patient = await createUser('Patient');
    const provider = await createUser('Doctor');
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (60 * 60 * 1000)); // Plus 1 hour
    const otherPatient = await createUser('Patient');
    const pastStartTime = new Date(startTime.getTime() - (24 * 60 * 60 * 1000)); // Minus 1 day
    const pastEndTime = new Date(endTime.getTime() - (24 * 60 * 60 * 1000)); // Minus 1 day
    await createAppointment(patient._id, provider._id, startTime, endTime, 'Checkup', 'Downtown Clinic');
    await createAppointment(otherPatient._id, provider._id, pastStartTime, pastEndTime, 'Consultation', 'Sheraton');

    const response = await supertest(app)
      .get(`/api/appointments/search?start=${pastStartTime.toISOString()}&end=${endTime.toISOString()}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    // Check if the response contains the appointment with startTime >= pastStartTime
    const matchingAppointment = response.body.find(appointment => new Date(appointment.startTime) >= pastStartTime);

    expect(matchingAppointment).toBeDefined();
  });
});
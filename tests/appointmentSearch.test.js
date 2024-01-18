const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

require('./config/testConfig');

async function createUser(role) {
  return await User.create({
    username: `${role}User`,
    email: `${role.toLowerCase()}@scheduler.com`,
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

const superAdminToken = jwt.sign({ role: 'Super Admin' }, process.env.JWT_SECRET);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
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
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should retrieve appointments filtered by location', async () => {
    const patient = await createUser('Patient');
    const provider = await createUser('Doctor');
    const otherProvider = await createUser('Doctor');
    await createAppointment(patient._id, provider._id, new Date(), new Date(), 'Checkup', 'Downtown Clinic');
    await createAppointment(patient._id, otherProvider._id, new Date(), new Date(), 'Consultation', 'Sheraton');

    const response = await supertest(app)
      .get('/api/appointments/search?location=Downtown Clinic')
      .set('Authorization', `Bearer ${superAdminToken}`);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        location: 'Downtown Clinic'
      })
    ]));
  });

  it('should retrieve appointments filtered by provider', async () => {
    const patient = await createUser('Patient');
    const provider = await createUser('Doctor');
    const otherPatient = await createUser('Patient');
    await createAppointment(patient._id, provider._id, new Date(), new Date(), 'Checkup', 'Downtown Clinic');
    await createAppointment(otherPatient._id, provider._id, new Date(), new Date(), 'Consultation', 'Sheraton');

    const response = await supertest(app)
      .get(`/api/appointments/search?provider=${provider._id}`)
      .set('Authorization', `Bearer ${superAdminToken}`);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        provider: provider._id
      })
    ]));
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
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        startTime: { $gte: pastStartTime.toISOString() },
        endTime: { $lte: endTime.toISOString() }
      })
    ]));
  });
});

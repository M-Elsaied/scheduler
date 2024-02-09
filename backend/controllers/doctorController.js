const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const doctorService = require('../services/doctorService');

const createDoctor = catchAsync(async(req, res) => {
    
    const doctor = await doctorService.createDoctor(req.body);
    res.status(httpStatus.CREATED).send(doctor);
})

const getDoctors = catchAsync(async(req, res) => {
    const doctors = await doctorService.queryDoctors();
    res.send(doctors)
})

const updateDoctors = catchAsync(async(req, res) => {
    const doctor = await doctorService.updateDoctorById(doctorId,req.body);
    res.send(doctor)
})

const deleteDoctors = catchAsync(async(req, res) => {
    const doctor = await doctorService.deleteDoctorById(req.params.doctorId)
    res.status(httpStatus.NO_CONTENT).send(doctor)
})

module.exports = {
    createDoctor, 
    getDoctors, 
    updateDoctors,
    deleteDoctors
};


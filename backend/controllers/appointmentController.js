const { sendEmail, sendWhatsAppMessage } = require('../utils/notifications');
const waitlistController = require('./waitlistController');
const { checkRole } = require('../middleware/auth');
const { waitlistService, userService, doctorService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const appointmentService = require('../services/appointmentService');
const { SubscribedTrackListInstance } = require('twilio/lib/rest/video/v1/room/participant/subscribedTrack');



// const patient = await User.findById(patientId);
// const doctor = await doctorService.findById(doctorId)
// // const doctor = await User.findById(providerBody);

// const message = `Dear ${patient.firstname}, your appointment with ${doctor.username} at ${req.body.startTime} has been booked.`;

// sendEmail(patient.email, 'Appointment Booked', message);
// sendWhatsAppMessage(patient.phone, message);

// await waitlistService.processWaitlist(
//     doctor,
//     startTime,
//     endTime,
//     location
// )

// AppointmentController, authController, locationcontroller,

// const createWaitlist = catchAsync(async(req, res) => {
//   const waitlist = await waitlistService.createWaitlistEntry(req.body);
//   res.status(httpStatus.CREATED).send(waitlist);
// })

const createAppointment = catchAsync(async (req, res) => {
  console.log(req.body.doctorId)
  // patientid, doctorid,service,time,location,status
  try {
    // const patient = await User.findById(req.bodypatientId);
    console.log('next hit herrs')
    const patient = await userService.getOneUser(req.body.patientId)
    console.log(patient)

    // console.log(typeof(patient), patient._id, 'see typeof')
    // returnDocUser
    const doctor = await doctorService.returnDocUser(req.body.doctorId)
    console.log(doctor, 'see doctor')
    // const doctor = await User.findById(providerBody);
    // console.log(typeof(doctor), doctor.userId.firstname, 'see doctor,reur')
    const service = req.body.service
    const time = req.body.time

    const message = `Dear ${patient.firstname}, your appointment with Dr. ${doctor.userId.firstname} at ${req.body.time} has been booked.`;
    console.log(message)

    console.log(patient.phone, 'see phone details')

    const email = await sendEmail(patient.email, 'Appointment Booked', message);
    // console.log(emails, 'see emails')
    // console.log(patient.phone, 'see phone no')
    const whatsapp = await sendWhatsAppMessage(patient.phone, message);
    // console.log(whatsapp, 'see whatsapp logs')
    const capp = await appointmentService.createAppointment(patient._id, doctor._id, service, time)
    // console.log(capp, 'see caps')
    res.status(201).json({status: 'Success', capp});

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

const getAppointments = catchAsync(async(req, res) => {
  const appointments = await appointmentService.queryAppointments()
  res.send(appointments)
})

// const createWaitlist = catchAsync(async(req, res) => {
//   const waitlist = await waitlistService.createWaitlistEntry(req.body);
//   res.status(httpStatus.CREATED).send(waitlist);
// })

const updateAppointment = catchAsync(async(req, res) => {
  // const { id } = req.params;
  try {
    // const appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    //   new: true,
    // });
    const patient = await User.findById(req.body.patient);
    const provider = await User.findById(req.body.provider);
    const message = `Dear ${patient.username}, your appointment with ${provider.username} has been updated to start at ${req.body.startTime}.`;
    sendEmail(patient.email, 'Appointment Updated', message);
    sendWhatsAppMessage(patient.phone, message);

    const appointment = await appointmentService.updateAppointmentById()

    // const appointment = await 
    // res.json(appointment);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

})

// exports.updateAppointment = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const appointment = await Appointment.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     const patient = await User.findById(req.body.patient);
//     const provider = await User.findById(req.body.provider);
//     const message = `Dear ${patient.username}, your appointment with ${provider.username} has been updated to start at ${req.body.startTime}.`;
//     sendEmail(patient.email, 'Appointment Updated', message);
//     sendWhatsAppMessage(patient.phone, message);
//     res.json(appointment);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id).populate(
      'patient provider'
    );
    await Appointment.findByIdAndDelete(id);
    const message = `Dear ${appointment.patient.username}, your appointment with ${appointment.provider.username} scheduled for ${appointment.startTime} has been cancelled.`;
    sendEmail(appointment.patient.email, 'Appointment Cancelled', message);
    sendWhatsAppMessage(appointment.patient.phone, message);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// exports.searchAppointments = async (req, res) => {
//   const { location, provider, service, startDate, endDate } = req.query;

//   try {
//     const query = {};

//     if (location) {
//       query.location = location;
//     }

//     if (provider) {
//       query.provider = provider;
//     }

//     if (service) {
//       query.service = new RegExp(service, 'i');
//     }

//     if (startDate || endDate) {
//       query.startTime = {};

//       if (startDate) {
//         query.startTime.$gte = new Date(startDate);
//       }

//       if (endDate) {
//         query.startTime.$lte = new Date(endDate);
//       }
//     }

//     const appointments = await Appointment.find(query)
//       .populate('patient provider')
//       .exec();

//     res.status(200).json(appointments);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

module.exports = {
  createAppointment,
  getAppointments

}

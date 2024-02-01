const allRoles = {
    patient: [],
    doctor: [],
    staff: [],
    admin: ['getUsers', 'manageUsers'],
    superAdmin: ['getUsers', 'manageUsers', 'addService'],
  };
  
  const roles = Object.keys(allRoles);
  const roleRights = new Map(Object.entries(allRoles));
  
  module.exports = {
    roles,
    roleRights,
  };

  
//   Super Admin, Admin, Staff, Doctor, Patient

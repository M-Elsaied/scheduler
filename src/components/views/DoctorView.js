import React from 'react';
import Calendar from '../common/Calendar';

const DoctorView = ({ user }) => ( // INPUT_REQUIRED {Replace with actual user data retrieval logic}
  <div>
    <h1>Doctor Dashboard</h1>
    <Calendar user={user} />
  </div>
);

export default DoctorView;

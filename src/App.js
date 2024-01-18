import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminView from './components/views/AdminView';
import SuperAdminView from './components/views/SuperAdminView';
import DoctorView from './components/views/DoctorView';
import StaffView from './components/views/StaffView';
import PatientView from './components/views/PatientView';
import Login from './components/auth/Login'; // INPUT_REQUIRED {Import actual Login component}
import Unauthorized from './components/Unauthorized'; // INPUT_REQUIRED {Import actual Unauthorized component}

const App = () => (
  <Layout>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute
        path="/admin"
        roles={['Admin']} 
        component={AdminView} 
      />
      <ProtectedRoute
        path="/super-admin"
        roles={['Super Admin']} 
        component={SuperAdminView} 
      />
      <ProtectedRoute
        path="/doctor"
        roles={['Doctor']} 
        component={DoctorView} 
      />
      <ProtectedRoute
        path="/staff"
        roles={['Staff']} 
        component={StaffView} 
      />
      <ProtectedRoute
        path="/patient"
        roles={['Patient']} 
        component={PatientView} 
      />
      <Route path="/unauthorized" component={Unauthorized} />
    </Switch>
  </Layout>
);

export default App;

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const auth = useSelector(state => state.auth);

  return (
    <Route {...rest} render={props => {
      if (!auth.isAuthenticated) {
        return <Redirect to="/login" />;
      }

      if (!roles.includes(auth.user.role)) {
        return <Redirect to="/unauthorized" />;
      }

      return <Component {...props} />;
    }} />
  );
};

export default ProtectedRoute;

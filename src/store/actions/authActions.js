import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

export const login = (userData) => dispatch => {
  axios.post('/api/auth/login', userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      dispatch(setCurrentUser(res.data.user));
    })
    .catch(err => {
      console.error(err);
    });
};

export const setCurrentUser = decoded => {
  return {
    type: 'SET_CURRENT_USER',
    payload: decoded
  };
};

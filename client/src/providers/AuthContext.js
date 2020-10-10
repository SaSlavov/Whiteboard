import { createContext } from 'react';
import jwtDecode from 'jwt-decode';

export const extractUser = token => {
  try {
    return jwtDecode(localStorage.getItem('token') || '');
  } catch (e) {
    localStorage.removeItem('token');
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  setLoginState: () => { },
});

export default AuthContext;

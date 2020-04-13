import { AUTH_ACTIONS } from '../types/authTypes';

export const setToken = item => ({
  type: AUTH_ACTIONS.SET_TOKEN,
  item,
});

export const setUser = item => ({
  type: AUTH_ACTIONS.SET_USER,
  item,
});

export const logoutRedux = item => ({
  type: AUTH_ACTIONS.LOGOUT,
  item,
});

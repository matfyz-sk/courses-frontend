import { NAV_ACTIONS } from '../types/navigationTypes';

export const setMainNav = item => ({
  type: NAV_ACTIONS.SET_MAIN,
  item,
});

export const setSubNav = item => ({
  type: NAV_ACTIONS.SET_SUB,
  item,
});

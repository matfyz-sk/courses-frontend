import { SET_USER_ADMIN } from '../types';

export const setUserAdmin = (isAdmin) => {
   return (dispatch) => {
     dispatch({ type: SET_USER_ADMIN, isAdmin });
   };
};

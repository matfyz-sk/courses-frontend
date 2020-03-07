import { SET_USER_ADMIN, SET_SIGNED_IN } from '../types';

export const setUserAdmin = (isAdmin) => {
   return (dispatch) => {
     dispatch({ type: SET_USER_ADMIN, isAdmin });
   };
};

export const setSignedInUser = (isSignedIn) => {
    return (dispatch) => {
        dispatch({ type: SET_SIGNED_IN, isSignedIn });
    };
};

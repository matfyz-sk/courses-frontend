import { SET_ASSIGNMENT } from '../../types';
import { getResponseBody, getShortID, axiosGetEntities } from '../../../helperFunctions';

export const assignmentsLoadAssignment = () => {
   return (dispatch) => {
       dispatch({ type: SET_ASSIGNMENT, assignment:{} });
   };
};

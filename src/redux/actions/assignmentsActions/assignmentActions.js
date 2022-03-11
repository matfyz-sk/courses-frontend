import { SET_ASSIGNMENT } from '../../types';

export const assignmentsLoadAssignment = () => {
  return (dispatch) => {
    dispatch({type: SET_ASSIGNMENT, assignment: {}});
  };
};

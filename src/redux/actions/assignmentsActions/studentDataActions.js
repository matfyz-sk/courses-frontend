import { EMPTY_ASIGNMENTS_STUDENT_TEAMS, SET_ASIGNMENTS_STUDENT_TEAMS } from '../../types';
import { axiosGetEntities, getResponseBody, getShortID } from '../../../helperFunctions';

export const assignmentsGetStudentTeams = (studentFullID, courseInstance) => {
  return (dispatch) => {
    axiosGetEntities(`teamInstance?hasUser=${ getShortID(studentFullID) }&approved=true&_join=instanceOf`).then((response) => {
      let teams = getResponseBody(response).map((teamInstance) => teamInstance.instanceOf[0]);
      teams = teams.filter((team) => team.courseInstance === courseInstance);
      dispatch({type: SET_ASIGNMENTS_STUDENT_TEAMS, teams});
    })
  };
};

export const assignmentsEmptyStudentTeams = () => {
  return (dispatch) => {
    dispatch({type: EMPTY_ASIGNMENTS_STUDENT_TEAMS});
  };
};

import { SET_ASIGNMENTS_STUDENT_TEAMS, EMPTY_ASIGNMENTS_STUDENT_TEAMS } from '../../types';
import { getResponseBody, getShortID, axiosGetEntities } from '../../../helperFunctions';

export const assignmentsGetStudentTeams = (studentFullID, courseInstance) => {
   return (dispatch) => {
     axiosGetEntities(`teamInstance?hasUser=${getShortID(studentFullID)}&approved=true&_join=team`).then((response)=>{
       let teams = getResponseBody(response).map((teamInstance) => teamInstance.team[0] );
       teams = teams.filter((team)=> team.courseInstance === courseInstance );
       dispatch({ type: SET_ASIGNMENTS_STUDENT_TEAMS, teams });
     })
   };
};

export const assignmentsEmptyStudentTeams = () => {
   return (dispatch) => {
       dispatch({ type: EMPTY_ASIGNMENTS_STUDENT_TEAMS });
   };
};

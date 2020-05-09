import {SET_ASIGNMENTS_STUDENT_TEAMS} from '../../types';
import { getResponseBody, getShortID, axiosGetEntities } from '../../../helperFunctions';

export const assignmentsGetStudentTeams = (studentFullID, courseInstance) => {
   return (dispatch) => {
     axiosGetEntities(`teamInstance?hasUser=${getShortID(studentFullID)}&approved=true&_join=ofInstance`).then((response)=>{
       let teams = getResponseBody(response).map((teamInstance) => teamInstance.ofInstance );
       teams = teams.filter((team)=> team.courseInstance[0] === courseInstance );
       dispatch({ type: SET_ASIGNMENTS_STUDENT_TEAMS, teams });
     })
   };
};

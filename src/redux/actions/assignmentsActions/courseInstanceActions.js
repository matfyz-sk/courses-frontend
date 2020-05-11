import {SET_ASIGNMENTS_COURSE_INSTANCE, SET_ASIGNMENTS_COURSE_INSTANCE_LOADING} from '../../types';
import { getResponseBody, axiosGetEntities } from '../../../helperFunctions';

export const assignmentsGetCourseInstance = (courseInstanceID) => {
   return (dispatch) => {
     dispatch({ type: SET_ASIGNMENTS_COURSE_INSTANCE_LOADING });
     axiosGetEntities(`courseInstance/${courseInstanceID}`).then((response)=>{
       if(response.failed){
         console.log('Cant find course instance');
         return;
       }
       dispatch({ type: SET_ASIGNMENTS_COURSE_INSTANCE, courseInstance: getResponseBody(response)[0] });
     })
   };
};

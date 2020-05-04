import {axiosRequest} from '../../helperFunctions';
import REST_URL from '../../configuration/api';

export const addAssignment = (newAssignment, courseInstanceID) => {
  return;
  return axiosRequest(
    'post',
    `${REST_URL}/assignment`,
    newAssignment
  )
}


/*
addCourse() {
  this.addCourseInstance();
  return;
  axiosRequest(
    'post',
    `${BACKEND_URL}/data/course`,
    {
      name:'Assignments test course',
      description: 'I test assignments here',
      abbreviation: 'AS',
      hasPrerequisite:[],
      hasAdmin:["http://www.courses.matfyz.sk/data/user/OkL1d"]
    }
  )
}

addCourseInstance() {
  axiosRequest(
    'post',
    `${BACKEND_URL}/data/CourseInstance`,
    {
      description:'Testing assignments here',
      endDate: "2020-07-09T23:00:00.000Z",
      hasInstructor: ["http://www.courses.matfyz.sk/data/user/OkL1d"],
      instanceOf: "http://www.courses.matfyz.sk/data/course/LpYwo",
      mentions:[],
      name: 'I test assignments here 1',
      reccomends:[],
      startDate: "2020-02-21T23:00:00.000Z",
      uses:[]
    }
  )
}
*/

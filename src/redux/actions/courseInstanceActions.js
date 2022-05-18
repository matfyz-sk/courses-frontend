import {
  SET_COURSE_INSTANCE,
  CLEAR_COURSE_INSTANCE,
  RESULTS_ADD_GRADING,
  RESULTS_UPDATE_GRADING,
  RESULTS_REMOVE_GRADING,
  RESULTS_ADD_TYPE,
  RESULTS_UPDATE_TYPE,
  RESULTS_REMOVE_TYPE,
} from '../types'
import { authHeader, getUser, getUserID } from '../../components/Auth'
import { BASE_URL, COURSE_URL, COURSE_INSTANCE_URL } from '../../pages/core/constants'
import { NOT_FOUND } from '../../constants/routes'
import { getShortID } from '../../helperFunctions'
import {
  setCourseInstanceInstructor,
  setCourseInstancePrivileges,
} from './privilegesActions'

export const setCourseInstance = item => ({
  type: SET_COURSE_INSTANCE,
  item,
})

export const clearCourseInstance = () => ({
  type: CLEAR_COURSE_INSTANCE,
})

export const fetchCourseInstance = (history, courseInstanceId) => {
  const header = authHeader()
  return async dispatch => {
    const response = await fetch(
      `${BASE_URL}${COURSE_INSTANCE_URL}/${courseInstanceId}?_join=instanceOf,covers,hasInstructor,hasGrading,hasResultType,hasPersonalSettings`,
      {
        method: 'GET',
        headers: header,
        mode: 'cors',
        credentials: 'omit',
      }
    );
    if (!response.ok) throw new Error(response);
    const data = await response.json();
    if (data['@graph'].length > 0) {
      const courseInstance = data['@graph'][0];
      const courseId = getShortID(courseInstance.instanceOf[0]['@id']);
      console.log(courseInstance, courseId);
      const courseResponse = await fetch(
        `${BASE_URL}${COURSE_URL}/${courseId}?_join=covers,mentions`,
        {
          method: 'GET',
          headers: header,
          mode: 'cors',
          credentials: 'omit',
        }
      );
      courseInstance.instanceOf = !courseResponse.ok ?
        courseInstance.instanceOf :
        await (async () => {
          const courseData = (await courseResponse.json())['@graph'];
          if (courseData.length > 0) {
            return courseData;
          }
        })()
      console.log(courseInstance);
      dispatch(setCourseInstance(courseInstance))
      let hasPrivilege = false
      if (getUser() && courseInstance.hasInstructor) {
        for (let i = 0; i < courseInstance.hasInstructor.length; i++) {
          if (getShortID(courseInstance.hasInstructor[i]['@id']) === getUserID()) {
            dispatch(setCourseInstanceInstructor())
            hasPrivilege = true
          }
        }
      }
      if (!hasPrivilege) {
        dispatch(setCourseInstancePrivileges({ course_id }))
      }
    } else {
      history.push(NOT_FOUND)
    }
  }
}

// results

export const addCourseInstanceGrading = item => ({
  type: RESULTS_ADD_GRADING,
  item,
})

export const updateCourseInstanceGrading = item => ({
  type: RESULTS_UPDATE_GRADING,
  item,
})

export const removeCourseInstanceGrading = item => ({
  type: RESULTS_REMOVE_GRADING,
  item,
})

export const addCourseInstanceResultType = item => ({
  type: RESULTS_ADD_TYPE,
  item,
})

export const updateCourseInstanceResultType = item => ({
  type: RESULTS_UPDATE_TYPE,
  item,
})

export const removeCourseInstanceResultType = item => ({
  type: RESULTS_REMOVE_TYPE,
  item,
})

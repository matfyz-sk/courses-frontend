import axios from 'axios'
import { SET_COURSES, SET_COURSE } from '../types'
import apiConfig from '../../configuration/api'

export const fetchCourseInstances = token => {
  return dispatch => {
    return axios
      .get(`${apiConfig.API_URL}/courseInstance?_join=instanceOf`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({ data }) => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const courses = data['@graph'].map(courseInstance => {
            return {
              fullId: courseInstance['@id'],
              id: courseInstance['@id'].substring(
                courseInstance['@id'].length - 5
              ),
              year: courseInstance.year,
              name: courseInstance.instanceOf[0].name,
              abbreviation: courseInstance.instanceOf[0].abbreviation,
              description: courseInstance.instanceOf[0].description,
              courseId: courseInstance.instanceOf[0]['@id'].substring(
                courseInstance['@id'].length - 5
              ),
              startDate: courseInstance.startDate,
              endDate: courseInstance.endDate,
            }
          })
          dispatch({ type: SET_COURSES, courses })
        }
      })
      .catch(error => console.log(error))
  }
}

export const fetchCourseInstance = (token, courseId) => {
  return dispatch => {
    return axios
      .get(`${apiConfig.API_URL}/course/${courseId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({ data }) => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const courses = data['@graph'].map(courseInstance => {
            return {
              id: courseInstance['@id'],
              year: courseInstance.year,
              name: courseInstance.instanceOf[0].name,
              abbreviation: courseInstance.instanceOf[0].abbreviation,
              description: courseInstance.instanceOf[0].description,
              courseId: courseInstance.instanceOf[0]['@id'],
              startDate: courseInstance.startDate,
              endDate: courseInstance.endDate,
            }
          })
          dispatch({ type: SET_COURSES, courses })
        }
      })
      .catch(error => console.log(error))
  }
}

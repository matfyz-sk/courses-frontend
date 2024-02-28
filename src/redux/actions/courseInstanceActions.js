import {
  SET_COURSE_INSTANCE,
  CLEAR_COURSE_INSTANCE,
  RESULTS_ADD_GRADING,
  RESULTS_UPDATE_GRADING,
  RESULTS_REMOVE_GRADING,
  RESULTS_ADD_TYPE,
  RESULTS_UPDATE_TYPE,
  RESULTS_REMOVE_TYPE,
  SET_FILE_EXPLORER_ROOT,
} from '../types'
import { authHeader, getUser, getUserID } from '../../components/Auth'
import { BASE_URL, COURSE_INSTANCE_URL } from '../../pages/core/constants'
import { NOT_FOUND } from '../../constants/routes'
import { getShortID } from '../../helperFunctions'
import {
  setCourseInstanceInstructor,
  setCourseInstancePrivileges,
} from './privilegesActions'
import { initializeFileSystem } from '../../pages/documents/common/functions/initializeFileSystem'

export const setFileExplorerRoot = item => ({
  type: SET_FILE_EXPLORER_ROOT,
  item,
})

export const setCourseInstance = item => ({
  type: SET_COURSE_INSTANCE,
  item,
})

export const clearCourseInstance = () => ({
  type: CLEAR_COURSE_INSTANCE,
})

export const fetchCourseInstance = (history, course_id, getCourseInstance) => {
  return dispatch => {
    getCourseInstance({ id: course_id })
      .unwrap()
      .then(data => {
        if (data && data.length > 0) {
          const course = data[0]
          dispatch(setCourseInstance(course))

          // special case where the already created courses haven't got a root folder at their creation
          if (course.fileExplorerRoot && course.fileExplorerRoot.length === 0) {
            const createRootFolder = async () =>
              dispatch(
                setFileExplorerRoot(await initializeFileSystem(course['_id']))
              )
            createRootFolder()
          }

        let hasPrivilege = false
        if (getUser() && course.hasInstructor) {
          for (let i = 0; i < course.hasInstructor.length; i++) {
            if (course.hasInstructor[i]['_id'] === getUserID()) {
              dispatch(setCourseInstanceInstructor())
              hasPrivilege = true
            }
          }
        }
        if (!hasPrivilege) {
          dispatch(setCourseInstancePrivileges({ course_id: getShortID(course_id) }))
        }
      } else {
        history.push(NOT_FOUND)
      }
    })
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

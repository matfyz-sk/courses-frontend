import { PRIV_ACTIONS } from '../types'
import { getUserInCourseType } from '../../components/Auth'

const initialState = {
  inGlobal: 'student',
  inCourseInstance: 'visitor',
}

export default function privilegesReducer(state = initialState, action) {
  switch (action.type) {
    case PRIV_ACTIONS.SET_GLOBAL_PRIV:
      return {
        ...state,
        inGlobal: action.item,
      }
    case PRIV_ACTIONS.SET_COURSE_INSTANCE_PRIV:
      return {
        ...state,
        inCourseInstance: getUserInCourseType(action.item.course_id),
      }
    case PRIV_ACTIONS.SET_CI_INSTRUCTOR:
      return {
        ...state,
        inCourseInstance: 'instructor',
      }
    default:
      return state
  }
}

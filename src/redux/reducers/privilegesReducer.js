import { PRIV_ACTIONS } from '../types/privilegesTypes'
import { getUserInCourseType } from '../../components/Auth'

const initialState = {
  inGlobal: 'student',
  inCourseInstance: 'visitor',
}

export default function privilegesReducer(state = initialState, action) {
  switch (action.type) {
    case PRIV_ACTIONS.SET_MAIN:
      return {
        ...state,
        inGlobal: action.item.value,
      }
    case PRIV_ACTIONS.SET_COURSE_INSTANCE:
      return {
        ...state,
        inCourseInstance: getUserInCourseType(action.item.course_id),
      }
    default:
      return state
  }
}

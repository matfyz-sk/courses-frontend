import { PRIV_ACTIONS } from '../types/privilegesTypes'
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
    default:
      return state
  }
}

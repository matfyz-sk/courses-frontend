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

const initialState = {
  courseInstance: null,
}

export default function courseInstanceReducer(state = initialState, action) {
  const ci = state.courseInstance
  switch (action.type) {
    case SET_COURSE_INSTANCE:
      return {
        ...state,
        courseInstance: action.item,
      }
    case CLEAR_COURSE_INSTANCE:
      return {
        ...state,
        courseInstance: null,
      }
    case RESULTS_ADD_GRADING:
      if (ci && ci.hasGrading) {
        ci.hasGrading.push(action.item)
      }
      return {
        ...state,
        courseInstance: ci,
      }
    case RESULTS_UPDATE_GRADING:
      if (ci && ci.hasGrading) {
        for (let i = 0; i < ci.hasGrading.length; i++) {
          if (ci.hasGrading[i]['@id'] === action.item['@id']) {
            ci.hasGrading[i] = action.item
          }
        }
      }
      return {
        ...state,
        courseInstance: ci,
      }
    case RESULTS_REMOVE_GRADING:
      if (ci && ci.hasGrading) {
        let newArray = [...ci.hasGrading]
        for (let i = 0; i < ci.hasGrading.length; i++) {
          if (ci.hasGrading[i]['@id'] === action.item['@id']) {
            newArray.splice(i, 1)
            break
          }
        }
        ci.hasGrading = newArray
      }
    case RESULTS_ADD_TYPE:
      if (ci && ci.hasResultType) {
        ci.hasResultType.push(action.item)
      }
      return {
        ...state,
        courseInstance: ci,
      }
    case RESULTS_UPDATE_TYPE:
      if (ci && ci.hasResultType) {
        for (let i = 0; i < ci.hasResultType.length; i++) {
          if (ci.hasResultType[i]['@id'] === action.item['@id']) {
            ci.hasResultType[i] = action.item
          }
        }
      }
      return {
        ...state,
        courseInstance: ci,
      }
    case RESULTS_REMOVE_TYPE:
      if (ci && ci.hasResultType) {
        let newArray = [...ci.hasResultType]
        for (let i = 0; i < ci.hasResultType.length; i++) {
          if (ci.hasResultType[i]['@id'] === action.item['@id']) {
            newArray.splice(i, 1)
            break
          }
        }
        ci.hasResultType = newArray
      }
      return {
        ...state,
        courseInstance: ci,
      }
    default:
      return state
  }
}

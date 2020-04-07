import { SET_COURSE_INSTANCE_DATA } from '../../types'

const initialState = {
  courseInstance: null,
  pending: false,
  error: null,
}

export default function courseInstanceReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COURSE_INSTANCE_DATA: {
      return {
        ...state,
        courseInstance: action.data['@graph'][0],
        courseInstanceLoaded: true,
      }
    }
    default: {
      return state
    }
  }
}

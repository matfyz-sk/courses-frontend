import { SET_ASIGNMENTS_COURSE_INSTANCE, SET_ASIGNMENTS_COURSE_INSTANCE_LOADING } from '../../types'

const initialState = {
  courseInstance:null,
  courseInstanceLoaded: false,
  courseInstanceLoading: false,
};

export default function assignmentscourseInstanceReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ASIGNMENTS_COURSE_INSTANCE:{
      return {
        ...state,
        courseInstance: action.courseInstance,
        courseInstanceLoaded: true,
        courseInstanceLoading: false,
      };
    }
    case SET_ASIGNMENTS_COURSE_INSTANCE_LOADING:{
      return {
        ...state,
        courseInstanceLoading: true
      };
    }
    case 'LOGOUT':{
      return initialState;
    }
    default:{
      return state;
    }
  }
}

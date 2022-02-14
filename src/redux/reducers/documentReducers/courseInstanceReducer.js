import {SET_CURRENT_DOCUMENTS} from '../../types'

const initialState = {
  hasDocument: [],
};

export default function courseInstanceReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_DOCUMENTS: {
      return {
        ...state,
        hasDocument: action.data,
      };
    }
    default: {
      return state;
    }
  }
}
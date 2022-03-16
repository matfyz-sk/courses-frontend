import {SET_EXAMPLE_DATA} from '../../types'

const initialState = {
  data: null,
  dataLoaded: false,
};

export default function exampleReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EXAMPLE_DATA: {
      return {
        ...state,
        data: action.data,
        dataLoaded: true
      };
    }
    default: {
      return state;
    }
  }
}

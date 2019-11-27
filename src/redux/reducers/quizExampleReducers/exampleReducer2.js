import {SET_EXAMPLE_DATA} from '../../types'

const initialState = {
  data:null,
  dataLoaded:false,
};

export default function exampleReducer2(state = initialState, action) {
  switch (action.type) {
    case SET_EXAMPLE_DATA:{
      return {
        ...state,
        data: action.data,
        dataLoaded:true
      };
    }
    default:{
      return state;
    }
  }
}

import {SET_USER_ADMIN} from '../types'

const initialState = {
  isAdmin:true,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_ADMIN:{
      return {
        ...state,
        isAdmin: action.isAdmin
      };
    }
    default:{
      return state;
    }
  }
}

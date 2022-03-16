import { NAV_ACTIONS } from '../types/navigationTypes';

const initialState = {
  current: {
    main: 'Course',
    sub: null,
  },
};

export default function navReducer(state = initialState, action) {
  const { current } = state;
  switch (action.type) {
    case NAV_ACTIONS.SET_MAIN:
      current.main = action.item;
      return {
        ...state,
        current,
      };
    case NAV_ACTIONS.SET_SUB:
      current.sub = action.item;
      return {
        ...state,
        current,
      };
    default:
      return state;
  }
}

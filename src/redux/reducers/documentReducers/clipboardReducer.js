import {
  SET_CLIPBOARD_BEING_CUT, SET_CLIPBOARD_OLD_PARENT, SET_CLIPBOARD_RELOCATED, SET_CLIPBOARD_NEW_PARENT
} from "../../types";

const initialState = {
  beingCut: null,
  oldParent: null,
  newParent: null
}

export default function clipboardReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLIPBOARD_BEING_CUT:
      return {
        ...state,
        relocated: false,
        beingCut: action.item
      }
    case SET_CLIPBOARD_OLD_PARENT:
      return {
        ...state,
        oldParent: action.item
      }
    case SET_CLIPBOARD_NEW_PARENT:
      return {
        ...state,
        newParent: action.item
      }
    default:
      return state

  }
}

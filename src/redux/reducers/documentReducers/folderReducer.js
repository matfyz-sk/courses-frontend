import { FETCH_FOLDER_BEGIN, FETCH_FOLDER_SUCCESS, FETCH_FOLDER_FAILURE, SET_FOLDER_CONTENT, SET_FOLDER } from '../../types'

const initialState = {
  "@id": "",
  name: "",
  parent: "",
  content: [],
  loading: false,
  error: null
}

export default function folderReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FOLDER:
      return {
        ...state,
        "@id": action.item["@id"],
        name: action.item.name,
        parent: action.item.parent,
        content: action.item.content
      }
    case SET_FOLDER_CONTENT:
      return {
        ...state,
        content: action.item.content
      }
    case FETCH_FOLDER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_FOLDER_SUCCESS: {
      return {
        ...state,
        loading: false,
        "@id": action.item["@id"],
        name: action.item.name,
        parent: action.item.parent,
        content: action.item.content
      }
    }
    case FETCH_FOLDER_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.item.error,
        // name: "",
        // parent: "",
        // content: []
      }
    }
    default: {
      return state
    }
  }
}

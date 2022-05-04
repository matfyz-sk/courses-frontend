import { axiosGetEntities, getResponseBody } from 'helperFunctions'
import {
  FETCH_FOLDER_BEGIN,
  FETCH_FOLDER_SUCCESS,
  FETCH_FOLDER_FAILURE,
  SET_FOLDER_CONTENT,
  SET_FOLDER,
} from 'redux/types'

const fetchFolderBegin = () => ({
  type: FETCH_FOLDER_BEGIN,
})

const fetchFolderSuccess = item => ({
  type: FETCH_FOLDER_SUCCESS,
  item,
})

const fetchFolderFailure = item => ({
  type: FETCH_FOLDER_FAILURE,
  item,
})

export const setFolderContent = item => ({
  type: SET_FOLDER_CONTENT,
  item,
})

export const setFolder = item => ({
  type: SET_FOLDER,
  item,
})

export const fetchFolder = folderId => {
  return dispatch => {
    dispatch(fetchFolderBegin)
    axiosGetEntities(`folder/${folderId}`).then(response => {
      if (response.failed) {
        console.log("Folder couldn't be found")
        dispatch(fetchFolderFailure(response.error))
        return
      }
      dispatch(fetchFolderSuccess(getResponseBody(response)[0]))
    })
  }
}

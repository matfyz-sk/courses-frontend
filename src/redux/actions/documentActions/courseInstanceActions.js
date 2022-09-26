import { SET_CURRENT_DOCUMENTS } from '../../types'

export const setCurrentDocuments = item => ({
    type: SET_CURRENT_DOCUMENTS,
    item,
})

export const setCurrentDocumentsOfCourseInstance = documents => {
    return dispatch => {
        dispatch(setCurrentDocuments(documents))
    }
}
import { SET_ASIGNMENTS_TEST_FILE } from '../../types'

const initialState = {
  file: null,
  bonusFile: null,
  fileLoaded: false,
}

export default function assignmentsTestFileReducer(
  state = initialState,
  action
) {
  console.log('QQ', action.file)
  console.log('QQ2', action.bonusFile)
  switch (action.type) {
    case SET_ASIGNMENTS_TEST_FILE: {
      return {
        ...state,
        file: action.file,
        bonusFile: action.bonusFile,
        fileLoaded: true,
      }
    }
    default: {
      return state
    }
  }
}

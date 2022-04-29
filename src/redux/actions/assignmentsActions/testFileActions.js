import { SET_ASIGNMENTS_TEST_FILE } from '../../types'
import JSZip from 'jszip'

export const assignmentsGetTestFile = () => {
  return dispatch => {
    fetch('http://localhost:8081').then(data => {
      data.blob().then(newData => {
        var zip = new JSZip()
        zip
          .loadAsync(newData)
          .then(files => {
            dispatch({ type: SET_ASIGNMENTS_TEST_FILE, file: files })
          })
          .catch(error => console.log(error))
      })
    })
  }
}

export const assignmentsGetTestFileLocally = () => {
  return dispatch => {
    var path = window.location.protocol + '//' + window.location.host
    fetch(path + '/test.zip', { mode: 'no-cors' }).then(response => {
      response.blob().then(blob => {
        var zip = new JSZip()
        zip
          .loadAsync(blob)
          .then(files => {
            dispatch({ type: SET_ASIGNMENTS_TEST_FILE, file: files })
          })
          .catch(error => console.log(error))
      })
    })
  }
}

export const assignmentsSetTestFile = (base64File, bonusFile = false) => {
  return dispatch => {
    const i = base64File.indexOf('base64,')
    const buffer = Buffer.from(base64File.slice(i + 7), 'base64')
    const blob = new Blob([buffer], { type: 'application/zip' })
    var zip = new JSZip()
    zip
      .loadAsync(blob)
      .then(files => {
        if (bonusFile) {
          dispatch({ type: SET_ASIGNMENTS_TEST_FILE, bonusFile: files })
        } else {
          dispatch({ type: SET_ASIGNMENTS_TEST_FILE, file: files })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}

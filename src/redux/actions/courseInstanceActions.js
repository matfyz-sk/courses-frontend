import { SET_COURSE_INSTANCE } from '../types'
import { authHeader } from '../../components/Auth'
import { BASE_URL, COURSE_INSTANCE_URL } from '../../pages/core/constants'
import { store } from '../../index'

export const setCourseInstance = item => ({
  type: SET_COURSE_INSTANCE,
  item,
})

export const fetchCourseInstance = course_id => {
  const header = authHeader()
  fetch(
    `${BASE_URL}${COURSE_INSTANCE_URL}/${course_id}?_join=instanceOf,covers`,
    {
      method: 'GET',
      headers: header,
      mode: 'cors',
      credentials: 'omit',
    }
  )
    .then(response => {
      if (!response.ok) throw new Error(response)
      else return response.json()
    })
    .then(data => {
      if (data['@graph'].length > 0) {
        const course = data['@graph'][0]
        this.setState({ course }, () => {
          store.dispatch(setCourseInstance(course))
        })
      }
    })
}

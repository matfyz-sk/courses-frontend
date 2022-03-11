import axios from 'axios'

import { API_URL } from '../../../configuration/api'
import { SET_TOPICS_DATA } from '../../types'

// export const getTopics = (id, joins) => {
//   return dispatch => {
//     return axios
//       .get(
//         `${apiConfig.API_URL}/topic/${id}${
//           joins && joins.length
//             ? `?_join=${joins.map(join => join).join()}`
//             : ``
//         }`,
//         {
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU`,
//             // Authorization: `Bearer ${
//             //   this.props.isAdmin
//             //     ? "http://www.semanticweb.org/semanticweb#Teacher"
//             //     : "http://www.semanticweb.org/semanticweb#Adam"
//             // }`
//             // TODO add user "http://www.semanticweb.org/semanticweb#Course_student_2""
//           },
//         }
//       )
//       .then(({ data }) => {
//         dispatch({ type: SET_TOPICS_DATA, data })
//       })
//       .catch(error => console.log(error))
//   }
// }

export const postTopic = (topic, token) => {
  return dispatch => {
    axios
      .post(`${ API_URL }/topic`, {...topic}, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({data}) => {
        dispatch({type: SET_TOPICS_DATA, data})
      })
      .catch(error => console.log(error))
  }
}

import React, { useEffect, useState } from 'react'
import Page404 from '../../errors/Page404'
// eslint-disable-next-line import/no-cycle
import { authHeader } from '../../../components/Auth'
import { BACKEND_URL } from "../../../constants";

const withResultDetail = Component => props => {
  const {privileges, courseInstance} = props
  const {course_id, result_type_id} = props.match.params
  const [ resultType, setResultType ] = useState(null)
  const [ resp, setResp ] = useState(200)

  function fetchResultType(id) {
    fetch(
      `${ BACKEND_URL }/data/resultType/${ id }?_join=createdBy,correctionFor`,
      {
        method: 'GET',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
      }
    )
      .then(response => {
        if(!response.ok) {
          setResp(404)
        }
        return response.json()
      })
      .then(data => {
        if(data['@graph'] && data['@graph'].length > 0) {
          setResultType(data['@graph'][0])
        } else {
          setResp(404)
        }
      })
  }

  useEffect(() => {
    fetchResultType(result_type_id)
  }, [])

  if(resp === 200 && resultType && privileges && courseInstance) {
    return (
      <>
        <Component
          canEdit={
            privileges.inGlobal === 'admin' ||
            privileges.inCourseInstance === 'instructor'
          }
          resultType={ resultType }
          course_id={ course_id }
          result_type_id={ result_type_id }
          privileges={ privileges }
          instance={ courseInstance }
        />
      </>
    )
  }
  if(resp === 404) {
    return <Page404/>
  }
  return null
}

export default withResultDetail

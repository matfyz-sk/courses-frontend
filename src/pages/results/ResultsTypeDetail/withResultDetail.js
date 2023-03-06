import React, { useEffect, useState } from 'react'
import Page404 from '../../errors/Page404'
// eslint-disable-next-line import/no-cycle
import { useGetResultTypeDetailCreatedByWithCorrectionQuery } from "services/result"

const withResultDetail = Component => props => {
  const { privileges, courseInstance } = props
  const { course_id, result_type_id } = props.match.params
  const [resultType, setResultType] = useState(null)
  const [resp, setResp] = useState(200)
  const {data, isSuccess} = useGetResultTypeDetailCreatedByWithCorrectionQuery(result_type_id)

  function fetchResultType() {
    if (isSuccess) {
      if (data && data.length > 0) {
        setResultType(data[0])
      } else {
        setResp(404)
      }
    }
  }

  useEffect(() => {
    fetchResultType(result_type_id)
  }, [])

  if (resp === 200 && resultType && privileges && courseInstance) {
    return (
      <>
        <Component
          canEdit={
            privileges.inGlobal === 'admin' ||
            privileges.inCourseInstance === 'instructor'
          }
          resultType={resultType}
          course_id={course_id}
          result_type_id={result_type_id}
          privileges={privileges}
          instance={courseInstance}
        />
      </>
    )
  }
  if (resp === 404) {
    return <Page404 />
  }
  return null
}

export default withResultDetail

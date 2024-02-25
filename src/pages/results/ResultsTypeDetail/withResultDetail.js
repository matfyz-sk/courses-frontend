import React, { useEffect, useState } from 'react'
import Page404 from '../../errors/Page404'
// eslint-disable-next-line import/no-cycle
import { useGetResultTypeQuery } from "services/result"
import { getFullID } from 'helperFunctions'

const withResultDetail = Component => props => {
  const { privileges, courseInstance } = props
  const { course_id, result_type_id } = props.match.params
  const [resultType, setResultType] = useState(null)
  const [resp, setResp] = useState(200)
  const {
    data: resultTypeData, 
    isSuccess: isResultTypeSuccess,
    error: resultTypeError
  } = useGetResultTypeQuery(getFullID(result_type_id, "resulttype"), {skip: !result_type_id})


  function fetchResultType() {
    if (isResultTypeSuccess) {
      if (resultTypeData && resultTypeData.length > 0) {
        setResultType(resultTypeData[0])
      } else {
        setResp(404)
      }
    }
  }

  useEffect(() => {
    fetchResultType(result_type_id)
  }, [isResultTypeSuccess])

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

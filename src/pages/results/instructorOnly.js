import React from 'react'
import Page401 from '../errors/Page401'

const instructorOnly = Component => props => {
  const { privileges } = props
  if (privileges && privileges.inCourseInstance !== 'visitor') {
    if (
      privileges.inGlobal === 'admin' ||
      privileges.inCourseInstance === 'instructor'
    ) {
      return <Component {...props} />
    }
    return <Page401 />
  }
  return null
}

export default instructorOnly

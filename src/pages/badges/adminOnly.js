import React from 'react'
import Page401 from '../errors/Page401'

const adminOnly = Component => props => {
  const { privilegesReducer: privileges } = props
  if (privileges && privileges.inGlobal === 'admin') {
    return <Component {...props} />
  }
  return <Page401 />
}

export default adminOnly

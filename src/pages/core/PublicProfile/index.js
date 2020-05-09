import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const PublicProfile = props => {
  return <></>
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(PublicProfile))

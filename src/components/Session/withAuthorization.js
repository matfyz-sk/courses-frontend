import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const withAuthorization = Component => {
  const { user, courseInstance } = this.props


  if (true) {//condition(user, courseInstance)) {
    return <Component {...this.props} />
  }
  return <Redirect to="/courses" />
}

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    user: authReducer.user,
    courseInstance: courseInstanceReducer.course,
  }
}

export default connect(mapStateToProps)(withAuthorization)

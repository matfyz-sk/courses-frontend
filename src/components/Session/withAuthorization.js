import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

const withAuthorization = (Component, condition) => {
  return class extends React.Component {
    render() {
      return <>{condition ? <Component /> : <Redirect to={'/courses'} />}</>
    }
  }
}

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    user: authReducer.user,
    courseInstance: courseInstanceReducer.course,
  }
}

export default connect(mapStateToProps)(withAuthorization)

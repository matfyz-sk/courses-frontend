/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchCourseInstance } from '../../../../redux/actions'
import TopicsOverview from './topics-overview'
import { useLazyGetCourseInstanceQuery } from 'services/course'

function TopicsOverviewData(props) {
  const [getCourseInstance] = useLazyGetCourseInstanceQuery()
  const componentDidMount = () => {
    if (props.courseInstanceId && props.token) {
      props.getCourseInstanceConnect(
        history,
        props.courseInstanceId.substring(
          props.courseInstanceId.lastIndexOf('/') + 1
        ),
        props.token
      )
    }
  }

  const componentDidUpdate = (prevProps, prevState) => {
    const { courseInstanceId, getCourseInstanceConnect, token, history } = props

    if (
      courseInstanceId &&
      token &&
      (prevProps.courseInstanceId !== courseInstanceId ||
        prevProps.token !== token)
    ) {
      getCourseInstanceConnect(
        history,
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        getCourseInstance
      )
    }
  }

  return (
    <TopicsOverview
      courseInstanceId={props.courseInstanceId}
      token={props.token}
      isTeacher={props.isTeacher}
      topics={props.courseInstance && props.courseInstance.covers}
      userId={props.userId}
      match={props.match}
    />
  )
}

TopicsOverviewData.propTypes = {
  courseInstanceId: PropTypes.string,
  token: PropTypes.any,
  isTeacher: PropTypes.bool,
  getCourseInstanceConnect: PropTypes.any,
  courseInstance: PropTypes.any,
}

TopicsOverviewData.defaultProps = {
  token: null,
  courseInstanceId: null,
  isTeacher: false,
  getCourseInstanceConnect: null,
  courseInstance: null,
}

const mapStateToProps = ({ userReducer, courseInstanceReducer }) => {
  const { courseInstance, courseInstanceLoaded } = courseInstanceReducer
  const { isAdmin } = userReducer
  return {
    isAdmin,
    courseInstance,
    courseInstanceLoaded,
  }
}

export default connect(mapStateToProps, {
  getCourseInstanceConnect: fetchCourseInstance,
})(TopicsOverviewData)

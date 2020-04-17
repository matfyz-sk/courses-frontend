/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getCourseInstance } from '../../../../redux/actions'
import TopicsOverview from './topics-overview'

class TopicsOverviewData extends Component {
  componentDidMount() {
    const { getCourseInstanceConnect, courseInstanceId, token } = this.props
    if (courseInstanceId && token) {
      getCourseInstanceConnect(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        ['covers', 'instanceOf'],
        token
      )
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { courseInstanceId, getCourseInstanceConnect, token } = this.props
    if (
      courseInstanceId &&
      token &&
      (prevProps.courseInstanceId !== courseInstanceId ||
        prevProps.token !== token)
    ) {
      getCourseInstanceConnect(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        ['covers', 'instanceOf'],
        token
      )
    }
  }

  render() {
    const {
      isTeacher,
      courseInstance,
      token,
      courseInstanceId,
      userId,
      match,
    } = this.props
    return (
      <>
        <TopicsOverview
          courseInstanceId={courseInstanceId}
          token={token}
          isTeacher={isTeacher}
          topics={courseInstance && courseInstance.covers}
          userId={userId}
          match={match}
        />
      </>
    )
  }
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
  getCourseInstanceConnect: getCourseInstance,
})(TopicsOverviewData)

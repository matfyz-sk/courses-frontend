/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getCourseInstance, getTopics } from '../../../../redux/actions'
import TopicsOverview from './topics-overview'

class TopicsOverviewData extends Component {
  componentDidMount() {
    const { getCourseInstanceConnect, courseInstanceId, token } = this.props
    getCourseInstanceConnect(
      courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
      ['covers', 'instanceOf'],
      token
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      isAdmin,
      courseInstanceId,
      getCourseInstanceConnect,
      token,
    } = this.props
    if (prevProps.isAdmin !== isAdmin) {
      getCourseInstanceConnect(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        ['covers', 'instanceOf'],
        token
      )
    }
    if (prevProps.courseInstanceId !== courseInstanceId) {
      getCourseInstanceConnect(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        ['covers', 'instanceOf'],
        token
      )
    }
  }

  // getQuestionGroups = () => {
  //   const { isAdmin } = this.state;
  //   fetch(api.quiz.fetchQuestionGroups(), {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       token: isAdmin
  //         ? 'http://www.semanticweb.org/semanticweb#Teacher'
  //         : 'http://www.semanticweb.org/semanticweb#Adam',
  //       // TODO add user "http://www.semanticweb.org/semanticweb#Course_student_2"
  //     }),
  //   }).then(response => {
  //     if (response.ok) {
  //       response
  //         .json()
  //         .then(data => {
  //           this.setState({
  //             topics: data,
  //             topicCollapse: new Array(data.length).fill(false),
  //           });
  //         })
  //         .catch(error => {
  //           console.log(error);
  //         });
  //     }
  //   });
  // };

  render() {
    const { isAdmin, courseInstance } = this.props
    return (
      <>
        <TopicsOverview
          courseInstance={courseInstance}
          isAdmin={isAdmin}
          topics={courseInstance && courseInstance.covers}
        />
      </>
    )
  }
}

TopicsOverviewData.propTypes = {
  courseInstanceId: PropTypes.string,
  token: PropTypes.any,
  topics: PropTypes.any,
  isAdmin: PropTypes.bool,
  getCourseInstanceConnect: PropTypes.any,
  courseInstance: PropTypes.any,
}

TopicsOverviewData.defaultProps = {
  token: null,
  courseInstanceId: null,
  topics: null,
  isAdmin: false,
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

/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Card, Button } from 'reactstrap'

import apiConfig from '../../../../configuration/api'
import SideNav from '../../../../side-nav.tsx'
import TopicPreview from './topic-preview/topic-preview'

class TopicsOverview extends Component {
  state = {
    topicCollapse: [],
    questionAssignments: [],
  }

  componentDidMount() {
    const { courseInstanceId, token, isTeacher, userId } = this.props
    if (courseInstanceId && isTeacher !== null && userId && token) {
      this.getAssignments(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        isTeacher ? null : userId.substring(userId.lastIndexOf('/') + 1),
        token
      )
    }
  }

  componentDidUpdate(prevProps) {
    const { courseInstanceId, token, isTeacher, userId } = this.props
    if (
      courseInstanceId &&
      token &&
      isTeacher !== null &&
      userId &&
      (courseInstanceId !== prevProps.courseInstanceId ||
        token !== prevProps.token ||
        isTeacher !== prevProps.isTeacher ||
        userId !== prevProps.userId)
    ) {
      this.getAssignments(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        isTeacher ? null : userId.substring(userId.lastIndexOf('/') + 1),
        token
      )
    }
  }

  fetchDeleteAssignment = assignmentId => {
    const { token } = this.props
    this.deleteAssignment(assignmentId, token)
  }

  fetchAssignments = () => {
    const { courseInstanceId, token, isTeacher, userId } = this.props
    this.getAssignments(
      courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
      isTeacher ? null : userId.substring(userId.lastIndexOf('/') + 1),
      token
    )
  }

  deleteAssignment = (assignmentId, token) => {
    return axios
      .delete(
        `${apiConfig.API_URL}/questionAssignment/${assignmentId.substring(
          assignmentId.lastIndexOf('/') + 1
        )}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      )
      .then(({ data }) => {
        this.fetchAssignments()
      })
      .catch(error => console.log(error))
  }

  fetchAssignments = () => {
    const { courseInstanceId, token, isTeacher, userId } = this.props
    this.getAssignments(
      courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
      isTeacher ? null : userId.substring(userId.lastIndexOf('/') + 1),
      token
    )
  }

  getAssignments = (courseInstanceId, userId, token) => {
    return axios
      .get(
        `${
          apiConfig.API_URL
        }/questionAssignment?courseInstance=${courseInstanceId}${
          userId ? `&assignedTo=${userId}` : ''
        }`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      )
      .then(({ data }) => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const questionAssignments = data['@graph'].map(questionAssignment => {
            let questionAssignmentMapped = {}

            if (questionAssignment) {
              const {
                description,
                covers,
                startDate,
                endDate,
              } = questionAssignment
              questionAssignmentMapped = {
                id: questionAssignment['@id'],
                description,
                covers,
                startDate,
                endDate,
              }
            }
            return questionAssignmentMapped
          })
          console.log(questionAssignments)
          this.setState({
            questionAssignments,
          })
        }
      })
      .catch(error => console.log(error))
  }

  toggle = index => e => {
    e.preventDefault()
    const { topicCollapse } = this.state
    const updatedTopicCollapse = [...topicCollapse]
    updatedTopicCollapse[index] = !updatedTopicCollapse[index]
    this.setState({ topicCollapse: updatedTopicCollapse })
  }

  render() {
    const { topicCollapse, questionAssignments } = this.state
    const { topics, isTeacher } = this.props
    return (
      <>
        <h1>Questions by topic</h1>
        <div>
          {topics &&
            topics.map((topic, index) => {
              const { name, questions } = topic
              const id = topic['@id']
              const assignment = questionAssignments.find(
                questionAssignment => {
                  if (
                    questionAssignment.covers &&
                    questionAssignment.covers[0]['@id']
                  ) {
                    return questionAssignment.covers[0]['@id'] === id
                  }
                  return false
                }
              )
              return (
                <Card tag="article" key={id}>
                  <TopicPreview
                    id={id}
                    name={name}
                    assignment={assignment}
                    // questions={questions}
                    isTeacher={isTeacher}
                    toggle={this.toggle(index)}
                    collapse={topicCollapse[index]}
                    fetchDeleteAssignment={this.fetchDeleteAssignment}
                  />
                </Card>
              )
            })}
          {isTeacher ? (
            <Button color="success" tag={Link} to="/quiz/createTopic">
              <h2 className="h5">+ Create topic</h2>
            </Button>
          ) : null}
        </div>
      </>
    )
  }
}

TopicsOverview.propTypes = {
  topics: PropTypes.any,
  isTeacher: PropTypes.bool,
}

TopicsOverview.defaultProps = {
  topics: [],
  isTeacher: false,
}

export default TopicsOverview

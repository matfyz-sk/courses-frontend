import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card, Button } from 'reactstrap'
import axios from 'axios'

import { getShortID, axiosRequest } from 'helperFunctions'
import { API_URL } from '../../../../configuration/api'
import AssignmentPreview from './assignment-preview/assignment-preview'

class QuizAssignmentsOverview extends Component {
  state = {
    quizAssignments: [],
    quizAssignmentCollapse: [],
  }

  componentDidMount() {
    const { courseInstanceId, isTeacher, userId, token } = this.props
    if (courseInstanceId && isTeacher && token) {
      this.fetchQuizAssignments(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        isTeacher ? null : userId.substring(userId.lastIndexOf('/') + 1),
        token
      )
    }
  }

  componentDidUpdate(prevProps) {
    const { courseInstanceId, isTeacher, userId, token } = this.props
    if (
      courseInstanceId &&
      isTeacher &&
      token &&
      (prevProps.courseInstanceId !== courseInstanceId ||
        prevProps.isTeacher !== isTeacher ||
        prevProps.userId !== userId ||
        prevProps.token !== token)
    )
      this.fetchQuizAssignments(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        isTeacher ? null : userId.substring(userId.lastIndexOf('/') + 1),
        token
      )
  }

  toggle = index => e => {
    const { quizAssignmentCollapse } = this.state
    e.preventDefault()
    const updatedAssignmentCollapse = quizAssignmentCollapse
    updatedAssignmentCollapse[index] = !updatedAssignmentCollapse[index]
    this.setState({ quizAssignmentCollapse: updatedAssignmentCollapse })
  }

  fetchQuizAssignments = (courseInstanceId, userId, token) => {
    return axios
      .get(
        `${API_URL}/quizAssignment?courseInstance=${courseInstanceId}${
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
          const quizAssignments = data['@graph'].map(quizAssignment => {
            return { ...quizAssignment, id: quizAssignment['@id'] }
          })
          quizAssignments.forEach(quizAssignment => {
            axiosRequest(
              'get',
              `${API_URL}/quizTake?quizAssignment=${getShortID(
                quizAssignment.id
              )}`
            )
              .then(({ response: quizTakeResponse }) => {
                // console.log(quizTakeResponse.data)
                // TODO if milan fix bug
              })
              .catch(error => console.log(error))
          })
          this.setState({
            quizAssignments,
            quizAssignmentCollapse: new Array(quizAssignments.length).fill(
              false
            ),
          })
        }
      })
      .catch(error => console.log(error))
  }

  render() {
    const { quizAssignmentCollapse, quizAssignments } = this.state
    const { isTeacher, history, match, token } = this.props
    return (
      <>
        <h1>Quizzes</h1>
        <div>
          {quizAssignments.map((quizAssignment, index) => {
            const {
              name,
              description,
              startDate,
              endDate,
              id,
              quizTakes,
            } = quizAssignment
            return (
              <Card tag="article" key={quizAssignment.id}>
                <AssignmentPreview
                  id={id}
                  title={name}
                  description={description}
                  startDate={startDate}
                  endDate={endDate}
                  quizTakes={quizTakes}
                  isTeacher={isTeacher}
                  toggle={this.toggle(index)}
                  collapse={quizAssignmentCollapse[index]}
                  history={history}
                  match={match}
                  token={token}
                />
              </Card>
            )
          })}
          {isTeacher ? (
            <Button
              color="success"
              tag={Link}
              to={{
                pathname: `/courses/${match.params.courseId}/quiz/quizAssignment`,
              }}
            >
              Create quiz assignment
            </Button>
          ) : null}
        </div>
      </>
    )
  }
}

const mapStateToProps = ({ userReducer }) => {
  const { isAdmin } = userReducer
  return {
    isAdmin,
  }
}

export default connect(mapStateToProps, {})(QuizAssignmentsOverview)

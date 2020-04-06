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
    const { courseInstanceId, token } = this.props
    this.getAssignments(
      courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
      token
    )
  }

  componentDidUpdate(prevProps) {
    const { courseInstanceId, token } = this.props
    if (
      courseInstanceId !== prevProps.courseInstanceId ||
      token !== prevProps.token
    ) {
      this.getAssignments(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        token
      )
    }
  }

  getAssignments = (courseInstanceId, token) => {
    return axios
      .get(
        `${apiConfig.API_URL}/questionAssignment?courseInstance=${courseInstanceId}&_join=creationPeriod`, // TODO if teacher get all if student get only assignedTo me
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
          // TODO if only one question assigment came data['@graph'] is object if more data['@graph'] is array
          const questionAssignments = data['@graph'].map(questionAssignment => {
            let questionAssignmentMapped = {}
            if (questionAssignment) {
              const { description, covers, creationPeriod } = questionAssignment
              questionAssignmentMapped = {
                id: questionAssignment['@id'],
                description,
                covers,
                creationPeriod,
              }
            }
            return questionAssignmentMapped
          })
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
    const { topics, isAdmin } = this.props
    return (
      <>
        <SideNav />
        <h1>Questions by topic</h1>
        <div>
          {topics &&
            topics.map((topic, index) => {
              const { name, questions } = topic
              const id = topic['@id']
              const assignment = questionAssignments.filter(
                questionAssignment => {
                  if (
                    questionAssignment.covers &&
                    questionAssignment.covers['@id']
                  ) {
                    return questionAssignment.covers['@id'] === id
                  }
                  return false
                }
              )
              return (
                <Card tag="article" key={id}>
                  <TopicPreview
                    id={id}
                    name={name}
                    assignment={
                      assignment &&
                      assignment.length &&
                      assignment.length > 0 &&
                      assignment[0]
                    }
                    // questions={questions}
                    isTeacher={isAdmin} // TODO eventually change for isTeacher?
                    toggle={this.toggle(index)}
                    collapse={topicCollapse[index]}
                  />
                </Card>
              )
            })}
          {isAdmin ? ( // TODO eventually change for isTeacher?
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
  isAdmin: PropTypes.bool,
}

TopicsOverview.defaultProps = {
  topics: [],
  isAdmin: false,
}

export default TopicsOverview

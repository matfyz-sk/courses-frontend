/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Card, Button } from 'reactstrap'

import apiConfig from '../../../../configuration/api'
import TopicPreview from './topic-preview/topic-preview'

class TopicsOverview extends Component {
  state = {
    topicCollapse: [],
    questionAssignments: [],
    questionsByTopic: new Map(),
  }

  componentDidMount() {
    const { courseInstanceId, token, isTeacher, userId, topics } = this.props
    if (courseInstanceId && isTeacher !== null && userId && token) {
      this.getAssignments(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        isTeacher ? null : userId.substring(userId.lastIndexOf('/') + 1),
        token
      )
    }
    if (topics && topics.length && token) {
      this.getQuestionsData(topics, token)
    }
  }

  componentDidUpdate(prevProps) {
    const { courseInstanceId, token, isTeacher, userId, topics } = this.props
    if (token) {
      if (
        courseInstanceId &&
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
      if (
        topics &&
        (topics !== prevProps.topics || token !== prevProps.token)
      ) {
        this.getQuestionsData(topics, token)
      }
    }
  }

  getQuestionsData = async (topics, token) => {
    const topicsIds = topics.reduce((accumulator, topic) => {
      if (topic && topic['@id']) {
        accumulator.push(topic['@id'])
      }
      return accumulator
    }, [])
    const questionsByTopic = await this.getQuestions(topicsIds, token)
    this.setState({ questionsByTopic })
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

  getQuestions = async (topics, token) => {
    const promises = []
    const questionsByTopicsRawEmpty = new Map()
    topics.forEach(topic => {
      questionsByTopicsRawEmpty.set(topic, [])
      promises.push(
        axios.get(
          `${apiConfig.API_URL}/question${`?ofTopic=${topic.substring(
            topic.lastIndexOf('/') + 1
          )}`}`,
          {
            // TODO student should get only public/those which privantness isn't set
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
        )
      )
    })
    return axios.all(promises).then(resultsQuestionsForTopic => {
      const questionsByTopicsRaw = resultsQuestionsForTopic.reduce(
        (accumulatorQuestionsByTopics, questionsGetData) => {
          const { data, status } = questionsGetData
          if (status === 200) {
            if (
              data &&
              data['@graph'] &&
              data['@graph'].length &&
              data['@graph'].length > 0
            ) {
              const questionsByTopicRaw = data['@graph'].reduce(
                (accumulatorQuestions, question) => {
                  if (question) {
                    const { name } = question
                    const questionMapped = {
                      id: question['@id'],
                      title: name,
                    }
                    accumulatorQuestions.push(questionMapped)
                  }
                  return accumulatorQuestions
                },
                []
              )
              accumulatorQuestionsByTopics.set(
                data['@graph'][0].ofTopic[0]['@id'],
                questionsByTopicRaw
              )
            }
          }
          return accumulatorQuestionsByTopics
        },
        new Map(questionsByTopicsRawEmpty)
      )
      return questionsByTopicsRaw
    })
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
    const { topicCollapse, questionAssignments, questionsByTopic } = this.state
    const { topics, isTeacher, match } = this.props
    return (
      <>
        <h1>Questions by topic</h1>
        <div>
          {topics &&
            topics.map((topic, index) => {
              const { name } = topic
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
                    questions={questionsByTopic.get(id)}
                    isTeacher={isTeacher}
                    toggle={this.toggle(index)}
                    collapse={topicCollapse[index]}
                    fetchDeleteAssignment={this.fetchDeleteAssignment}
                    match={match}
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

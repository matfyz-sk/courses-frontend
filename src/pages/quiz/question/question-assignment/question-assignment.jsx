/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import axios from 'axios'

import PropTypes from 'prop-types'
import { Button, Label, Form, FormGroup, Input } from 'reactstrap'

import apiConfig from '../../../../configuration/api'
import AgentOperator from '../../common/agent-operator'
import AssignmentHeader from '../../common/assignment-header'

export class QuestionAssignment extends Component {
  state = {
    taskEventId: null,
    startDate: new Date(),
    endDate: new Date(),
    allTopics: [],
    allAgents: [],
    topic: '',
    topicOldValue: null,
    description: '',
    selectedAgents: [],
    disabledTopics: [],
    disabledTopicsRaw: [],
  }

  componentDidMount() {
    const { courseInstanceId, match, token } = this.props
    if (courseInstanceId) {
      this.getTopics(courseInstanceId, token)

      this.getAgents(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        token
      )
      this.getTopicsWithQuestionAssignment(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        token
      )
      if (this.isEdit() && token) {
        this.getQuestionAssignment(match.params.id, token)
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { courseInstanceId, match, token } = this.props
    const {
      topicOldValue,
      disabledTopics,
      allTopics,
      disabledTopicsRaw,
    } = this.state
    if (courseInstanceId) {
      if (
        courseInstanceId !== prevProps.courseInstanceId ||
        token !== prevProps.token
      ) {
        this.getTopics(courseInstanceId, token)
        this.getTopicsWithQuestionAssignment(
          courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
          token
        )
        this.getAgents(
          courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
          token
        )
      }
      if (
        (this.isEdit() && match.params.id !== prevProps.match.params.id) ||
        token !== prevProps.token
      ) {
        this.getQuestionAssignment(match.params.id, token)
      }
      if (
        topicOldValue !== prevState.topicOldValue ||
        allTopics !== prevState.allTopics ||
        disabledTopics !== prevState.disabledTopics
      ) {
        this.setState({
          topic:
            this.selectTopic(topicOldValue, allTopics, disabledTopics) || '',
        })
      }
      if (
        disabledTopicsRaw !== prevState.disabledTopicsRaw ||
        topicOldValue !== prevState.topicOldValue
      ) {
        this.setState({
          disabledTopics: this.getDisabledTopics(
            disabledTopicsRaw,
            topicOldValue
          ),
        })
      }
    }
  }

  getAgents = (courseInstanceId, token) => {
    return axios
      .get(`${apiConfig.API_URL}/user${`?studentOf=${courseInstanceId}`}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({ data }) => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const allAgents = data['@graph'].map(user => {
            return {
              name: user.name,
              id: user['@id'],
            }
          })
          this.setState({
            allAgents,
          })
        }
      })
      .catch(error => console.log(error))
  }

  getQuestionAssignment = (questionAssignmentId, token) => {
    return axios
      .get(
        `${apiConfig.API_URL}/questionAssignment/${questionAssignmentId}?_join=creationPeriod,covers,assignedTo`,
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
          const questionAssignment = data['@graph'][0]
          const {
            description,
            covers: topic,
            creationPeriod,
            assignedTo,
          } = questionAssignment
          let selectedAgents = []
          if (Array.isArray(assignedTo)) {
            selectedAgents = assignedTo.map(student => {
              return student['@id']
            })
          } else if (assignedTo['@id']) {
            selectedAgents = [assignedTo['@id']]
          }
          this.setState({
            taskEventId: creationPeriod['@id'],
            startDate: new Date(creationPeriod.startDate),
            endDate: new Date(creationPeriod.endDate),
            description,
            topicOldValue: { id: topic['@id'], name: topic.name },
            topic: { id: topic['@id'], name: topic.name },
            selectedAgents,
          })
        }
      })
      .catch(error => console.log(error))
  }

  getTopics = (courseInstanceId, token) => {
    return axios
      .get(`${apiConfig.API_URL}/topic?covers=${courseInstanceId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({ data }) => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const allTopics = data['@graph'].reduce((accumulator, topic) => {
            return accumulator.concat({
              name: topic.name,
              id: topic['@id'],
            })
          }, [])

          this.populateSelect(
            Array.isArray(allTopics) ? allTopics : [allTopics],
            'allTopics',
            'topic',
            null
          )
        }
      })
      .catch(error => console.log(error))
  }

  getTopicsWithQuestionAssignment = (courseInstanceId, token) => {
    return axios
      .get(
        `${apiConfig.API_URL}/questionAssignment?courseInstance=${courseInstanceId}`,
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
          const disabledTopicsRaw = data['@graph'].map(questionAssignment => {
            return questionAssignment.covers['@id']
          })
          this.setState({
            disabledTopicsRaw,
          })
        }
      })
      .catch(error => console.log(error))
  }

  getDisabledTopics = (disabledTopicsRaw, topicOldValue) => {
    const disabledTopics = disabledTopicsRaw.reduce(
      (accumulator, disabledTopicRaw) => {
        if (
          topicOldValue === null ||
          (topicOldValue && topicOldValue.id !== disabledTopicRaw)
        ) {
          return accumulator.concat(disabledTopicRaw)
        }
        return accumulator
      },
      []
    )
    return disabledTopics
  }

  isEdit = () => {
    const { match } = this.props
    return !!match.params.id
  }

  populateSelect = (data, selectElement, elementStateName, selected) => {
    const selectedTmp = selected || (data.length >= 1 ? data[0].id : '')
    this.setState({
      [selectElement]: data,
      [elementStateName]: selectedTmp,
    })
  }

  handleChange = e => {
    const { name } = e.target
    const { value } = e.target
    this.setState({
      [name]: value,
    })
  }

  onStartDateChange = date => {
    this.setState({
      startDate: date,
    })
  }

  onEndDateChange = date => {
    this.setState({
      endDate: date,
    })
  }

  formSubmitWithToken = () => {
    const { token } = this.props
    this.formSubmit(token)
  }

  formSubmit = token => {
    const {
      startDate,
      endDate,
      description,
      topic,
      selectedAgents,
      taskEventId,
    } = this.state
    const { match, history, courseInstanceId } = this.props
    if (topic) {
      if (this.isEdit() && taskEventId) {
        axios
          .patch(
            `${apiConfig.API_URL}/taskEvent/${taskEventId.substring(
              taskEventId.lastIndexOf('/') + 1
            )}`,
            JSON.stringify({
              name: startDate.toISOString(),
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            }),
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: token,
              },
            }
          )
          .then(({ status }) => {
            if (status === 200) {
              axios
                .patch(
                  `${apiConfig.API_URL}/questionAssignment/${match.params.id}`,
                  JSON.stringify({
                    description,
                    covers: topic ? [topic] : [],
                    assignedTo: selectedAgents,
                  }),
                  {
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      Authorization: token,
                    },
                  }
                )
                .then(({ status: statusQuestionAssignment }) => {
                  if (statusQuestionAssignment === 200) {
                    history.push('/quiz/questionGroups')
                  }
                })
                .catch(error => console.log(error))
            }
          })
          .catch(error => console.log(error))
      } else {
        axios
          .post(
            `${apiConfig.API_URL}/taskEvent`,
            JSON.stringify({
              name: startDate.toISOString(),
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              courseInstance: courseInstanceId,
            }),
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: token,
              },
            }
          )
          .then(res => {
            if (res.status === 200) {
              const creationPeriod = res.data.resource.iri
              axios
                .post(
                  `${apiConfig.API_URL}/questionAssignment`,
                  JSON.stringify({
                    name: '',
                    description,
                    covers: topic ? [topic] : [],
                    assignedTo: selectedAgents,
                    courseInstance: courseInstanceId,
                    creationPeriod,
                  }),
                  {
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      Authorization: token,
                    },
                  }
                )
                .then(({ status: statusQuestionAssignment }) => {
                  if (statusQuestionAssignment === 200) {
                    history.push('/questionGroups')
                  }
                })
                .catch(error => console.log(error))
            }
          })
          .catch(error => console.log(error))
      }
    }
  }

  setSelectedAgents = selectedAgents => {
    this.setState({
      selectedAgents,
    })
  }

  selectTopic = (topicOldValue, allTopics, disabledTopics) => {
    let selectedTopic = null
    if (topicOldValue) {
      selectedTopic = topicOldValue.id
    }
    if (
      selectedTopic === null &&
      allTopics &&
      allTopics.length &&
      allTopics.length > 0
    ) {
      const filteredDisabledTopics = allTopics.filter(
        topicFromAll => !disabledTopics.includes(topicFromAll.id)
      )
      if (
        filteredDisabledTopics &&
        filteredDisabledTopics.length &&
        filteredDisabledTopics.length > 0
      )
        selectedTopic = filteredDisabledTopics[0].id
    }
    return selectedTopic
  }

  render() {
    const { isTeacher } = this.props
    const {
      startDate,
      endDate,
      description,
      topic,
      allTopics,
      allAgents,
      selectedAgents,
      topicOldValue,
      disabledTopics,
    } = this.state
    const topicOptions = allTopics.map(topicFromAll => {
      return (
        <option
          key={topicFromAll.id}
          value={topicFromAll.id}
          disabled={disabledTopics.includes(topicFromAll.id)}
        >
          {topicFromAll.name}
        </option>
      )
    })
    if (
      Array.isArray(topicOptions) &&
      topicOptions.length === 0 &&
      topicOldValue
    ) {
      topicOptions.concat(
        <option key={topicOldValue.id} value={topicOldValue.id}>
          {topicOldValue.name}
        </option>
      )
    }
    return isTeacher ? (
      <>
        <h3>Create new question assignment</h3>
        <Form>
          <AssignmentHeader
            startDate={startDate}
            endDate={endDate}
            description={description}
            onStartDateChange={this.onStartDateChange}
            onEndDateChange={this.onEndDateChange}
            handleChange={this.handleChange}
          />
          <FormGroup>
            <Label for="topic">Topic</Label>
            <Input
              type="select"
              name="topic"
              id="topic"
              value={topic}
              onChange={this.handleChange}
            >
              {topicOptions}
            </Input>
          </FormGroup>
          <AgentOperator
            allAgents={allAgents}
            selectedAgents={selectedAgents}
            setSelectedAgents={this.setSelectedAgents}
          />
          <Button color="success" onClick={this.formSubmitWithToken}>
            {this.isEdit() ? 'Edit assignment' : 'Create assignment'}
          </Button>
        </Form>
      </>
    ) : (
      <div>Not authorized.</div>
      //   TODO add private route
    )
  }
}

QuestionAssignment.propTypes = {
  courseInstanceId: PropTypes.string,
}

QuestionAssignment.defaultProps = {
  courseInstanceId: null,
}

export default QuestionAssignment

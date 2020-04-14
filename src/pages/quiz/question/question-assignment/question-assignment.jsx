/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import axios from 'axios'

import PropTypes from 'prop-types'
import { Button, Label, FormGroup, Input } from 'reactstrap'

import apiConfig from '../../../../configuration/api'
import AssignmentHeader from '../../common/assignment-header'
import AgentOperatorNew from '../../common/agent-operator-new'

export class QuestionAssignment extends Component {
  state = {
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
        this.getQuestionAssignment(match.params.questionAssignmentId, token)
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
        (this.isEdit() &&
          match.params.questionAssignmentId !==
            prevProps.match.params.questionAssignmentId) ||
        token !== prevProps.token
      ) {
        this.getQuestionAssignment(match.params.questionAssignmentId, token)
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
          const allAgents = data['@graph'].map(user => ({
            name: user.name,
            id: user['@id'],
          }))
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
        `${apiConfig.API_URL}/questionAssignment/${questionAssignmentId}?_join=covers,assignedTo`,
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
            assignedTo,
            startDate,
            endDate,
          } = questionAssignment
          let selectedAgents = []
          selectedAgents = assignedTo.map(student => {
            return { id: student['@id'], name: student.name }
          })
          this.setState({
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : new Date(),
            description,
            topicOldValue: { id: topic[0]['@id'], name: topic[0].name },
            topic: { id: topic[0]['@id'], name: topic[0].name },
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
          const disabledTopicsRaw = data['@graph'].reduce(
            (accumulator, questionAssignment) => {
              const { covers } = questionAssignment
              if (covers && covers.length && covers.length > 0) {
                accumulator.push(covers[0]['@id'])
              }
              return accumulator
            },
            []
          )
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
    return !!match.params.questionAssignmentId
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
    } = this.state
    const selectedAgentsIds = selectedAgents.map(
      selectedAgent => selectedAgent.id
    )
    const { match, history, courseInstanceId } = this.props
    if (topic) {
      if (this.isEdit()) {
        axios
          .patch(
            `${apiConfig.API_URL}/questionAssignment/${match.params.questionAssignmentId}`,
            JSON.stringify({
              description,
              covers: topic ? [topic] : [],
              assignedTo: selectedAgentsIds,
              startDate,
              endDate,
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
      } else {
        axios
          .post(
            `${apiConfig.API_URL}/questionAssignment`,
            JSON.stringify({
              name: '',
              description,
              covers: topic ? [topic] : [],
              assignedTo: selectedAgentsIds,
              courseInstance: courseInstanceId,
              startDate,
              endDate,
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
    }
  }

  addSelectedAgent = selectedAgent => {
    const { allAgents, selectedAgents } = this.state
    const findAgentRaw = allAgents.find(agent => {
      return agent.id === selectedAgent
    })
    if (
      findAgentRaw &&
      selectedAgents.findIndex(updatedSelectedAgent => {
        return updatedSelectedAgent.id === selectedAgent
      }) === -1
    ) {
      this.setState({
        selectedAgents: [...selectedAgents, findAgentRaw],
      })
    }
  }

  deleteSelectedAgent = selectedAgent => {
    const { selectedAgents } = this.state
    const updatedSelectedAgents = [...selectedAgents]
    if (selectedAgent) {
      const index = updatedSelectedAgents.findIndex(updatedSelectedAgent => {
        return updatedSelectedAgent.id === selectedAgent
      })
      if (index > -1) {
        updatedSelectedAgents.splice(index, 1)
        this.setState({
          selectedAgents: updatedSelectedAgents,
        })
      }
    }
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
      disabledTopics,
    } = this.state
    const agentOptions = allAgents.reduce((accumulator, agent) => {
      const index = selectedAgents.findIndex(selectedAgent => {
        return selectedAgent.id === agent.id
      })
      if (index === -1) {
        accumulator.push({
          ...agent,
          addSelectedAgent: () => this.addSelectedAgent(agent.id),
        })
      }
      return accumulator
    }, [])

    const selectedAgentsMapped = selectedAgents.map(agent => {
      return {
        ...agent,
        deleteSelectedAgent: () => this.deleteSelectedAgent(agent.id),
      }
    })
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
    return isTeacher ? (
      <>
        <h3>Create new question assignment</h3>
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
        <AgentOperatorNew
          allAgents={allAgents}
          agentOptions={agentOptions}
          selectedAgents={selectedAgentsMapped}
        />
        <Button color="success" onClick={this.formSubmitWithToken}>
          {this.isEdit() ? 'Edit assignment' : 'Create assignment'}
        </Button>
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

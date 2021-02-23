import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux'
import { Alert, Label, Form, FormGroup, Row, Col, Input, Button } from 'reactstrap'
import { DragDropContext } from 'react-beautiful-dnd'
import axios from 'axios'
import AgentOperatorNew from 'pages/quiz/common/agent-operator-new'
import QuestionsColumn from './questions-column/questions-column'
import AssignmentHeader from '../../common/assignment-header'
import { API_URL } from '../../../../configuration/api'

const quizAssignmentTypeHARD = 'manualQuizAssignment'

const enText = {
  'manual-quiz-assignment': 'Manual quiz assignment',
  'generated-quiz-assignment': 'Generated quiz assignment',
}

export const QuizAssignmentTypesEnums = Object.freeze({
  manualQuizAssignment: {
    id: 'http://www.courses.matfyz.sk/ontology#ManualQuizAssignment',
    middlename: 'manualQuizAssignment',
    name: enText['manual-quiz-assignment'],
  },
  generatedQuizAssignment: {
    id: 'http://www.courses.matfyz.sk/ontology#GeneratedQuizAssignment',
    middlename: 'generatedQuizAssignment',
    name: enText['generated-quiz-assignment'],
  },
})

class QuizAssignment extends Component {
  state = {
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    allAgents: [],
    selectedAgents: [],
    description: '',
    questions: {},
    allTopics: [],
    validDate: true,
    loading:true,
  }

  componentDidMount() {
    const { courseInstanceId, match, token } = this.props

    if (courseInstanceId && token) {
      this.getTopics(courseInstanceId, token)

      this.getQuestions(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        token
      )
      if (this.isEdit()) {
        const { quizAssignmentType, quizAssignmentId } = match.params
        if (quizAssignmentType && quizAssignmentId)
          this.getQuizAssignment(quizAssignmentType, quizAssignmentId, token)
      }
      this.getAgents(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        token
      )
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { courseInstanceId, match, token } = this.props
    if (courseInstanceId && token) {
      if (
        courseInstanceId !== prevProps.courseInstanceId ||
        token !== prevProps.token
      ) {
        this.getTopics(courseInstanceId, token)

        this.getQuestions(
          courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
          token
        )

        this.getAgents(
          courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
          token
        )
      }
      const { quizAssignmentType, quizAssignmentId } = match.params
      if (
        this.isEdit() &&
        (token !== prevProps.token ||
          quizAssignmentType !== prevProps.match.params.quizAssignmentType ||
          quizAssignmentId !== prevProps.match.params.quizAssignmentId)
      ) {
        this.getQuizAssignment(quizAssignmentType, quizAssignmentId, token)
      }
    }
  }

  getTopics = (courseInstanceId, token) => {
    return axios
    .get(
      `${API_URL}/topic?covers=${courseInstanceId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
    .then(({data}) => {
      if (
        data &&
        data['@graph'] &&
        data['@graph'].length &&
        data['@graph'].length > 0
      ) {
        const topics = data['@graph'].reduce((accumulator, topic) => {
          return accumulator.concat({
            name: topic.name,
            id: topic['@id'],
          })
        }, [])
        this.setState({
          allTopics: topics,
        })
      }
    })
    .catch(error => console.log(error))
  }

  getAgents = (courseInstanceId, token) => {
    return axios
      .get(`${API_URL}/user${`?studentOf=${courseInstanceId}`}`, {
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
            name: `${user.firstName} ${user.lastName}`,
            id: user['@id'],
          }))
          this.setState({
            allAgents,
          })
        }
      })
      .catch(error => console.log(error))
  }

  getQuestions = (courseInstanceId, token) => {
    return axios
      .get(
        `${API_URL}/question${`?approver=iri&courseInstance=${courseInstanceId}`}`,
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
          const questionsRaw = data['@graph']
          const questions = new Map()
          questionsRaw.forEach(questionRaw => {
            const question = { ...questionRaw }
            question.id = questionRaw['@id']

            questions.set(questionRaw['@id'], question)
          })

          const initialDataDatabase = {
            questions,
            columns: {
              availableQuestions: {
                id: 'availableQuestions',
                title: 'Available questions',
                questionIds: Array.from(questions.keys()),
              },
              choosenQuestions: {
                id: 'choosenQuestions',
                title: 'Choosen questions',
                questionIds: [],
              },
            },
            columnOrder: ['choosenQuestions', 'availableQuestions'], //TODO do i need it?
          }
          this.setState({
            loading: false,
            questions: initialDataDatabase, //TODO change for data from database
          })
        }
      })
      .catch(error => console.log(error))
  }

  getQuizAssignment = (quizAssignmentType, quizAssignmentId, token) => {
    let join = ''
    if (
      quizAssignmentType ===
      QuizAssignmentTypesEnums.manualQuizAssignment.middlename
    ) {
      join = 'hasQuizTakePrototype'
    } else if (
      quizAssignmentType ===
      QuizAssignmentTypesEnums.generatedQuizAssignment.middlename
    ) {
      join = 'hasTopicAppearance'
    }
    axios
      .get(
        `${API_URL}/${quizAssignmentType}/${quizAssignmentId}?_join=${join},assignedTo`,
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
          const quizAssignment = data['@graph'][0]
          const {
            name,
            description,
            startDate,
            endDate,
            assignedTo,
          } = quizAssignment
          let selectedAgents = []
          selectedAgents = assignedTo.map(student => {
            return {
              id: student['@id'],
              name: `${student.firstName} ${student.lastName}`,
            }
          })
          if (
            quizAssignment['@type'] ===
            QuizAssignmentTypesEnums.manualQuizAssignment.id
          ) {
            if (
              quizAssignment.hasQuizTakePrototype &&
              quizAssignment.hasQuizTakePrototype.length
            ) {
              const quizTakePrototypeId =
                quizAssignment.hasQuizTakePrototype[0]['@id']
              axios
                .get(
                  `${API_URL}/quizTakePrototype/${quizTakePrototypeId.substring(
                    quizTakePrototypeId.lastIndexOf('/') + 1
                  )}?_join=orderedQuestion`,
                  {
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      Authorization: token,
                    },
                  }
                )
                .then(({ data: dataQuizTakePrototype }) => {
                  if (
                    dataQuizTakePrototype &&
                    dataQuizTakePrototype['@graph'] &&
                    dataQuizTakePrototype['@graph'].length &&
                    dataQuizTakePrototype['@graph'].length > 0
                  ) {
                    const quizTakePrototype = dataQuizTakePrototype['@graph'][0]
                    const sortedOrderedQuestions = quizTakePrototype.orderedQuestion.sort(
                      (a, b) => {
                        return a.position - b.position
                      }
                    )
                    const questionsIds = sortedOrderedQuestions.reduce(
                      (accumulator, orderedQuestion) => {
                        if (orderedQuestion.question) {
                          accumulator.push(orderedQuestion.question)
                        }
                        return accumulator
                      },
                      []
                    )
                    const newQuestions = {
                      ...this.state.questions,
                      columns: {
                        ...this.state.questions.columns,
                        availableQuestions: {
                          ...this.state.questions.columns.availableQuestions,
                          questionIds: this.state.questions.columns.availableQuestions.questionIds.filter(
                            x => !questionsIds.includes(x)
                          ),
                        },
                        choosenQuestions: {
                          ...this.state.questions.columns.choosenQuestions,
                          questionIds: questionsIds,
                        },
                      },
                    }
                    this.setState({ questions: newQuestions })
                  }
                })
                .catch(error => console.log(error))
            }
          }

          this.setState({
            title: name,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            selectedAgents,
            loading:false,
          })
        }
      })
      .catch(error => console.log(error))
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

  populateSelect = (data, selectElement, elementStateName, selected) => {
    const selectedTmp = selected || (data.length >= 1 ? data[0].id : '')
    var newData = data.concat([data])
    this.setState({
      [selectElement]: newData,
      [elementStateName]: selectedTmp,
    })
  }

  onStartDateChange = date => {
    this.setState({
      startDate: date,
      validDate: date <= this.state.endDate.getTime()
    })
  }

  onEndDateChange = date => {
    this.setState({
      endDate: date,
      validDate: this.state.startDate.getTime() <= date
    })
  }

  setSelectedAgents = selectedAgents => {
    this.setState({
      selectedAgents,
    })
  }

  handleChange = e => {
    const { name } = e.target
    const { value } = e.target
    this.setState({
      [name]: value,
    })
  }

  isEdit = () => {
    return !!this.props.match.params.quizAssignmentId
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result
    if (!destination) {
      return
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    if (destination.droppableId === source.droppableId) {
      const column = this.state.questions.columns[source.droppableId]
      const newQuestionIds = Array.from(column.questionIds)
      newQuestionIds.splice(source.index, 1)
      newQuestionIds.splice(destination.index, 0, draggableId)
      const newColumn = {
        ...column,
        questionIds: newQuestionIds,
      }
      const newState = {
        ...this.state,
        questions: {
          ...this.state.questions,
          columns: {
            ...this.state.questions.columns,
            [newColumn.id]: newColumn,
          },
        },
      }
      this.setState(newState)
    } else {
      const columnSource = this.state.questions.columns[source.droppableId]
      const columnDestination = this.state.questions.columns[
        destination.droppableId
      ]
      const newQuestionIdsSource = Array.from(columnSource.questionIds)
      const newQuestionIdsDestination = Array.from(
        columnDestination.questionIds
      )
      newQuestionIdsSource.splice(source.index, 1)
      newQuestionIdsDestination.splice(destination.index, 0, draggableId)
      const newColumnSource = {
        ...columnSource,
        questionIds: newQuestionIdsSource,
      }
      const newColumnDestination = {
        ...columnDestination,
        questionIds: newQuestionIdsDestination,
      }
      const newState = {
        ...this.state,
        questions: {
          ...this.state.questions,
          columns: {
            ...this.state.questions.columns,
            [newColumnSource.id]: newColumnSource,
            [newColumnDestination.id]: newColumnDestination,
          },
        },
      }
      this.setState(newState)
    }
  }

  formSubmitWithToken = () => {
    const { token } = this.props
    if (token) {
      this.formSubmit(token)
    }
  }

  formSubmit = token => {
    const {
      title,
      startDate,
      endDate,
      description,
      selectedAgents,
      questions,
    } = this.state
    const { match, history, courseInstanceId } = this.props
    const selectedAgentsIds = selectedAgents.map(
      selectedAgent => selectedAgent.id
    )
    const hasQuizTakePrototype = {
      orderedQuestion: questions.columns.choosenQuestions.questionIds.map(
        (questionId, index) => {
          const questionTmp = {
            question: questionId,
            position: index,
          }
          return questionTmp
        }
      ),
    }
    const data = {
      name: title,
      startDate,
      endDate,
      description,
      assignedTo: selectedAgentsIds,
      courseInstance: courseInstanceId,
      shuffleAnswer: false,
      shuffleQuestion: false,
    }
    if (
      quizAssignmentTypeHARD ===
      QuizAssignmentTypesEnums.manualQuizAssignment.middlename
    ) {
      data.hasQuizTakePrototype = hasQuizTakePrototype
    }

    axios
      .post(`${API_URL}/${quizAssignmentTypeHARD}`, JSON.stringify(data), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({ status: statusQuestionAssignment }) => {
        if (statusQuestionAssignment === 200) {
          if (this.isEdit()) {
            const { quizAssignmentType, quizAssignmentId } = match.params
            axios
              .delete(`${API_URL}/${quizAssignmentType}/${quizAssignmentId}`, {
                headers: {
                  Authorization: token,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              })
              .then(({ status: statusQuestionAssignmentDelete }) => {
                if (statusQuestionAssignmentDelete === 200) {
                  history.push(
                    `/courses/${match.params.courseId}/quiz/quizAssignmentsOverview`
                  )
                }
              })
              .catch(error => console.log(error))
          } else {
            history.push(
              `/courses/${match.params.courseId}/quiz/quizAssignmentsOverview`
            )
          }
        }
      })
      .catch(error => console.log(error))
  }

  render() {
    const {
      title,
      startDate,
      endDate,
      description,
      selectedAgents,
      questions,
      allAgents,
      allTopics,
      validDate,
      loading
    } = this.state

    const topicOptions = allTopics.map(topicFromAll => {
      return (
        <option
          key={topicFromAll.id}
          value={topicFromAll.id}
        >
          {topicFromAll.name}
        </option>
      )
    })

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

    if(this.state.loading) {
      return(
        <>
        <h3>Create new quiz assignment</h3>
        <Alert color="primary">
          Loading...
        </Alert>
        </>
      )
    }

    return (
      <>
        <h3>Create new quiz assignment</h3>
        <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              id="title"
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              onChange={this.handleChange}
              valid={title.length > 0}
            />
          </FormGroup>
          <AssignmentHeader
            startDate={startDate}
            endDate={endDate}
            description={description}
            onStartDateChange={this.onStartDateChange}
            onEndDateChange={this.onEndDateChange}
            handleChange={this.handleChange}
            validDate={validDate}
          />
          <FormGroup>
            <Label for="questions">Questions</Label>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Row>
                {questions && questions.columnOrder
                  ? questions.columnOrder.map(columnId => {
                      // console.log(questions.columnOrder)
                      // console.log(columnId)
                      const column = questions.columns[columnId]
                      // console.log(column)
                      const questionsColumn = column.questionIds.map(
                        questionId => {
                          return questions.questions.get(questionId)
                        }
                      )
                      
                      // console.log(questionsColumn)
                      return (
    
                        <Col key={column.id}>
                          <QuestionsColumn
                            column={column}
                            questions={questionsColumn}
                            topics = {topicOptions}
                          />
                        </Col>
                      )
                    })
                  : null}
              </Row>
            </DragDropContext>
          </FormGroup>
          <AgentOperatorNew
            allAgents={allAgents}
            agentOptions={agentOptions}
            selectedAgents={selectedAgentsMapped}
          />
          <Button color="success" onClick={this.formSubmitWithToken}>
            {this.isEdit() ? 'Edit assignment' : 'Create assignment'}
          </Button>
        </Form>
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

export default connect(mapStateToProps, {})(QuizAssignment)

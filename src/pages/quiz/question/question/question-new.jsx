/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'
import axios from 'axios'
import {
  //   Button,
  Form,
  Card,
  CardBody,
  Label,
  FormGroup,
  Input,
} from 'reactstrap'

import apiConfig from '../../../../configuration/api'
import QuestionAnswers from './question-answers'

const enText = {
  title: 'Title',
  'title-placeholder': 'Add title',
  question: 'Question',
  'question-placeholder': 'What is your question',
  topic: 'Topic',
  'topic-placeholder': 'Topic',
}

class QuestionNew extends Component {
  state = {
    title: '',
    answers: [],
    topicOptions: [],
    question: '',
    topic: '',
    questionType: '',
    questionTypeOptions: [],
    answerId: -2,
  }

  componentDidMount() {
    const { userId, courseInstanceId, isTeacher, token } = this.props
    this.setState({
      answers: this.mapAnswers([{ id: -1, text: '', correct: false }]),
    })
    if (courseInstanceId && isTeacher !== null && userId && token) {
      this.getTopics(
        courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
        isTeacher ? null : userId.substring(userId.lastIndexOf('/') + 1),
        token
      )
    }
    // this.getQuestionTypes()
    // if (this.props.questionId) this.addExistingAnswers(this.props.answers)
  }

  componentDidUpdate(prevProps, prevState) {
    const { userId, courseInstanceId, isTeacher, token } = this.props
    if (
      userId !== prevProps.userId ||
      courseInstanceId !== prevProps.courseInstanceId ||
      isTeacher !== prevProps.isTeacher ||
      token !== prevProps.token
    ) {
      if (courseInstanceId && isTeacher !== null && userId && token) {
        this.getTopics(
          courseInstanceId.substring(courseInstanceId.lastIndexOf('/') + 1),
          isTeacher ? null : userId.substring(userId.lastIndexOf('/') + 1),
          token
        )
      }
    }
    // this.getQuestionTypes()
    // if (this.props.questionId) this.addExistingAnswers(this.props.answers)
  }

  getTopics = (courseInstanceId, userId, token) => {
    return axios
      .get(
        `${
          apiConfig.API_URL
        }/questionAssignment?courseInstance=${courseInstanceId}${
          userId ? `&assignedTo=${userId}` : ''
        }&_join=covers`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      )
      .then(({ data }) => {
        console.log(data)
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const topicsMapped = data['@graph'].map(questionAssignment => {
            let topicMapped = {}
            if (questionAssignment) {
              const { covers } = questionAssignment[0]
              console.log(covers)
              if (covers && covers.length && covers.length > 0) {
                const id = covers[0]['@id']
                const { name } = covers[0]
                topicMapped = {
                  id,
                  name,
                }
              }
            }
            return topicMapped
          })
          this.setState({
            topicOptions: topicsMapped,
          })
        }
      })
      .catch(error => console.log(error))
  }

  mapAnswers = answers => {
    const mappedAnswers = answers.map(answer => {
      const { id, text, correct } = answer
      const mappedAnswer = {
        id,
        text,
        correct,
        changeAnswerText: changedText => this.changeAnswerText(id, changedText),
      }
      return mappedAnswer
    })
    return mappedAnswers
  }

  changeAnswerText = (id, text) => {
    this.setState(prevState => {
      return {
        answers: prevState.answers.map(el => {
          return el.id === id ? { ...el, text } : el
        }),
      }
    })
  }

  changeInput = event => {
    const { name } = event.target
    const { value } = event.target
    this.setState({
      [name]: value,
    })
  }

  addNewAnswer = () => {
    this.setState(prevState => {
      const { answerId, answers } = prevState
      return {
        answers: answers.concat({
          id: answerId,
          text: '',
          correct: false,
          changeAnswerText: changedText =>
            this.changeAnswerText(answerId, changedText),
        }),
        answerId: answerId - 1,
      }
    })
  }

  render() {
    const {
      title,
      question,
      topic,
      topicOptions,
      questionType,
      questionTypeOptions,
      answers,
    } = this.state
    return (
      <Form>
        <Card>
          <CardBody>
            <FormGroup>
              <Label for="title">{enText.title}</Label>
              <Input
                type="text"
                name="title"
                placeholder={enText['title-placeholder']}
                value={title}
                onChange={this.changeInput}
              />
            </FormGroup>
            <FormGroup>
              <Label for="question">{enText.question}</Label>
              <Input
                id="question"
                type="text"
                name="question"
                placeholder={enText['title-placeholder']}
                value={question}
                onChange={this.changeInput}
              />
            </FormGroup>
            <FormGroup>
              <Label for="topic">{enText.topic}</Label>
              <Input
                type="select"
                name="topic"
                id="topic"
                value={topic}
                onChange={this.changeInput}
              >
                {topicOptions.map(topicOption => {
                  return (
                    <option key={topicOption.id} value={topicOption.id}>
                      {topicOption.name}
                    </option>
                  )
                })}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="questionType">{enText['question-type']}</Label>
              <Input
                type="select"
                name="questionType"
                id="questionType"
                value={questionType}
                onChange={this.changeInput}
              >
                {questionTypeOptions.map(questionTypeOption => {
                  return (
                    <option
                      key={questionTypeOption.id}
                      value={questionTypeOption.id}
                      // TODO disabled if out of startDate-endDate
                    >
                      {questionTypeOption.name}
                    </option>
                  )
                })}
              </Input>
            </FormGroup>
            {/* <Button onClick={this.addNewAnswer}>Add new answer</Button> */}
            <QuestionAnswers
              answers={answers}
              addNewAnswer={this.addNewAnswer}
            />

            {/* <Button
              onClick={this.formSubmitHandler}
              disabled={!this.state.formIsValid}
            >
              {this.props.questionId ? 'Edit' : 'Create'}
            </Button> */}
          </CardBody>
        </Card>
      </Form>
    )
  }
}

export default QuestionNew

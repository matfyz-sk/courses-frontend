import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'

import {
  CardSubtitle,
  CardBody,
  CardLink,
  CardTitle,
  CardText,
  Collapse,
  Button,
  Row,
  Col,
} from 'reactstrap'

import { API_URL } from 'configuration/api'
import question from 'pages/quiz/question/question/question'
import {
  axiosAddEntity,
  getIRIFromAddResponse,
  shuffleArray,
} from 'helperFunctions'
import { QuestionTypesEnums } from '../../../question/question/question-new-data'
import { QuizAssignmentTypesEnums } from '../../quiz-assignment/quiz-assignment'

import QuizTakeTable from './quiz-take-table/quiz-take-table'
import { Container } from '@material-ui/core'

class AssignmentPreview extends Component {
  generateQuizTake = quizAssignmentId => {
    const { history, match, token } = this.props
    axios
      .get(
        `${API_URL}${quizAssignmentId.substr(
          quizAssignmentId.lastIndexOf(
            '/',
            quizAssignmentId.lastIndexOf('/') - 1
          )
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
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const quizAssignment = data['@graph'][0]
          const quizAssignmentId = quizAssignment['@id']
          const quizAssignmentType = quizAssignment['@type']
          if (
            quizAssignmentType ===
            QuizAssignmentTypesEnums.manualQuizAssignment.id
          ) {
            const quizTakePrototype = quizAssignment.hasQuizTakePrototype
            if (quizTakePrototype && quizTakePrototype.length) {
              const quizTakePrototypeId = quizTakePrototype[0]['@id']
              if (quizTakePrototypeId) {
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
                    console.log(dataQuizTakePrototype)
                    if (
                      dataQuizTakePrototype &&
                      dataQuizTakePrototype['@graph'] &&
                      dataQuizTakePrototype['@graph'].length &&
                      dataQuizTakePrototype['@graph'].length > 0
                    ) {
                      const quizTakePrototypeRaw =
                        dataQuizTakePrototype['@graph'][0]
                      quizTakePrototypeRaw.orderedQuestion = quizTakePrototypeRaw.orderedQuestion.sort(
                        (a, b) => {
                          return a.position - b.position
                        }
                      )
                      let sortedQuestions = quizTakePrototypeRaw.orderedQuestion.map(
                        orderedQuestion => {
                          return orderedQuestion.question
                        }
                      )
                      if (quizAssignment.shuffleQuestions) {
                        sortedQuestions = shuffleArray(sortedQuestions)
                      }
                      const quizTakeData = {
                        quizAssignment: quizAssignmentId,
                        startTime: new Date(),
                        orderedQuestion: sortedQuestions.map(
                          (sortedQuestion, index) => {
                            // let userAnswer
                            // if (
                            //   sortedQuestion.type ===
                            //   QuestionTypesEnums.multiple.id
                            // ) {
                            //   userAnswer = {}
                            // }
                            // if (
                            //   sortedQuestion.type ===
                            //     QuestionTypesEnums.open.id ||
                            //   sortedQuestion.type ===
                            //     QuestionTypesEnums.essay.id
                            // ) {
                            //   userAnswer = { text: '' }
                            // }
                            return {
                              position: index,
                              question: sortedQuestion,
                            }
                          }
                        ),
                      }
                      axiosAddEntity(quizTakeData, 'quizTake')
                        .then(response => {
                          const quizTakeIri = getIRIFromAddResponse(response)
                          history.push(
                            `/courses/${
                              match.params.courseId
                            }/quiz/quizTake/${quizTakeIri.substring(
                              quizTakeIri.lastIndexOf('/') + 1
                            )}`
                          )
                        })
                        .catch(error => console.log(error))
                    }
                  })
                  .catch(error => console.log(error))
              }
            }
          }
        }
      })
      .catch(error => console.log(error))
  }

  render() {
    const {
      title,
      toggle,
      collapse,
      description,
      startDate,
      endDate,
      isTeacher,
      id,
      quizTakes,
      match,
    } = this.props
    const quizTakenReviewed = []
    const quizTakenNotReviewed = []
    if (quizTakes) {
      quizTakes.forEach(quiz => {
        quiz.isReviewed
          ? quizTakenReviewed.push(quiz)
          : quizTakenNotReviewed.push(quiz)
      })
    }
    const quizAssignmentAddress = id.substr(
      id.lastIndexOf('/', id.lastIndexOf('/') - 1)
    )
    return (
      <>
        <CardBody>
        <CardTitle className="h3">{title}</CardTitle>
        { collapse 
          ? <Button color='success' onClick={toggle}>
              Collapse
            </Button> 
          : <Button color='success' onClick={toggle}>
              Expand
            </Button> 
        }
        </CardBody>
        <Collapse isOpen={collapse}>
          <CardBody className='pt-0'>
            <h4 className="h4">Assignment</h4>
            <CardText>{description}</CardText>
            <CardText>
              <label>Start date: </label>
              {` ${new Date(startDate).toLocaleDateString()}`}
              <br/>
              <label>End date:</label>
                {` ${new Date(endDate).toLocaleDateString()}`}
            </CardText>
            {isTeacher ? (
              <Button
                color="success"
                tag={Link}
                to={{
                  pathname: `/courses/${match.params.courseId}/quiz/quizAssignmentEdit${quizAssignmentAddress}`,
                  state: { topic: id },
                }}
              >
                Edit assignment
              </Button>
            ) : null}
            <hr/>
            <h3 className="mb-4">Quiz takes</h3>
            <Row>
              {quizTakenNotReviewed ? (
                <Col xs="12" md="6">
                  <QuizTakeTable
                    headerText="Submitted"
                    authorHeader="Author"
                    questions={quizTakenNotReviewed}
                    link="/quiz/quizTake/"
                  />
                </Col>
              ) : null}
              {quizTakenReviewed ? (
                <Col xs="12" md="6">
                  <QuizTakeTable
                    headerText="Scored"
                    authorHeader="Author"
                    scoreHeader="Score"
                    questions={quizTakenReviewed}
                    link="/quiz/quizTake/"
                  />
                </Col>
              ) : null}
            </Row>
            {(new Date(startDate) < new Date() &&
              new Date(endDate) > new Date()) ||
            isTeacher ? (
              <Button color="success" onClick={() => this.generateQuizTake(id)}>
                Take Quiz
              </Button>
            ) : null}
          </CardBody>
        </Collapse>
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

export default connect(mapStateToProps, {})(AssignmentPreview)

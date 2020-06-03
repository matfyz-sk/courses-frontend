import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Form, Button } from 'reactstrap'
import { API_URL } from 'configuration/api'
import { axiosRequest, axiosUpdateEntity } from 'helperFunctions'
import { QuestionTypesEnums } from 'pages/quiz/question/question/question-new-data'
import SavedQuestion from '../../question/question-overview/saved-question/saved-question'

export const UserAnswerTypesEnums = Object.freeze({
  orderedAnswer: 'http://www.courses.matfyz.sk/ontology#OrderedAnswer',
  directAnswer: 'http://www.courses.matfyz.sk/ontology#DirectAnswer',
})

export class QuizTake extends Component {
  state = {
    orderedQuestions: [],
  }

  componentDidMount() {
    const { match, isTeacher } = this.props
    if (match && match.params && match.params.quizTakeId) {
      this.getQuizTake(match.params.quizTakeId, isTeacher)
    }
  }

  componentDidUpdate(prevProps) {
    const { match, isTeacher } = this.props

    if (
      match &&
      match.params &&
      match.params.quizTakeId !== prevProps.match.params.quizTakeId
    ) {
      this.getQuizTake(match.params.quizTakeId, isTeacher)
    }
  }

  getQuestion = async (questionType, questionShortId) => {
    return axiosRequest(
      'get',
      `${API_URL}/${questionType}/${questionShortId}${
        questionType === QuestionTypesEnums.multiple.entityName
          ? `?_join=hasAnswer`
          : ''
      }`
    ).then(({ response: questionData }) => {
      console.log(questionData.data)
      if (
        questionData &&
        questionData.data &&
        questionData.data['@graph'] &&
        questionData.data['@graph'].length &&
        questionData.data['@graph'].length > 0
      ) {
        const question = questionData.data['@graph'][0]
        const questionMapped = {
          title: question.name,
          questionType: question['@type'],
          questionText: question.text,
        }
        console.log(question.hasAnswer)
        if (question.hasAnswer) {
          const userAnswer = question.hasAnswer.map(singleAnswer => {
            return {
              id: singleAnswer['@id'],
              text: singleAnswer.text,
              correct: singleAnswer.correct,
            }
          })
          questionMapped.hasAnswer = userAnswer
        }
        console.log(questionMapped)
        return questionMapped
      }
    })
  }

  getUserAnswer = async userAnswerId => {
    let userAnswer
    if (userAnswerId) {
      const userAnswerTypeAndId = userAnswerId.substring(
        userAnswerId.lastIndexOf('/', userAnswerId.lastIndexOf('/') - 1) + 1,
        userAnswerId.lastIndexOf('/')
      )
      // return axiosRequest('get', `${API_URL}/${userAnswerTypeAndId}`).then(
      //   ({ response: questionData }) => {
      //     console.log(questionData.data)
      //     if (
      //       questionData &&
      //       questionData.data &&
      //       questionData.data['@graph'] &&
      //       questionData.data['@graph'].length &&
      //       questionData.data['@graph'].length > 0
      //     ) {
      //       const question = questionData.data['@graph'][0]
      //       const questionMapped = {
      //         title: question.name,
      //         questionType: question['@type'],
      //         questionText: question.text,
      //       }
      //       console.log(question.hasAnswer)
      //       if (question.hasAnswer) {
      //         // const userAnswer = question.hasAnswer.map(singleAnswer => {
      //         //   return {
      //         //     id: singleAnswer['@id'],
      //         //     text: singleAnswer.text,
      //         //     correct: singleAnswer.correct,
      //         //   }
      //         // })
      //         // questionMapped.hasAnswer = userAnswer
      //       }
      //       console.log(questionMapped)
      //       return questionMapped
      //     }
      //   }
      // )
    }
    return userAnswer
  }

  getQuizTake = async (quizTakeId, isTeacher) => {
    axiosRequest(
      'get',
      `${API_URL}/quizTake/${quizTakeId}?_join=orderedQuestion`
    )
      .then(async ({ response: quizTakeResponse }) => {
        console.log(quizTakeResponse.data)
        if (
          quizTakeResponse.data &&
          quizTakeResponse.data['@graph'] &&
          quizTakeResponse.data['@graph'].length &&
          quizTakeResponse.data['@graph'].length > 0
        ) {
          let sortedOrderedQuestions = quizTakeResponse.data[
            '@graph'
          ][0].orderedQuestion.map(orderedQuestion => {
            return { ...orderedQuestion, id: orderedQuestion['@id'] }
          })
          console.log(sortedOrderedQuestions)
          sortedOrderedQuestions = sortedOrderedQuestions.sort((a, b) => {
            return a.position - b.position
          })
          const questions = await Promise.all(
            sortedOrderedQuestions.map(async orderedQuestion => {
              const orderedQuestionMapped = {}
              orderedQuestionMapped.id = orderedQuestion.id
              const questionFullId = orderedQuestion.question
              const questionShortId = questionFullId.substr(
                questionFullId.lastIndexOf('/') + 1
              )
              const questionType = questionFullId.substring(
                questionFullId.lastIndexOf(
                  '/',
                  questionFullId.lastIndexOf('/') - 1
                ) + 1,
                questionFullId.lastIndexOf('/')
              )
              const { userAnswer } = orderedQuestion
              orderedQuestionMapped.question = await this.getQuestion(
                questionType,
                questionShortId,
                orderedQuestionMapped,
                isTeacher,
                orderedQuestion
              )
              if (userAnswer) {
                orderedQuestionMapped.userAnswer = await this.getUserAnswer(
                  userAnswer
                )
              }

              console.log(orderedQuestionMapped)
              // orderedQuestionMapped.setUserAnswer =
              if (isTeacher) {
                orderedQuestionMapped.setScore = this.scoreChange(
                  orderedQuestion.id
                )
              }
              return orderedQuestionMapped
              // orderedQuestionMapped.score =
            })
          )
          console.log(questions)
          this.setState({
            orderedQuestions: questions,
          })
          // potiahnut Question aj s paksametlami
          // zagregovat
          // potiahnut userAnswer
          // zagregovat s odpovedami ktore mi dosli z Question
          // vysledok
          // {
          //   orderedQuestions: {
          //     orderedQuestionId
          //     text
          //     type
          //     userAnswer: {
          //       answer
          //       answers: {
          //         predefinedQuestionId
          //         userChoice
          //       }
          //     }
          //   }
          // }
        }
      })
      .catch(error => console.log(error))
    // fetch(
    //   api.quiz.fetchGetQuizTake() +
    //     encodeURIComponent(this.props.match.params.id),
    //   {
    //     method: "GET",
    //     headers: {
    //       token: this.props.isAdmin
    //         ? "http://www.semanticweb.org/semanticweb#Teacher"
    //         : "http://www.semanticweb.org/semanticweb#Adam"
    //       //TODO add user "http://www.semanticweb.org/semanticweb#Course_student_2"
    //     }
    //   }
    // ).then(response => {
    //   if (response.ok) {
    //     response
    //       .json()
    //       .then(data => {
    //         let orderedQuestions = {};
    //         data.orderedQuestions.forEach(question => {
    //           const answers = {};
    //           question.questionVersion.answers.forEach(answer => {
    //             answers[answer.id] = {
    //               id: answer.id,
    //               correct: answer.correct ? answer.correct : false,
    //               text: answer.text
    //             };
    //           });
    //           console.log(question.userAnswers);
    //           orderedQuestions[question.id] = {
    //             id: question.id,
    //             text: question.questionVersion.text,
    //             answers: answers
    //           };
    //           if (question.userAnswers) {
    //             orderedQuestions[question.id].userAnswers =
    //               question.userAnswers;
    //           }
    //           if (question.score !== undefined) {
    //             orderedQuestions[question.id].score = question.score;
    //           }
    //         });
    //         console.log(orderedQuestions);
    //         this.setState({
    //           quizTakeId: data.id,
    //           orderedQuestions: orderedQuestions,
    //           isSubmited: data.isSubmited,
    //           isReviewed: data.isReviewed
    //         });
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   }
    // });
  }

  formSubmitUserAnswers = () => {
    const { orderedQuestions } = this.state
    const promises = []
    orderedQuestions.forEach(orderedQuestion => {
      const data = { userAnswer: orderedQuestion.userAnswer }
      promises.push(
        axiosUpdateEntity(data, `orderedQuestion/${orderedQuestion.id}`)
      )
    })
    axios.all(promises).then(resultsQuestionsForTopic => {
      // if(all right) {
      //   history.push(
      //    `/courses/${match.params.courseId}/quiz/quizAssignmentsOverview`
      //   )
      // }
    })
  }

  formSubmitReview = () => {
    const orderedQuestionScore = []
    const orderedQuestions = Object.values(this.state.orderedQuestions)
    orderedQuestions.forEach(orderedQuestion => {
      orderedQuestionScore.push({
        id: orderedQuestion.id,
        score: orderedQuestion.score,
      })
    })
    const data = {
      quizTakeId: this.state.quizTakeId,
      orderedQuestions: orderedQuestionScore,
      token: this.context.userType,
    }
    // fetch(api.quiz.fetchSubmitReview(), {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(data)
    // }).then(response => {
    //   if (response.ok) {
    //     this.props.history.push("/quiz/quizAssignmentsOverview");
    //   }
    // });
  }

  scoreChange = (orderedQuestionId, score) => {
    console.log('scoreChange')
    console.log(orderedQuestionId)
    console.log(score)
    // const { orderedQuestions } = this.state
    // const orderedQuestionIndex = orderedQuestions.findIndex(
    //   orderedQuestion => orderedQuestion.id === orderedQuestionId
    // )
    // if (orderedQuestionIndex) {
    //   const updatedOrderedQuestions = [...orderedQuestions]
    //   const updatedOrderedQuestion = {
    //     ...orderedQuestions[orderedQuestionIndex],
    //   }
    //   updatedOrderedQuestion.score = score
    //   updatedOrderedQuestions[orderedQuestionIndex] = updatedOrderedQuestion
    //   this.setState({
    //     orderedQuestions: updatedOrderedQuestions,
    //   })
    // }
  }

  userAnswerChange = (orderedQuestionId, userAnswer) => {
    console.log('userAnswerChange')
    console.log(orderedQuestionId)
    console.log(userAnswer)
    // const { orderedQuestions } = this.state
    // const orderedQuestionIndex = orderedQuestions.findIndex(
    //   orderedQuestion => orderedQuestion.id === orderedQuestionId
    // )
    // if (orderedQuestionIndex) {
    //   const updatedOrderedQuestions = [...orderedQuestions]
    //   const updatedOrderedQuestion = {
    //     ...orderedQuestions[orderedQuestionIndex],
    //   }
    //   if (
    //     updatedOrderedQuestion &&
    //     updatedOrderedQuestion.userAnswer &&
    //     updatedOrderedQuestion.userAnswer.type
    //   ) {
    //     if (
    //       updatedOrderedQuestion.userAnswer.type ===
    //       UserAnswerTypesEnums.orderedAnswer
    //     ) {
    //       const userAnswerIndex = updatedOrderedQuestion.userAnswer.findIndex(
    //         userAnswerSingle => userAnswerSingle.id === userAnswer.id
    //       )
    //       if (userAnswerIndex) {
    //         const updatedUserAnswer = {
    //           ...updatedOrderedQuestion.userAnswer[userAnswerIndex],
    //         }
    //         updatedUserAnswer.userChoice = userAnswer
    //         updatedOrderedQuestion.userAnswer[
    //           userAnswerIndex
    //         ] = updatedUserAnswer
    //       }
    //     }
    //     if (
    //       updatedOrderedQuestion.userAnswer.type ===
    //       UserAnswerTypesEnums.directAnswer
    //     ) {
    //       const updatedUserAnswer = { ...updatedOrderedQuestion.userAnswer }
    //       updatedUserAnswer.text = userAnswer
    //       updatedOrderedQuestion.userAnswer = updatedUserAnswer
    //     }
    //   }
    //   updatedOrderedQuestions[orderedQuestionIndex] = updatedOrderedQuestion
    //   this.setState({
    //     orderedQuestions: updatedOrderedQuestions,
    //   })
    // }
  }

  render() {
    const { orderedQuestions, isSubmited, isReviewed } = this.state
    const { isTeacher } = this.props
    console.log(orderedQuestions)
    return (
      <Form>
        {orderedQuestions.map(orderedQuestion => {
          console.log(orderedQuestion)
          const {
            id,
            question,
            setUserAnswer,
            userAnswer,
            setScore,
            score,
          } = orderedQuestion
          console.log(question)
          const { title, questionType, questionText, hasAnswer } = question
          console.log(question.title)
          const questionMapped = {
            title,
            questionType,
            questionText,
            setUserAnswer,
            disabled: true,
          }
          console.log(questionMapped)
          if (questionType === QuestionTypesEnums.multiple.id) {
            console.log(hasAnswer)
            if (hasAnswer) {
              questionMapped.answers = hasAnswer
            }
            // if (userAnswer) {
            //   const answers = userAnswer.map(singleAnswer => {
            //     const {
            //       id: userAnswerId,
            //       correct,
            //       text,
            //       userAnswerChange,
            //     } = singleAnswer
            //     return {
            //       id: userAnswerId,
            //       correct,
            //       text,
            //       changeAnswerChecked: userAnswerChange,
            //     }
            //   })
          }
          // if (questionType === QuestionTypesEnums.open.id) {
          //   question.userAnswer = userAnswer.text
          // }
          return (
            <SavedQuestion
              key={id}
              id={id}
              question={questionMapped}
              isTeacher={isTeacher}
              setScore={setScore}
              score={score}
            />
            // <SavedQuestion
            //   key={key}
            //   isQuizTake={!isSubmited && !isReviewed}
            //   isPreview={isSubmited || isReviewed}
            //   isSubmited={isSubmited}
            //   isReviewed={isReviewed}
            //   userAnswers={
            //     'userAnswers' in value
            //       ? Object.values(value.userAnswers)
            //       : undefined
            //   }
            //   score={'score' in value ? value.score : undefined}
            //   text={value.text}
            //   answers={Object.values(value.answers)}
            //   onChange={e => this.onChange(e, key)}
            //   onScore={e => this.onScore(e, key)}
            //   isTeacher={isTeacher}
            // />
          )
        })}
        {(!isTeacher && !isSubmited && !isReviewed) ||
        (isTeacher && !isSubmited && !isReviewed) ? (
          <Button
            disabled
            color="success"
            onClick={() => this.formSubmitUserAnswers()}
          >
            Submit
          </Button>
        ) : null}
        {isTeacher && (isSubmited || isReviewed) ? (
          <Button
            disabled
            color="success"
            onClick={() => this.formSubmitReview()}
          >
            Submit review
          </Button>
        ) : null}
      </Form>
    )
  }
}

const mapStateToProps = ({ userReducer }) => {
  const { isAdmin } = userReducer
  return {
    isAdmin,
  }
}

export default connect(mapStateToProps, {})(QuizTake)

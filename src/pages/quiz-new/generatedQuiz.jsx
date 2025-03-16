import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { useLocation } from 'react-router'
import { redirect } from '../../constants/redirect'
import { QUIZNEW } from '../../constants/routes'
import { GreenCheckbox, useNewQuizStyles } from './styles'
import { MdCheck } from 'react-icons/md'
import { Button, FormControlLabel } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

function GeneratedQuiz({ courseId }) {
  const location = useLocation()
  const classes = useNewQuizStyles()

  const [showAlerts, setShowAlerts] = useState(false)
  // show alerts only after "check answers" has been clicked

  let questions = location.state.questions

  let [questionsWithCheck, setQuestionsWithCheck] = useState([])

  useEffect(() => {
    // set your state from the resolved promise
    setQuestionsWithCheck(
      questions.map(question => {
        let hasPredefinedAnswerNew = question.hasPredefinedAnswer.map(
          answer => {
            return { ...answer, checked: false }
          }
        )
        return {
          ...question,
          hasPredefinedAnswerWithCheck: hasPredefinedAnswerNew,
          correctlyAnswered: false,
        }
      })
    )
  }, [])

  /*let questionsWithCheck = questions.map(question => {
    let hasPredefinedAnswerNew = question.hasPredefinedAnswer.map(answer => {
      return { ...answer, checked: false }
    })
    return {
      ...question,
      hasPredefinedAnswerWithCheck: hasPredefinedAnswerNew,
      correctlyAnswered: false,
    }
  })*/
  console.log(questionsWithCheck)

  const onAnswerCheckChanged = (questionId, answerId) => {
    setShowAlerts(false)
    let newQuestionsWithCheck = questionsWithCheck.map(question => {
      if (question._id === questionId) {
        question.hasPredefinedAnswerWithCheck.forEach(answer => {
          if (answer._id === answerId) {
            answer.checked = !answer.checked
          }
        })
      }
      return question
    })
    console.log(newQuestionsWithCheck)
    setQuestionsWithCheck(newQuestionsWithCheck)
  }

  function checkAnswer(questionId) {
    let isCorrect = true
    questionsWithCheck.forEach(question => {
      if (question._id === questionId) {
        question.hasPredefinedAnswerWithCheck.forEach(answer => {
          if (
            (answer.correct && !answer.checked) ||
            (!answer.correct && answer.checked)
          ) {
            isCorrect = false
          }
        })
      }
    })
    return isCorrect
  }

  function handleCheckAnswer() {
    let newQuestionsWithCheck = questionsWithCheck.map(question => {
      return { ...question, correctlyAnswered: checkAnswer(question._id) }
    })
    console.log(questionsWithCheck)
    setQuestionsWithCheck(newQuestionsWithCheck)
    setShowAlerts(true)
  }

  const renderedQuestions = questionsWithCheck.map(question => {
    let renderedAnswers = question.hasPredefinedAnswer.map(answer => {
      return (
        <div key={answer._id}>
          <FormControlLabel
            style={{ width: 'fit-content' }}
            control={<GreenCheckbox />}
            label={answer.text}
            defaultChecked={false}
            checked={answer.checked}
            onChange={() => onAnswerCheckChanged(question._id, answer._id)}
          />
          {answer.image ? (
            <img style={{ maxWidth: '50%' }} src={answer.image} />
          ) : (
            ''
          )}
        </div>
      )
    })

    let alert = ''
    question.correctlyAnswered
      ? (alert = (
          <Alert severity="success" style={{ width: 'fit-content' }}>
            Correct!
          </Alert>
        ))
      : (alert = (
          <Alert severity="error" style={{ width: 'fit-content' }}>
            Incorrect!
          </Alert>
        ))

    return (
      <div key={question._id}>
        <h4 style={{ marginTop: '10px', marginBottom: '10px' }}>
          {question.text}
        </h4>
        {question.image ? (
          <img style={{ maxWidth: '30%' }} src={question.image} />
        ) : (
          ''
        )}
        {renderedAnswers}
        {showAlerts && alert}
      </div>
    )
  })

  return (
    <div className={classes.container}>
      <Link
        to={redirect(QUIZNEW, [{ key: 'course_id', value: courseId }])}
        className="btn btn-outline-success mb-2"
      >
        Back
      </Link>
      {renderedQuestions}
      <Button
        variant="contained"
        startIcon={<MdCheck />}
        onClick={handleCheckAnswer}
        style={{ marginTop: '10px' }}
      >
        Check answer
      </Button>
    </div>
  )
}

export default withRouter(GeneratedQuiz)

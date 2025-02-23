import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { GreenCheckbox, useNewQuizStyles } from './styles'
import { Button, FormControlLabel } from '@material-ui/core'

import { MdCheck, MdClose } from 'react-icons/md'
import { Alert, AlertTitle } from '@material-ui/lab'
import { getUserID } from '../../components/Auth'

function QuestionDetailWithCheckAnswer(question) {
  const [checkedAnswers, setCheckedAnswers] = useState([])
  const [alertContent, setAlertContent] = useState(null)

  const classes = useNewQuizStyles()

  const userId = getUserID()

  const onAnswerCheckChanged = answerId => {
    let checkedAnswersNew
    console.log('answer check changed')
    if (checkedAnswers.includes(answerId)) {
      checkedAnswersNew = checkedAnswers.filter(answer => answer !== answerId)
    } else {
      checkedAnswersNew = [...checkedAnswers, answerId]
    }
    setCheckedAnswers(checkedAnswersNew)
  }

  function checkAnswer() {
    let isCorrect = true
    if (checkedAnswers.length === 0) {
      isCorrect = false
    }
    question.question.hasPredefinedAnswer.forEach(answer => {
      if (
        (checkedAnswers.includes(answer._id) && answer.correct === false) ||
        (!checkedAnswers.includes(answer._id) && answer.correct === true)
      ) {
        isCorrect = false
      }
    })
    if (isCorrect) {
      console.log('correct')
      setAlertContent(
        <Alert icon={<MdCheck />} severity="success">
          <AlertTitle>Correct</AlertTitle>
        </Alert>
      )
    } else {
      setAlertContent(
        <Alert icon={<MdClose />} severity="error">
          <AlertTitle>Incorrect</AlertTitle>
        </Alert>
      )
    }
    return isCorrect
  }

  let questionContent
  const renderedAnswers = question.question.hasPredefinedAnswer.map(answer => {
    return (
      <div key={answer._id}>
        <FormControlLabel
          style={{ width: 'fit-content' }}
          control={<GreenCheckbox />}
          label={answer.text}
          defaultChecked={false}
          checked={checkedAnswers.includes(answer._id)}
          onChange={() => onAnswerCheckChanged(answer._id)}
        />
        {answer.image ? (
          <img style={{ maxWidth: '50%' }} src={answer.image} />
        ) : (
          ''
        )}
      </div>
    )
  })
  questionContent = (
    <div>
      <h4 style={{ marginTop: '10px', marginBottom: '10px' }}>
        {question ? question.question.text : 'no question data'}
      </h4>
      {question.question.image ? (
        <img style={{ maxWidth: '50%' }} src={question.question.image} />
      ) : (
        ''
      )}
      <div className={classes.flexColumn}>{renderedAnswers}</div>
    </div>
  )

  return (
    <div>
      {questionContent}
      <div style={{ display: 'flex' }}>{alertContent}</div>
    </div>
  )
}

export default withRouter(QuestionDetailWithCheckAnswer)

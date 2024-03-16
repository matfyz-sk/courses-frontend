import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Link, useHistory, withRouter } from 'react-router-dom'

import { Button, CircularProgress } from '@material-ui/core'

import QuestionAnswerField from './questionAnswerField'
import {
  useAddNewMultipleChoiceAnswerMutation,
  useAddNewMultipleChoiceQuestionMutation,
  useGetQuestionByIdQuery,
} from '../../services/quiz-new'
import {
  CustomTextField,
  GreenButton,
  GreenCircularProgress,
  useNewQuizStyles,
} from './styles'
import { DATA_PREFIX } from '../../constants/ontology'
import { Alert } from '@material-ui/lab'
import { QUIZNEW } from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import { getUser, getUserID } from '../../components/Auth' // TODO lepsi sposob ziskavania userID

function AddQuestionForm({ match, courseId }) {
  let randomId = crypto.randomUUID()

  const [questionText, setQuestionText] = useState('')
  const [answerFields, setAnswerFields] = useState([
    {
      key: randomId,
      id: randomId,
      answerText: '',
      correct: false,
    },
  ])

  const [errors, setErrors] = useState({
    emptyQuestionText: false,
    emptyTopic: false,
    emptyAnswerText: [],
    noCorrectAnswer: false,
    noAnswers: false,
  })

  const userId = getUserID()
  const classes = useNewQuizStyles()
  const history = useHistory()

  const onQuestionTextChanged = e => setQuestionText(e.target.value)

  const [addNewQuestion, { isError, isLoading, isSuccess }] =
    useAddNewMultipleChoiceQuestionMutation()
  const [addNewAnswer] = useAddNewMultipleChoiceAnswerMutation()

  function onAddAnswerButtonClicked() {
    let randomId = crypto.randomUUID()
    let newKey = answerFields.length
    setAnswerFields([
      ...answerFields,
      {
        key: newKey,
        id: randomId,
        answerText: '',
        correct: false,
      },
    ])
  }

  function validateForm() {
    const errorsNew = {
      emptyQuestionText: false,
      emptyTopic: false,
      emptyAnswerText: [],
      noCorrectAnswer: false, // should this be an error or not idk
      noAnswers: false,
    }
    if (questionText.trim() === '') {
      errorsNew.emptyQuestionText = true
    } else if (answerFields.length === 0) {
      errorsNew.noAnswers = true
    } else if (
      answerFields.every(answerField => answerField.correct === false)
    ) {
      errorsNew.noCorrectAnswer = true
    }
    answerFields.forEach(answerField => {
      if (answerField.answerText.trim() === '') {
        errorsNew.emptyAnswerText.push(answerField.id)
      }
    })

    const isValid =
      errorsNew.emptyQuestionText === false &&
      errorsNew.emptyTopic === false &&
      errorsNew.emptyAnswerText.length === 0 &&
      errorsNew.noCorrectAnswer === false &&
      errorsNew.noAnswers === false
    setErrors(errorsNew)

    if (isValid) {
      submitForm()
    } else {
      console.log(errors)
    }
  }

  const submitForm = async () => {
    let answerIdsStringified = '['
    const answersToSubmit = answerFields.map(answerField => {
      return {
        text: answerField.answerText,
        correct: answerField.correct,
      }
    })
    for (const answer of answersToSubmit) {
      const result = await addNewAnswer(answer)
      if (result) {
        answerIdsStringified += `"${result.data}", `
      }
    }
    answerIdsStringified += ']'
    const questionToSubmit = {
      text: questionText,
      courseInstance: `${DATA_PREFIX}courseInstance/${courseId}`,
      hasPredefinedAnswer: answerIdsStringified,
    }
    const result = await addNewQuestion({
      body: questionToSubmit,
      userId: userId,
    })
    if (!result.error) {
      setTimeout(
        () =>
          history.push(
            redirect(QUIZNEW, [{ key: 'course_id', value: courseId }])
          ),
        2000
      )
    }
  }

  function deleteAnswer(answerId) {
    setAnswerFields(answerFields.filter(item => item.id !== answerId))
  }

  function changeAnswerText(answerId, text) {
    const newAnswerFields = answerFields.map(answerField => {
      if (answerField.id === answerId) {
        return {
          ...answerField,
          answerText: text,
        }
      } else {
        return answerField
      }
    })
    setAnswerFields(newAnswerFields)
  }

  function changeAnswerCorrect(answerId, correctValue) {
    const newAnswerFields = answerFields.map(answerField => {
      if (answerField.id === answerId) {
        return {
          ...answerField,
          correct: correctValue,
        }
      } else {
        return answerField
      }
    })
    setAnswerFields(newAnswerFields)
  }

  const renderedAnswerFields = answerFields.map(item => (
    <QuestionAnswerField
      error={errors.emptyAnswerText.includes(item.id)}
      key={item.key}
      onDeleteButtonClicked={() => deleteAnswer(item.id)}
      onTextChanged={text => changeAnswerText(item.id, text)}
      onCorrectChanged={correctValue =>
        changeAnswerCorrect(item.id, correctValue)
      }
    />
  ))

  let alertContent
  if (isSuccess) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="success">
        Your question was submitted successfully.
      </Alert>
    )
  } else if (errors.emptyQuestionText || errors.emptyAnswerText.length) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="error">
        Your question couldn't be submitted. Make sure all fields are filled in.
      </Alert>
    )
  } else if (errors.noCorrectAnswer) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="error">
        At least one answer must be correct.
      </Alert>
    )
  } else if (errors.noAnswers) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="error">
        Your question must contain at least one answer.
      </Alert>
    )
  } else if (isError) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="error">
        There was an error while submitting the question. Please try again.
      </Alert>
    )
  }

  return (
    <section className={classes.container}>
      <Link
        to={redirect(QUIZNEW, [{ key: 'course_id', value: courseId }])}
        className="btn btn-outline-success mb-2"
      >
        Back
      </Link>
      <h2>Add New Question</h2>
      <CustomTextField
        error={errors.emptyQuestionText}
        helperText={
          errors.emptyQuestionText ? 'Question text cannot be empty' : false
        }
        className={classes.questionTextField}
        label="Question text"
        variant="outlined"
        size="small"
        onChange={onQuestionTextChanged}
      />
      <div className={classes.questionAnswers}>
        <h3>Answers</h3>
        {renderedAnswerFields}
        <GreenButton
          className={classes.addAnswerButton}
          onClick={onAddAnswerButtonClicked}
        >
          Add Answer
        </GreenButton>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <GreenButton
          style={{ marginBottom: '10px' }}
          onClick={validateForm}
          disabled={isLoading}
        >
          Submit Question
        </GreenButton>
        {isLoading ? <GreenCircularProgress /> : ''}
      </div>
      {alertContent}
    </section>
  )
}

export default withRouter(AddQuestionForm)

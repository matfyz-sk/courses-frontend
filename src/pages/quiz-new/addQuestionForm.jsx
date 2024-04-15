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
import { getUser, getUserID } from '../../components/Auth'
import { Prompt } from 'react-router'
import { escapeText } from './helperFunctions' // TODO lepsi sposob ziskavania userID

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
    lessThanTwoAnswers: false,
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const userId = getUserID()
  const classes = useNewQuizStyles()
  const history = useHistory()

  const onQuestionTextChanged = e => {
    setQuestionText(e.target.value)
    setHasUnsavedChanges(true)
  }

  const [addNewQuestion, { isError, isLoading, isSuccess }] =
    useAddNewMultipleChoiceQuestionMutation()
  const [addNewAnswer, { isAnswerError }] =
    useAddNewMultipleChoiceAnswerMutation()

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
    setHasUnsavedChanges(true)
  }

  function validateForm() {
    const errorsNew = {
      emptyQuestionText: false,
      emptyTopic: false,
      emptyAnswerText: [],
      noCorrectAnswer: false,
      lessThanTwoAnswers: false,
    }
    if (questionText.trim() === '') {
      errorsNew.emptyQuestionText = true
    } else if (answerFields.length < 2) {
      errorsNew.lessThanTwoAnswers = true
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
      errorsNew.lessThanTwoAnswers === false
    setErrors(errorsNew)

    if (isValid) {
      submitForm()
    } else {
      console.log(errors)
    }
  }

  let answerSubmitError = false
  const submitForm = async () => {
    let answerIdsStringified = '['
    const answersToSubmit = answerFields.map(answerField => {
      return {
        text: escapeText(answerField.answerText),
        correct: answerField.correct,
      }
    })

    for (const answer of answersToSubmit) {
      const result = await addNewAnswer(answer)
      if (result.error) {
        answerSubmitError = true
      } else if (result) {
        answerIdsStringified += `"${result.data}", `
      }
    }
    answerIdsStringified += ']'
    if (!answerSubmitError) {
      const questionToSubmit = {
        text: escapeText(questionText),
        courseInstance: `${DATA_PREFIX}courseInstance/${courseId}`,
        hasPredefinedAnswer: answerIdsStringified,
      }
      const result = await addNewQuestion({
        body: questionToSubmit,
        userId: userId,
      })
      if (!result.error) {
        setHasUnsavedChanges(false)
        setTimeout(
          () =>
            history.push(
              redirect(QUIZNEW, [{ key: 'course_id', value: courseId }])
            ),
          2000
        )
      }
    }
  }

  function deleteAnswer(answerId) {
    setAnswerFields(answerFields.filter(item => item.id !== answerId))
    setHasUnsavedChanges(true)
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
    setHasUnsavedChanges(true)
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
    setHasUnsavedChanges(true)
  }

  const renderedAnswerFields = answerFields.map(item => (
    <QuestionAnswerField
      multiline
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
  } else if (errors.lessThanTwoAnswers) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="error">
        Your question must contain at least two answers.
      </Alert>
    )
  } else if (isError || answerSubmitError) {
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
        multiline
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
      {
        <Prompt
          when={hasUnsavedChanges}
          message="You have unsaved changes. Are you sure you want to leave?"
        />
      }
    </section>
  )
}

export default withRouter(AddQuestionForm)

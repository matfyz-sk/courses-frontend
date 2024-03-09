import React, { useEffect, useState } from 'react'

import { useHistory, withRouter } from 'react-router-dom'

import { Button } from '@material-ui/core'

import QuestionAnswerField from './questionAnswerField'
import {
  useAddNewMultipleChoiceAnswerMutation,
  useAddNewMultipleChoiceQuestionMutation,
  useSetHasNewerVersionMutation,
  useGetQuestionByIdQuery,
} from '../../services/quiz-new'
import { CustomTextField, GreenButton, useNewQuizStyles } from './styles'
import { DATA_PREFIX } from '../../constants/ontology'
import { Alert } from '@material-ui/lab'
import { QUIZNEW } from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import { getUser, getUserID } from '../../components/Auth' // TODO lepsi sposob ziskavania userID

function EditQuestionForm({ match, courseId }) {
  const [questionText, setQuestionText] = useState('')
  const [answerFields, setAnswerFields] = useState([])

  const questionId = match.params.question_id
  let longQuestionId = `${DATA_PREFIX}questionwithpredefinedanswer/${questionId}`
  let longCourseId = `${DATA_PREFIX}courseInstance/${courseId}`

  const {
    data: questionData,
    isSuccess,
    isError,
    isLoading,
  } = useGetQuestionByIdQuery({
    courseInstanceId: longCourseId,
    questionId: longQuestionId,
  })

  const [submitNewQuestionVersion, { isSubmitError, isSubmitSuccess }] =
    useAddNewMultipleChoiceQuestionMutation()
  const [addNewAnswer] = useAddNewMultipleChoiceAnswerMutation()

  if (isSuccess && !questionText) {
    setQuestionText(questionData.text)
  }

  if (isSuccess && answerFields.length === 0) {
    const existingAnswers = []
    questionData.hasPredefinedAnswer.forEach(answer => {
      let answerObject = {
        key: answer._id,
        id: answer._id,
        answerText: answer.text,
        correct: answer.correct,
      }
      existingAnswers.push(answerObject)
    })
    setAnswerFields(existingAnswers)
  }

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
    if (questionText === '') {
      errorsNew.emptyQuestionText = true
    } else if (answerFields.length === 0) {
      errorsNew.noAnswers = true
    } else if (
      answerFields.every(answerField => answerField.correct === false)
    ) {
      errorsNew.noCorrectAnswer = true
    }
    answerFields.forEach(answerField => {
      if (answerField.answerText === '') {
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
      courseInstance: longCourseId,
      hasPredefinedAnswer: answerIdsStringified,
      previous: longQuestionId,
    }
    const result = await submitNewQuestionVersion({
      body: questionToSubmit,
      userId: userId,
    })
    if (!result.error) {
      history.push(redirect(QUIZNEW, [{ key: 'course_id', value: courseId }]))
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
      defaultTextValue={item.answerText}
      defaultCheckedValue={item.correct}
    />
  ))

  let alertContent
  if (isSubmitSuccess) {
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
  } else if (isSubmitError) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="error">
        There was an error while submitting the question. Please try again.
      </Alert>
    )
  }

  return (
    <section className={classes.container}>
      <h2>New Question Version</h2>
      <CustomTextField
        error={errors.emptyQuestionText}
        helperText={
          errors.emptyQuestionText ? 'Question text cannot be empty' : false
        }
        value={questionText}
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
      <GreenButton style={{ marginBottom: '10px' }} onClick={validateForm}>
        Submit New Version
      </GreenButton>
      {alertContent}
    </section>
  )
}

export default withRouter(EditQuestionForm)

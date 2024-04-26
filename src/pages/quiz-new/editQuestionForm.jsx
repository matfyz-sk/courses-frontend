import React, { useEffect, useState } from 'react'

import { Link, useHistory, withRouter } from 'react-router-dom'

import { Button, CircularProgress, Input } from '@material-ui/core'

import QuestionAnswerField from './questionAnswerField'
import {
  useAddNewMultipleChoiceAnswerMutation,
  useAddNewMultipleChoiceQuestionMutation,
  useSetHasNewerVersionMutation,
  useGetQuestionByIdQuery,
} from '../../services/quiz-new'
import {
  CustomTextField,
  GreenButton,
  GreenCircularProgress,
  GreenIconButton,
  useNewQuizStyles,
} from './styles'
import { DATA_PREFIX } from '../../constants/ontology'
import { Alert } from '@material-ui/lab'
import { QUIZ_QUESTION_DETAIL_NEW, QUIZNEW } from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import { getUser, getUserID } from '../../components/Auth'
import {
  base64dataToFile,
  fileToBase64,
  getShortID,
} from '../../helperFunctions'
import { Prompt } from 'react-router'
import { escapeText } from './helperFunctions'
import ImagePreview from './ImagePreview'
import { MdImage } from 'react-icons/md' // TODO lepsi sposob ziskavania userID

function EditQuestionForm({ match, courseId }) {
  const [questionText, setQuestionText] = useState(null)
  const [answerFields, setAnswerFields] = useState(null)
  const [file, setFile] = useState(null)
  const [answersLoaded, setAnswersLoaded] = useState(false)
  const [questionLoaded, setQuestionLoaded] = useState(false)
  const [fileLoaded, setFileLoaded] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const questionId = match.params.question_id
  let longQuestionId = `${DATA_PREFIX}questionwithpredefinedanswer/${questionId}`
  let longCourseId = `${DATA_PREFIX}courseInstance/${courseId}`

  const MAX_FILE_SIZE = 1024 * 1024
  const MAX_FILE_SIZE_BEFORE_BASE64 = 3 * (MAX_FILE_SIZE / 4)

  const {
    data: questionData,
    isSuccess,
    isError,
    isLoading,
  } = useGetQuestionByIdQuery({
    courseInstanceId: longCourseId,
    questionId: longQuestionId,
  })

  const [
    submitNewQuestionVersion,
    {
      isError: isSubmitError,
      isSuccess: isSubmitSuccess,
      isLoading: isSubmitLoading,
    },
  ] = useAddNewMultipleChoiceQuestionMutation()
  const [addNewAnswer] = useAddNewMultipleChoiceAnswerMutation()

  if (isSuccess && questionText === null) {
    setQuestionText(questionData.text)
    setQuestionLoaded(true)
  }

  if (isSuccess && answerFields === null) {
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
    setAnswersLoaded(true)
  }

  if (isSuccess && fileLoaded === false) {
    if (questionData.image) {
      let convertedFile = base64dataToFile(questionData.image).then(result => {
        setFile(result)
        setFileLoaded(true)
      })
    }
  }

  const [errors, setErrors] = useState({
    emptyQuestionText: false,
    emptyTopic: false,
    emptyAnswerText: [],
    noCorrectAnswer: false,
    lessThanTwoAnswers: false,
    fileTooBigError: false,
  })

  const userId = getUserID()
  const classes = useNewQuizStyles()
  const history = useHistory()

  const onQuestionTextChanged = e => {
    setQuestionText(e.target.value)
    setHasUnsavedChanges(true)
  }
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

  const handleFileChange = e => {
    console.log(e.target.files)
    setFile(e.target.files[0])
    setHasUnsavedChanges(true)
  }

  const handleImageDelete = () => {
    URL.revokeObjectURL(file)
    setFile(null)
  }

  function validateForm() {
    setHasUnsavedChanges(false)
    const errorsNew = {
      emptyQuestionText: false,
      emptyTopic: false,
      emptyAnswerText: [],
      noCorrectAnswer: false, // should this be an error or not idk
      lessThanTwoAnswers: false,
      fileTooBigError: false,
    }
    if (questionText.trim() === '') {
      errorsNew.emptyQuestionText = true
    } else if (answerFields.length < 2) {
      errorsNew.lessThanTwoAnswers = true
    } else if (
      answerFields.every(answerField => answerField.correct === false)
    ) {
      errorsNew.noCorrectAnswer = true
    } else if (file && file.size > MAX_FILE_SIZE_BEFORE_BASE64) {
      errorsNew.fileTooBigError = true
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
      errorsNew.lessThanTwoAnswers === false &&
      errorsNew.fileTooBigError === false
    setErrors(errorsNew)

    if (isValid) {
      submitForm()
    } else {
      console.log(errors)
      setHasUnsavedChanges(true)
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
      let base64File = ''
      if (file) {
        base64File = await fileToBase64(file)
      }
      const questionToSubmit = {
        text: escapeText(questionText),
        courseInstance: longCourseId,
        hasPredefinedAnswer: answerIdsStringified,
        previous: longQuestionId,
        image: base64File,
      }
      const result = await submitNewQuestionVersion({
        body: questionToSubmit,
        userId: userId,
      })
      if (!result.error) {
        history.push({
          pathname: redirect(QUIZ_QUESTION_DETAIL_NEW, [
            { key: 'course_id', value: courseId },
            {
              key: 'question_id',
              value: getShortID(
                result.data.QuestionWithPredefinedAnswer[0]._id
              ),
            },
          ]),
          state: {
            hasNewerVersion: false,
          },
        })
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

  let renderedAnswerFields = ''

  if (answerFields) {
    renderedAnswerFields = answerFields.map(item => (
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
        inputId={crypto.randomUUID()}
      />
    ))
  }

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
  } else if (errors.lessThanTwoAnswers) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="error">
        Your question must contain at least two answers.
      </Alert>
    )
  } else if (isSubmitError || answerSubmitError) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="error">
        There was an error while submitting the question. Please try again.
      </Alert>
    )
  }

  return (
    <section className={classes.container}>
      <Link
        to={{
          pathname: redirect(QUIZ_QUESTION_DETAIL_NEW, [
            { key: 'course_id', value: courseId },
            {
              key: 'question_id',
              value: questionId,
            },
          ]),
          state: {
            hasNewerVersion: false,
          },
        }}
        className="btn btn-outline-success mb-2"
      >
        Back
      </Link>
      <h2>New Question Version</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }}
      >
        <CustomTextField
          multiline
          error={errors.emptyQuestionText}
          helperText={
            errors.emptyQuestionText ? 'Question text cannot be empty' : false
          }
          value={questionText || ''}
          className={classes.questionTextField}
          label="Question text"
          variant="outlined"
          size="small"
          onChange={onQuestionTextChanged}
        />
        <Input
          accept="image/*"
          style={{ display: 'none' }}
          id="question-text-picture"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="question-text-picture">
          <GreenIconButton aria-label="upload picture" component="span">
            <MdImage />
          </GreenIconButton>
        </label>
      </div>

      {file && (
        <>
          <ImagePreview
            src={URL.createObjectURL(file)}
            handleDelete={handleImageDelete}
          />
        </>
      )}
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
          style={{ marginBottom: '10px', marginRight: '10px' }}
          onClick={validateForm}
          disabled={isSubmitLoading}
        >
          Submit New Version
        </GreenButton>
        {isSubmitLoading ? <GreenCircularProgress /> : ''}
      </div>
      {alertContent}
      <Prompt
        when={hasUnsavedChanges}
        message="You have unsaved changes. Are you sure you want to leave?"
      />
    </section>
  )
}

export default withRouter(EditQuestionForm)

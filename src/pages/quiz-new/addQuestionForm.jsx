import React, { useState } from 'react'
import { Link, useHistory, withRouter } from 'react-router-dom'
import QuestionAnswerField from './questionAnswerField'
import {
  useAddNewMultipleChoiceAnswerMutation,
  useAddNewMultipleChoiceQuestionMutation,
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
import { QUIZNEW } from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import { getUserID } from '../../components/Auth'
import { Prompt } from 'react-router'
import { escapeText } from './helperFunctions'
import { fileToBase64 } from '../../helperFunctions'
import { IconButton, Input } from '@material-ui/core'
import { MdImage } from 'react-icons/md'
import ImagePreview from './ImagePreview'
// TODO lepsi sposob ziskavania userID

const MAX_FILE_SIZE = 1024 * 1024
const MAX_FILE_SIZE_BEFORE_BASE64 = 3 * (MAX_FILE_SIZE / 4)

function AddQuestionForm({ match, courseId }) {
  let randomId = crypto.randomUUID()
  const [file, setFile] = useState(null)
  const [rawContent, setRawContent] = useState(null)
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
    fileTooBigError: false,
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const userId = getUserID()
  const classes = useNewQuizStyles()
  const history = useHistory()

  const onQuestionTextChanged = e => {
    setQuestionText(e.target.value)
    setHasUnsavedChanges(true)
  }

  const handleFileChange = e => {
    console.log(e.target.files)
    setRawContent(e.target.files[0])
    setFile(e.target.files[0])
  }

  const handleImageDelete = () => {
    setRawContent(null)
    URL.revokeObjectURL(file)
    setFile(null)
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
      let base64ToSubmit = ''
      await fileToBase64(rawContent).then(result => {
        console.log(result)
        base64ToSubmit = result
        console.log(base64ToSubmit)
      })
      const questionToSubmit = {
        text: escapeText(questionText),
        courseInstance: `${DATA_PREFIX}courseInstance/${courseId}`,
        hasPredefinedAnswer: answerIdsStringified,
        image: base64ToSubmit,
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
  } else if (errors.fileTooBigError) {
    alertContent = (
      <Alert style={{ width: 'fit-content' }} severity="error">
        The size of images must be less than 750kB.
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
          <Alert style={{ width: 'fit-content' }} severity="info">
            Image files must be under 750kB.
          </Alert>
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

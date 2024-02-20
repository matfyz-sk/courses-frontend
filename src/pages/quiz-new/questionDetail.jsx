import React, { useState } from 'react'
import { redirect } from '../../constants/redirect'
import { EDIT_QUESTION_NEW, QUIZNEW } from '../../constants/routes'
import { Link, withRouter } from 'react-router-dom'
import {
  baseTheme,
  CustomTextField,
  GreenCheckbox,
  useNewQuizStyles,
} from './styles'
import {
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
} from '@material-ui/core'
import CommentComponent from './commentComponent'

import { MdCheck, MdClose, MdSend } from 'react-icons/md'
import { useGetQuestionByIdQuery } from '../../services/quiz-new'
import { DATA_PREFIX } from '../../constants/ontology'
import { Alert, AlertTitle } from '@material-ui/lab'
import { getUserID } from '../../components/Auth'

function QuestionDetail({ courseId, match }) {
  const [checkedAnswers, setCheckedAnswers] = useState([])

  const [alertContent, setAlertContent] = useState(null)

  const classes = useNewQuizStyles()
  const questionId = match.params.question_id

  const userId = getUserID()
  console.log(userId)

  const longQuestionId = `${DATA_PREFIX}questionwithpredefinedanswer/${questionId}`
  const longCourseId = `${DATA_PREFIX}courseInstance/${courseId}`

  const {
    data: questionData,
    isLoading,
    isSuccess,
    isError,
  } = useGetQuestionByIdQuery({
    courseInstanceId: longCourseId,
    questionId: longQuestionId,
  })

  const onAnswerCheckChanged = answerId => {
    let checkedAnswersNew
    if (checkedAnswers.includes(answerId)) {
      checkedAnswersNew = checkedAnswers.filter(answer => answer !== answerId)
    } else {
      checkedAnswersNew = [...checkedAnswers, answerId]
    }
    setCheckedAnswers(checkedAnswersNew)
  }

  function checkAnswer(checkedAnswers) {
    let isCorrect = true
    if (checkedAnswers.length === 0) {
      isCorrect = false
    }
    questionData.hasPredefinedAnswer.forEach(answer => {
      if (
        (checkedAnswers.includes(answer._id) && answer.correct === false) ||
        (!checkedAnswers.includes(answer._id) && answer.correct === true)
      ) {
        isCorrect = false
      }
    })
    if (isCorrect) {
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
  if (isLoading) {
    questionContent = <CircularProgress />
  } else if (isSuccess) {
    console.log(questionData)
    const renderedAnswers = questionData.hasPredefinedAnswer.map(answer => {
      return (
        <FormControlLabel
          style={{ width: 'fit-content' }}
          key={crypto.randomUUID()}
          control={<GreenCheckbox />}
          label={answer.text}
          defaultChecked={false}
          checked={checkedAnswers.includes(answer._id)}
          onChange={() => onAnswerCheckChanged(answer._id)}
        />
      )
    })
    questionContent = (
      <div>
        <h3 style={{ marginTop: '10px', marginBottom: '10px' }}>
          {questionData ? questionData.text : 'no question data'}
        </h3>
        <div className={classes.flexColumn}>{renderedAnswers}</div>
      </div>
    )
  } else if (isError) {
    questionContent = <div>There was an error while loading the question.</div>
  }

  const testComments = [
    {
      commentAuthor: 'Frog Lover',
      commentText: 'Man I Love Frogs',
      replies: [
        {
          commentAuthor: 'Frog Hater',
          commentText: 'No they are slippery and gross and weird ew >:(',
        },
      ],
    },
    {
      commentAuthor: 'Anne Shirley',
      commentText:
        'Isn’t it nice to think that tomorrow is a new day with no mistakes in it yet.',
      replies: [],
    },
    {
      commentAuthor: 'Gilbert Blythe',
      commentText:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      replies: [],
    },
  ]

  function renderComments(comments) {
    const renderedComments = []
    comments.forEach(comment => {
      renderedComments.push(
        <CommentComponent
          key={crypto.randomUUID()}
          isReply={false}
          commentAuthor={comment.commentAuthor}
          commentContent={comment.commentText}
        />
      )
      if (comment.replies) {
        comment.replies.forEach(reply => {
          renderedComments.push(
            <CommentComponent
              isReply={true}
              key={crypto.randomUUID()}
              commentAuthor={reply.commentAuthor}
              commentContent={reply.commentText}
            />
          )
        })
      }
    })
    return renderedComments
  }

  const comments = renderComments(testComments)

  return (
    <div className={classes.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link
          to={redirect(QUIZNEW, [{ key: 'course_id', value: courseId }])}
          className="btn btn-outline-success mb-2"
        >
          Back
        </Link>
        <Link
          to={redirect(EDIT_QUESTION_NEW, [
            { key: 'course_id', value: courseId },
            { key: 'question_id', value: questionId },
          ])}
          className="btn btn-success mb-2"
        >
          Edit question
        </Link>
      </div>
      {questionContent}
      <div style={{ display: 'flex' }}>
        <Button
          variant="contained"
          startIcon={<MdCheck />}
          onClick={() => checkAnswer(checkedAnswers)}
        >
          Check answer
        </Button>
        {alertContent}
      </div>
      <h3>Comments</h3>
      {comments}
      <div style={{ display: 'flex' }}>
        <CustomTextField
          placeholder="Add a comment..."
          variant="outlined"
          fullWidth
        />
        <IconButton aria-label="send comment" style={{ flexShrink: 0 }}>
          <MdSend />
        </IconButton>
      </div>
    </div>
  )
}

export default withRouter(QuestionDetail)

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { redirect } from '../../constants/redirect'
import {
  EDIT_QUESTION_NEW,
  QUIZ_QUESTION_DETAIL_NEW,
  QUIZNEW,
} from '../../constants/routes'
import { Link, withRouter, useLocation, useHistory } from 'react-router-dom'
import {
  baseTheme,
  CustomTextField,
  GreenCheckbox,
  GreenCircularProgress,
  useNewQuizStyles,
} from './styles'
import { Button, Chip } from '@material-ui/core'
import CommentComponent from './commentComponent'

import { MdCheck, MdClose, MdDelete, MdSend } from 'react-icons/md'
import {
  useAddNewCommentMutation,
  useDeleteQuestionMutation,
  useGetQuestionByIdQuery,
  useUpdateQuestionMutation,
} from '../../services/quiz-new'
import { DATA_PREFIX } from '../../constants/ontology'
import { getUserID } from '../../components/Auth'
import { getShortID } from '../../helperFunctions'
import { escapeText } from './helperFunctions'

function QuestionDetail({ courseId, match, isTeacher }) {
  const classes = useNewQuizStyles()
  const questionId = match.params.question_id

  const location = useLocation()
  const hasNewerVersion = location.state ? location.state.hasNewerVersion : true

  const [commentText, setCommentText] = useState('')
  const [commentError, setCommentError] = useState('')

  const [
    addNewComment,
    {
      isSuccess: isAddCommentSuccess,
      isError: isAddCommentError,
      isLoading: isAddCommentLoading,
    },
  ] = useAddNewCommentMutation()

  const [
    updateQuestion,
    {
      isSuccess: isInsertCommentSuccess,
      isError: isInsertCommentError,
      isLoading: isInsertCommentLoading,
    },
  ] = useUpdateQuestionMutation()

  const [
    deleteQuestion,
    { isSuccess: isDeleteSuccess, isError: isDeleteError },
  ] = useDeleteQuestionMutation()

  const userId = getUserID()

  const history = useHistory()

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

  async function submitComment(commentText) {
    if (commentText.trim() === '') {
      setCommentError('Comment cannot be empty')
    } else {
      const escapedText = escapeText(commentText)
      const commentToSubmit = {
        commentText: escapedText,
        commentCreatedBy: userId,
      }
      let result = await addNewComment({
        commentBody: commentToSubmit,
      })
      let addedComment
      if (!result.error) {
        let commentIdsString = '['
        for (const comment of questionData.comment) {
          commentIdsString += `"${comment._id}", `
        }
        commentIdsString += `"${result.data}"]`
        addedComment = await updateQuestion({
          questionId: longQuestionId,
          questionBody: {
            comments: commentIdsString,
          },
        })
        if (!addedComment.error) {
          setCommentText('')
          setCommentError('')
        }
      }
      if (result.error || addedComment.error) {
        setCommentError(
          'There was an error submitting your comment. Please try again.'
        )
      }
    }
  }

  async function handleApprove() {
    let result = await updateQuestion({
      questionId: longQuestionId,
      questionBody: {
        approver: userId,
      },
    })
    if (!result.error) {
      console.log(result)
    }
  }

  async function handleDelete(questionId) {
    if (
      window.confirm(
        'Are you sure you want to delete this question version? Previous versions will not be affected.'
      )
    ) {
      let result = await deleteQuestion(questionId)
      if (!result.error && !isDeleteError) {
        history.push(redirect(QUIZNEW, [{ key: 'course_id', value: courseId }]))
      } else {
        window.confirm(
          'There was an issue while deleting the question. Please try again'
        )
      }
    }
  }

  let questionContent
  let comments
  let prevVersionButton = ''
  let editButton = ''
  let deleteButton = ''
  let approvedInfo = ''
  let author = ''
  let imageElement = ''
  let questionAuthorName
  if (isLoading) {
    questionContent = <GreenCircularProgress />
  } else if (isSuccess) {
    if (!questionData.questionSubmittedBy) {
      questionAuthorName = 'Unknown'
    } else {
      if (questionData.questionSubmittedBy.nickname) {
        questionAuthorName = questionData.questionSubmittedBy.nickname
      } else {
        questionAuthorName = `${questionData.questionSubmittedBy.firstName} ${questionData.questionSubmittedBy.lastName}`
      }
    }
    author = (
      <p style={{ color: 'gray', fontSize: '0.8em' }}>
        {`Submitted by ${questionAuthorName}`}
      </p>
    )

    const renderedAnswers = questionData.hasPredefinedAnswer.map(answer => {
      let icon
      if (answer.correct) {
        icon = <MdCheck style={{ color: baseTheme.palette.primary.main }} />
      } else {
        icon = <MdClose style={{ color: 'red' }} />
      }
      return (
        <div
          key={crypto.randomUUID()}
          style={{
            display: 'flex',
            alignItems: 'center',
            columnGap: '10px',
            fontSize: '1.2em',
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
          }}
        >
          {icon}
          <span style={{ whiteSpace: 'pre-wrap' }}>{answer.text}</span>
        </div>
      )
    })

    if (questionData.image) {
      imageElement = (
        <img style={{ maxWidth: '60%' }} src={questionData.image} />
      )
    }

    comments = renderComments(questionData.comment)
    questionContent = (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '10px 0', whiteSpace: 'pre-wrap' }}>
          {questionData ? questionData.text : 'no question data'}
        </h3>
        {imageElement}
        <div className={classes.flexColumn}>{renderedAnswers}</div>
        {author}
      </div>
    )

    if (questionData.previous) {
      prevVersionButton = (
        <Link
          style={{ justifyContent: 'flex-end ' }}
          to={{
            pathname: redirect(QUIZ_QUESTION_DETAIL_NEW, [
              { key: 'course_id', value: courseId },
              {
                key: 'question_id',
                value: getShortID(questionData.previous._id),
              },
            ]),
            state: {
              hasNewerVersion: true,
            },
          }}
          className="btn btn-outline-success mb-2"
        >
          View previous version
        </Link>
      )
    }

    if (
      !hasNewerVersion &&
      ((questionData.questionSubmittedBy &&
        userId === questionData.questionSubmittedBy._id) ||
        isTeacher)
    ) {
      editButton = (
        <Link
          to={redirect(EDIT_QUESTION_NEW, [
            { key: 'course_id', value: courseId },
            { key: 'question_id', value: questionId },
          ])}
          className="btn btn-success mb-2"
        >
          Edit question
        </Link>
      )
    }

    if (
      !hasNewerVersion &&
      ((questionData.questionSubmittedBy &&
        userId === questionData.questionSubmittedBy._id) ||
        isTeacher)
    ) {
      deleteButton = (
        <Button
          startIcon={<MdDelete />}
          color="secondary"
          onClick={() => handleDelete(questionData._id)}
        >
          Delete question
        </Button>
      )
    }

    if (isTeacher && !questionData.approver) {
      approvedInfo = (
        <Button
          variant="contained"
          disableElevation
          startIcon={<MdCheck />}
          onClick={handleApprove}
        >
          Approve question
        </Button>
      )
    } else if (questionData.approver) {
      approvedInfo = (
        <Chip
          size="small"
          label="This question version has been approved by a teacher."
        />
      )
    }
  } else if (isError) {
    questionContent = <div>There was an error while loading the question.</div>
  }

  function renderComments(comments) {
    const renderedComments = []
    comments.forEach(comment => {
      renderedComments.push(
        <CommentComponent
          key={crypto.randomUUID()}
          isReply={false}
          commentAuthor={comment.commentCreatedBy}
          commentTimestamp={comment.createdAt.millis}
          commentContent={comment.commentText}
          commentId={comment._id}
          isLoading={isAddCommentLoading || isInsertCommentLoading}
        />
      )
      if (comment.replies) {
        comment.replies.forEach(reply => {
          renderedComments.push(
            <CommentComponent
              isReply={true}
              key={crypto.randomUUID()}
              commentAuthor={reply.commentAuthor}
              commentTimestamp={comment.createdAt.millis}
              commentContent={reply.commentText}
              commentId={comment._id}
              isLoading={isAddCommentLoading || isInsertCommentLoading}
            />
          )
        })
      }
    })
    return renderedComments
  }

  return (
    <div className={classes.container}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Link
          to={redirect(QUIZNEW, [{ key: 'course_id', value: courseId }])}
          className="btn btn-outline-success mb-2"
        >
          Back
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {editButton}
          {prevVersionButton}
        </div>
      </div>

      {questionContent}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'fit-content',
          rowGap: '5px',
        }}
      >
        {approvedInfo}
        {deleteButton}
      </div>
      <h3 style={{ marginTop: '20px' }}>Comments</h3>
      {comments}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <CustomTextField
          multiline
          error={commentError !== ''}
          helperText={commentError}
          style={{}}
          placeholder="Add a comment..."
          variant="outlined"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          fullWidth
        />
        <Button
          disabled={isAddCommentLoading || isInsertCommentLoading}
          disableElevation
          style={{ marginLeft: '20px' }}
          variant="contained"
          color="default"
          className={classes.button}
          onClick={() => submitComment(commentText)}
          endIcon={<MdSend>send</MdSend>}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isTeacher: state.privilegesReducer.inCourseInstance === 'instructor',
  }
}
export default connect(mapStateToProps)(withRouter(QuestionDetail))

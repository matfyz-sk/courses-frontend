import React, { useState } from 'react'
import { connect } from 'react-redux'
import { redirect } from '../../constants/redirect'
import {
  EDIT_QUESTION_NEW,
  QUIZ_QUESTION_DETAIL_NEW,
  QUIZNEW,
} from '../../constants/routes'
import { Link, withRouter, useLocation } from 'react-router-dom'
import {
  baseTheme,
  CustomTextField,
  GreenCheckbox,
  GreenCircularProgress,
  useNewQuizStyles,
} from './styles'
import { Button, Chip } from '@material-ui/core'
import CommentComponent from './commentComponent'

import { MdCheck, MdClose, MdSend } from 'react-icons/md'
import {
  useAddNewCommentMutation,
  useGetQuestionByIdQuery,
  useUpdateQuestionMutation,
} from '../../services/quiz-new'
import { DATA_PREFIX } from '../../constants/ontology'
import { getUserID } from '../../components/Auth'
import { getShortID } from '../../helperFunctions'

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

  const userId = getUserID()

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
    if (!commentText) {
      setCommentError('Comment cannot be empty')
    } else {
      const commentToSubmit = {
        commentText: commentText,
        commentCreatedBy: userId,
      }
      let result = await addNewComment({
        questionId: longQuestionId,
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

  let questionContent
  let comments
  let prevVersionButton = ''
  let editButton = ''
  let approvedInfo = ''
  let author = ''
  if (isLoading) {
    questionContent = <GreenCircularProgress />
  } else if (isSuccess) {
    //console.log(questionData)
    author = (
      <text style={{ color: 'gray', fontSize: '0.8em' }}>
        {questionData.questionSubmittedBy
          ? `Submitted by ${questionData.questionSubmittedBy.firstName} ${questionData.questionSubmittedBy.lastName}`
          : 'Unknown'}
      </text>
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
          }}
        >
          {icon}
          {answer.text}
        </div>
      )
    })
    comments = renderComments(questionData.comment)
    questionContent = (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '10px 0' }}>
          {questionData ? questionData.text : 'no question data'}
        </h3>
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

    if (isTeacher && !questionData.approver) {
      approvedInfo = (
        <Button variant="contained" disableElevation onClick={handleApprove}>
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
          commentContent={comment.commentText}
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
              commentContent={reply.commentText}
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

      {approvedInfo}
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
import React, { useState } from 'react'

import { CustomTextField, useNewQuizStyles } from './styles'
import { MdDelete, MdEdit, MdSend } from 'react-icons/md'
import { Button, IconButton } from '@material-ui/core'
import { useUpdateCommentMutation } from '../../services/quiz-new'
import { escapeText } from './helperFunctions'
import { getUserID } from '../../components/Auth'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

function CommentComponent({
  commentAuthor,
  commentTimestamp,
  commentContent,
  commentId,
  isReply,
  isLoading,
  isTeacher,
}) {
  const classes = useNewQuizStyles()
  const [isEdit, setIsEdit] = useState(false)
  const [editingCommentContent, setEditingCommentContent] = useState('')
  const [commentError, setCommentError] = useState('')

  const [updateComment, { isSuccess, isError }] = useUpdateCommentMutation()

  const userID = getUserID()

  function validateComment(commentText) {
    if (commentText.trim() === '') {
      setCommentError('Comment cannot be empty.')
    } else {
      submitEditedComment(commentText, commentId)
    }
  }

  async function submitEditedComment(commentText, commentId) {
    const escapedText = escapeText(commentText)
    const commentToSubmit = {
      commentText: escapedText,
      commentId: commentId,
    }
    let result = await updateComment({
      commentBody: commentToSubmit,
    })
    if (result.error || isError) {
      setCommentError(
        'There was an error while submitting the comment. Please try again.'
      )
    } else {
      setIsEdit(false)
    }
  }

  let commentAuthorName
  if (!commentAuthor) {
    commentAuthorName = 'Unknown'
  } else {
    if (commentAuthor.nickname) {
      commentAuthorName = commentAuthor.nickname
    } else {
      commentAuthorName = commentAuthor.firstName + ' ' + commentAuthor.lastName
    }
  }

  const editButton = (
    <Button
      size="small"
      aria-label="edit comment"
      startIcon={<MdEdit />}
      onClick={handleEdit}
    >
      Edit
    </Button>
  )

  let renderedCommentContent
  if (isEdit) {
    renderedCommentContent = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
        }}
      >
        <CustomTextField
          multiline
          fullWidth
          style={{}}
          placeholder="Add a comment..."
          variant="outlined"
          value={editingCommentContent}
          error={commentError !== ''}
          helperText={commentError}
          onChange={e => setEditingCommentContent(e.target.value)}
        />
        <Button
          disableElevation
          style={{ marginLeft: '20px' }}
          variant="contained"
          color="default"
          className={classes.button}
          onClick={() => validateComment(editingCommentContent)}
          endIcon={<MdSend>send</MdSend>}
        >
          Send
        </Button>
      </div>
    )
  } else {
    renderedCommentContent = commentContent
  }

  function handleEdit() {
    setIsEdit(true)
    setEditingCommentContent(commentContent)
  }

  return (
    <div
      className={classes.commentBox}
      style={{
        marginLeft: isReply ? '50px' : '0',
        opacity: isLoading ? '0.5' : '1',
      }}
    >
      <div style={{ display: 'flex' }}>
        <h5 style={{ fontWeight: 'bold', marginRight: '10px' }}>
          {commentAuthorName}
        </h5>
        <span style={{ fontStyle: 'italic' }}>
          {' '}
          {new Date(commentTimestamp).toLocaleString()}{' '}
        </span>
      </div>
      <div className={classes.commentContent}>{renderedCommentContent}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {isTeacher || commentAuthor._id === userID ? editButton : ''}
        <Button
          size="small"
          aria-label="delete comment"
          startIcon={<MdDelete />}
          onClick={''}
        >
          Delete
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
export default connect(mapStateToProps)(CommentComponent)

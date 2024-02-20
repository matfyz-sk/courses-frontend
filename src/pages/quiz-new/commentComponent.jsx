import React from 'react'

import { useNewQuizStyles } from './styles'
import { HiReply } from 'react-icons/hi'

function CommentComponent({ commentAuthor, commentContent, isReply }) {
  const classes = useNewQuizStyles()

  return (
    <div
      className={classes.commentBox}
      style={{ marginLeft: isReply ? '50px' : '0' }}
    >
      <div>
        <h5 style={{ fontWeight: 'bold' }}>{commentAuthor}</h5>
      </div>
      <div className={classes.commentContent}>
        {commentContent}
        <a className={classes.commentReplyButton} href={''}>
          <HiReply />
          Reply
        </a>
      </div>
    </div>
  )
}

export default CommentComponent

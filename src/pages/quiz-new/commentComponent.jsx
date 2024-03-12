import React from 'react'

import { useNewQuizStyles } from './styles'
import { HiReply } from 'react-icons/hi'

function CommentComponent({
  commentAuthor,
  commentContent,
  isReply,
  isLoading,
}) {
  const classes = useNewQuizStyles()

  return (
    <div
      className={classes.commentBox}
      style={{
        marginLeft: isReply ? '50px' : '0',
        opacity: isLoading ? '0.5' : '1',
      }}
    >
      <div>
        <h5 style={{ fontWeight: 'bold' }}>
          {commentAuthor
            ? commentAuthor.firstName + ' ' + commentAuthor.lastName
            : 'Unknown'}
        </h5>
      </div>
      <div className={classes.commentContent}>
        {commentContent}
        {/*        <a className={classes.commentReplyButton} href={''}>
          <HiReply />
          Reply
        </a>*/}
      </div>
    </div>
  )
}

export default CommentComponent

/* eslint-disable react/prefer-stateless-function */
import React, { useState } from 'react'
import {
  FormGroup,
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
} from 'reactstrap'
import axios from 'axios'
import apiConfig from '../../../../../configuration/api'
import Comment from './comment/comment'

function Comments({ comments, questionAddress, token, refetch }) {
  const [newComment, setNewComment] = useState('')

  const onChangeNewComment = event => {
    setNewComment(event.target.value)
  }

  const onSendNewComment = () => {
    axios
      .put(
        `${apiConfig.API_URL}/${questionAddress}`,
        JSON.stringify({
          comment: [
            {
              type: 'comment',
              commentText: newComment,
            },
          ],
        }),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      )
      .then(({ status: statusQuestionAssignment }) => {
        if (statusQuestionAssignment === 200) {
          setNewComment('')
          refetch()
        }
      })
      .catch(error => console.log(error))
  }
  return (
    <>
      {comments.map(comment => {
        const { id, commentText, createdAt, createdBy } = comment
        return (
          <Comment
            key={id}
            id={id}
            commentText={commentText}
            createdAt={createdAt}
            createdBy={createdBy}
            token={token}
          />
        )
      })}
      <FormGroup color="warning">
        <InputGroup>
          <Input
            type="text"
            name="newComment"
            placeholder="Write a comment..."
            onChange={onChangeNewComment}
          />
          <InputGroupAddon addonType="append">
            <Button color="warning" onClick={onSendNewComment}>
              Send
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
    </>
  )
}

export default Comments

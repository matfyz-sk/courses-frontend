/* eslint-disable react/prefer-stateless-function */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ListGroupItem, ListGroupItemText, FormText } from 'reactstrap'
import { API_URL } from '../../../../../../../configuration/api'

function Comments({ id, commentText, createdAt, createdBy, token }) {
  const [author, setAuthor] = useState('')
  useEffect(() => {
    if (createdBy && token) {
      const fetchData = async () => {
        return axios
          .get(
            `${API_URL}/user/${createdBy.substring(
              createdBy.lastIndexOf('/') + 1
            )}`,
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: token,
              },
            }
          )
          .then(({ data }) => {
            if (
              data &&
              data['@graph'] &&
              data['@graph'].length &&
              data['@graph'].length > 0
            ) {
              data['@graph'].forEach(authorData => {
                if (authorData) {
                  const { firstName, lastName } = authorData
                  setAuthor(`${firstName} ${lastName}`)
                }
              })
            }
          })
          .catch(error => console.log(error))
      }
      fetchData()
    }
  }, [token, createdBy])
  return (
    <>
      <ListGroupItem key={id} color="warning">
        <ListGroupItemText style={{ whiteSpace: 'pre-line' }}>
          {commentText}
        </ListGroupItemText>
        {author && <FormText color="muted">{author}</FormText>}
        {createdAt && (
          <FormText color="muted">
            {new Date(createdAt).toLocaleDateString()}
          </FormText>
        )}
      </ListGroupItem>
    </>
  )
}

export default Comments

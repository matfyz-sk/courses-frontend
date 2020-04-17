/* eslint-disable react/prefer-stateless-function */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap'
import apiConfig from '../../../../../../configuration/api'

function Comments({ id, commentText, createdAt, createdBy, token }) {
  const [author, setAuthor] = useState('')
  useEffect(() => {
    if (createdBy) {
      const fetchData = async () => {
        return axios
          .get(
            `${apiConfig.API_URL}/user/${createdBy.substring(
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
        {author && <ListGroupItemHeading>{author}</ListGroupItemHeading>}
        <ListGroupItemText>{commentText}</ListGroupItemText>
        <ListGroupItemText>
          {new Date(createdAt).toLocaleDateString()}
        </ListGroupItemText>
      </ListGroupItem>
    </>
  )
}

export default Comments

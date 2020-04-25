/* eslint-disable react/prefer-stateless-function */
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ButtonDropdown,
  FormText,
} from 'reactstrap'

import { API_URL } from '../../../../../configuration/api'
import QuestionNew from '../../question/question-new'
import Comments from './comments/comments'

const enText = {
  'edit-question': 'Edit question',
  approveAs: 'Approve as',
  approveAsPublic: 'Approve as public',
  approveAsPrivate: 'Approve as private',
  approved: 'Approved',
  disapprove: 'Cancel approve',
  by: 'By',
  at: 'At',
}

function SavedQuestion({
  id,
  title,
  questionText,
  topic,
  questionType,
  answers,
  comments,
  createdBy,
  createdAt,
  isTeacher,
  changeShowEditQuestion,
  canEdit,
  canApprove,
  canApproveAsPrivate,
  isApproved,
  token,
  callback,
  userId,
  canDisapprove,
}) {
  const [toggleOpen, setToggleOpen] = useState(false)
  const [author, setAuthor] = useState('')
  const changeToggleOpen = () => {
    setToggleOpen(x => !x)
  }

  const sendApprove = visibilityIsRestricted => {
    axios
      .patch(
        `${API_URL}${id.substr(id.lastIndexOf('/', id.lastIndexOf('/') - 1))}`,
        JSON.stringify({ approver: [userId], visibilityIsRestricted }),
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
          callback()
        }
      })
      .catch(error => console.log(error))
  }

  const sendDisapprove = () => {
    axios
      .patch(
        `${API_URL}${id.substr(id.lastIndexOf('/', id.lastIndexOf('/') - 1))}`,
        JSON.stringify({ approver: [] }),
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
          //refetch
        }
      })
      .catch(error => console.log(error))
  }

  const approveAsPublic = () => {
    sendApprove(false)
  }
  const approveAsPrivate = () => {
    sendApprove(true)
  }

  useEffect(() => {
    if (createdBy && isTeacher) {
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
  }, [token, createdBy, isTeacher])

  return (
    <div className="mb-3">
      <QuestionNew
        key={id}
        metadata={() => (
          <>
            {isApproved && <h2>{enText.approved}</h2>}
            {isTeacher && (
              <>
                <FormText color="muted">{`${enText.by} ${author}`}</FormText>
                <FormText color="muted">
                  {`${enText.at} ${createdAt.toLocaleDateString()}`}
                </FormText>
              </>
            )}
          </>
        )}
        title={title}
        question={questionText}
        topic={topic}
        questionType={questionType}
        answers={answers}
        edit={changeShowEditQuestion}
        disabled
        color={isApproved ? '#ADFF2F' : null}
      >
        {canEdit && changeShowEditQuestion && (
          <Button color="success" onClick={changeShowEditQuestion}>
            {enText['edit-question']}
          </Button>
        )}
        {canApprove && canApproveAsPrivate && (
          <ButtonDropdown isOpen={toggleOpen} toggle={changeToggleOpen}>
            <DropdownToggle caret color="success">
              {enText.approveAs}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={approveAsPublic}>
                {enText.approveAsPublic}
              </DropdownItem>
              <DropdownItem onClick={approveAsPrivate}>
                {enText.approveAsPrivate}
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        )}
        {canApprove && !canApproveAsPrivate && (
          <Button color="success" onClick={approveAsPublic}>
            {enText.approveAsPublic}
          </Button>
        )}
        {canDisapprove && (
          <Button color="danger" onClick={sendDisapprove}>
            {enText.disapprove}
          </Button>
        )}
      </QuestionNew>
      <Comments
        comments={comments}
        token={token}
        questionAddress={id.substr(
          id.lastIndexOf('/', id.lastIndexOf('/') - 1)
        )}
        callback={callback}
      />
    </div>
  )
}

export default SavedQuestion

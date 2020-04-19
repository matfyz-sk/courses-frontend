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
} from 'reactstrap'

import { API_URL } from '../../../../../configuration/api'
import QuestionNew from '../../question/question-new'
import Comments from './comments/comments'

const enText = {
  'edit-question': 'Edit question',
  approveAs: 'Approve as',
  approveAsPublic: 'Approve as public',
  approveAsPrivate: 'Approve as private',
}

function SavedQuestion({
  id,
  title,
  questionText,
  topic,
  questionType,
  answers,
  comments,
  changeShowEditQuestion,
  canEdit,
  canApprove,
  canApproveAsPrivate,
  isApproved,
  token,
  callback,
  userId,
}) {
  const [toggleOpen, setToggleOpen] = useState(false)

  const changeToggleOpen = () => {
    setToggleOpen(x => !x)
  }

  const sendApprove = visibilityIsRestricted => {
    axios
      .patch(
        `${API_URL}${id.substring(
          id.lastIndexOf('/', id.lastIndexOf('/') - 1)
        )}`,
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
  return (
    <>
      <QuestionNew
        key={id}
        title={title}
        question={questionText}
        topic={topic}
        questionType={questionType}
        answers={answers}
        edit={changeShowEditQuestion}
        disabled
        color={isApproved ? '#ADFF2F' : null}
      >
        {canEdit && (
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
      </QuestionNew>
      <Comments
        comments={comments}
        token={token}
        questionAddress={id.substring(
          id.lastIndexOf('/', id.lastIndexOf('/') - 1)
        )}
        refetch={callback}
      />
    </>
  )
}

export default SavedQuestion

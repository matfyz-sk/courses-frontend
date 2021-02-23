/* eslint-disable react/prefer-stateless-function */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Input,
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
  delete: 'Delete question',
  by: 'By',
  at: 'At',
}

function SavedQuestion({
  id,
  comments,
  question,
  createdBy,
  createdAt,
  isTeacher,
  changeShowEditQuestion,
  canEdit,
  canApprove,
  canDisapprove,
  isApproved,
  showMetadata,
  canApproveAsPrivate,
  setScore,
  token,
  callback,
  userId,
}) {
  const [toggleOpen, setToggleOpen] = useState(false)
  const [author, setAuthor] = useState('')
  const [regexpUserAnswer, setRegexpUserAnswer] = useState('')

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
        JSON.stringify({ approver: [], }),
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
          // refetch
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
  const {
    title,
    questionText,
    topic,
    questionType,
    regexp,
    answers,
    essay,
    score,
    setUserAnswer,
    userAnswer,
    orderAnswers,
    matchPairs,
  } = question

  const matchAnswersAdapted = matchPairs && matchPairs.reduce((acc,pair) => {
    const answer = {
      id: pair.position,
      text: pair.answer,
    }
    acc.push(answer)
    return acc
  },[]).map(answer => answer.id === matchPairs.map(pair => pair.answer).indexOf(answer.text) ? answer : {...answer, text: ''})

  const matchPairsAdapted = matchPairs && matchPairs.reduce((acc,pair) => {
    const pairAdapted = {
      position: pair.position,
      promptText: pair.prompt,
      answerId: matchAnswersAdapted.find(answer => answer.text === pair.answer).id,
    }
    acc.push(pairAdapted)
    return acc
  },[])

  const metadata = () => (
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
  )
  return (
    <div className="mb-3 mt-3">
      <QuestionNew
        key={id}
        metadata={showMetadata && metadata}
        title={title}
        question={questionText}
        topic={topic}
        questionType={questionType}
        answers={answers}
        regexp={regexp}
        setRegexpUserAnswer={setRegexpUserAnswer}
        regexpUserAnswer={regexpUserAnswer}
        setUserAnswer={setUserAnswer}
        userAnswer={userAnswer}
        essay={essay}
        //ORDER Q
        orderAnswers = {orderAnswers} 
        //MATCH Q
        matchAnswers = {matchAnswersAdapted}
        matchPairs = {matchPairsAdapted}
        disabled
        isSaved={true}
        clickedSubmit={true}
        color={isApproved ? '#ADFF2F' : null}
      >
        {setScore && <Input type="text" value={score} onChange={setScore} />}
        {canEdit && changeShowEditQuestion && (
          <Button className="mr-2" color="success" onClick={changeShowEditQuestion}>
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
          <Button className="" color="danger" onClick={sendDisapprove}>
            {enText.disapprove}
          </Button>
        )}
        {/* {isTeacher && (
          <Button color="danger" style={{float:"right"}}>
            {enText.delete}
          </Button>
        )} */}

      </QuestionNew>
      {comments && (
        <Comments
          comments={comments}
          token={token}
          questionAddress={id.substr(
            id.lastIndexOf('/', id.lastIndexOf('/') - 1)
          )}
          callback={callback}
        />
      )}
    </div>
  )
}

export default SavedQuestion

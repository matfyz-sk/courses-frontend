/* eslint-disable react/prefer-stateless-function */
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { API_URL } from '../../../../configuration/api'
import QuestionNewData from '../question/question-new-data'
import SavedQuestion from './saved-question/saved-question'
import { setAnswers } from '../../common/functions/answers-functions'

function QuestionOverview({
                            match,
                            courseInstanceId,
                            isTeacher,
                            token,
                            userId,
                            history,
                          }) {
  const [questions, setQuestions] = useState([])
  const [showEditQuestion, setShowEditQuestion] = useState(false)

  const fetchQuestionChain = useCallback(() => {
    const questionTypeOld = match.params.questionType
    const questionIdOld = match.params.questionId
    if (questionTypeOld && questionIdOld && token) {
      const fetchData = async () => {
        return axios
          .get(
            `${API_URL}/${questionTypeOld}/${questionIdOld}?_join=hasAnswer,comment&_chain=previous`,
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
              const questionsMapped = data['@graph'].reduce(
                (accumulator, questionData) => {
                  if (questionData) {
                    const {
                      name: titleData,
                      text: questionTextData,
                      ofTopic,
                      createdBy: questionCreatedBy,
                      createdAt: questionCreatedAt,
                      approver,
                    } = questionData
                    let topicData = ''
                    if (ofTopic.length) {
                      topicData = ofTopic[0]['@id']
                    }
                    const question = {
                      id: questionData['@id'],
                      title: titleData,
                      questionText: questionTextData,
                      topic: topicData,
                      questionType: questionData['@type'],
                      createdBy: questionCreatedBy,
                      createdAt: new Date(questionCreatedAt),
                      approver,
                    }
                    question.comments = questionData.comment
                      .map(comment => {
                        const {
                          commentText,
                          createdAt: commentCreatedAt,
                          createdBy: commentCreatedBy,
                        } = comment
                        return {
                          id: comment['@id'],
                          createdAt: commentCreatedAt,
                          createdBy: commentCreatedBy,
                          commentText,
                        }
                      })
                      .sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                      )
                    const newquestion = setAnswers(question, questionData)
                    accumulator.push(newquestion)
                  }
                  return accumulator
                },
                []
              )
              setQuestions(questionsMapped)
            }
          })
          .catch(error => console.log(error))
      }
      fetchData()
    }
  }, [token, match.params.questionType, match.params.questionId])

  useEffect(() => {
    fetchQuestionChain()
  }, [fetchQuestionChain])

  const changeShowEditQuestion = () => {
    setShowEditQuestion(true)
  }
  return (
    <>
      {questions && questions.length > 0 && (
        <>
          {showEditQuestion && (
            <QuestionNewData
              courseInstanceId={courseInstanceId}
              isTeacher={isTeacher}
              token={token}
              userId={userId}
              history={history}
              question={questions[0]}
              creatingNewQuestionInChain
            />
          )}
          {questions.map((question, index) => {
            const { comments, approver, createdBy, createdAt } = question
            const createdByID = createdBy && createdBy['@id']
            const isApproved = Array.isArray(approver) && approver.length > 0
            return (
              <div key = {question.id}>
                {index === 1 && <h3 className='mt-5'>Previous versions</h3>}
                <SavedQuestion
                  key={question.id}
                  id={question.id}
                  comments={comments}
                  question={question}
                  createdBy={createdByID}
                  createdAt={createdAt}
                  isTeacher={isTeacher}
                  showMetadata
                  changeShowEditQuestion={changeShowEditQuestion}
                  canEdit={index === 0 && !isApproved && (isTeacher || createdByID === userId)}
                  canApprove={!isApproved && isTeacher}
                  canDisapprove={isApproved && isTeacher}
                  isApproved={isApproved}
                  canApproveAsPrivate={
                    !isApproved && isTeacher && createdByID === userId
                  }
                  token={token}
                  callback={fetchQuestionChain}
                  userId={userId}
                />
              </div>
            )
          })}
        </>
      )}
    </>
  )
}

const mapStateToProps = ({ userReducer }) => {
  const { isAdmin } = userReducer
  return {
    isAdmin,
  }
}

export default connect(mapStateToProps, {})(QuestionOverview)

/* eslint-disable react/prefer-stateless-function */
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import apiConfig from '../../../../configuration/api'
import QuestionNewData, {
  QuestionTypesEnums,
} from '../question/question-new-data'
import QuestionNew from '../question/question-new'
import Comments from './comments/comments'

const enText = {
  'edit-question': 'Edit question',
}

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
  // state = {
  //   questionVersions: [],
  //   isEdit: false,
  //   allQuestionTypes: {},
  //   title: '',
  //   approvedAsPublicId: '',
  //   approvedAsPrivateId: '',
  //   lastSeenByStudent: '',
  //   lastSeenByTeacher: '',
  //   lastChange: '',
  // }

  const fetchQuestionChain = useCallback(() => {
    const questionTypeOld = match.params.questionType
    const questionIdOld = match.params.questionId
    if (questionTypeOld && questionIdOld && token) {
      const fetchData = async () => {
        return axios
          .get(
            `${apiConfig.API_URL}/${questionTypeOld}/${questionIdOld}?_join=hasAnswer,comment&_chain=previous`,
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
                    }
                    switch (question.questionType) {
                      case QuestionTypesEnums.multiple.id:
                        question.answers = questionData.hasAnswer.map(
                          answer => {
                            const { correct, text } = answer
                            return { id: answer['@id'], correct, text }
                          }
                        )
                        question.comments = questionData.comment
                          .map(comment => {
                            const {
                              commentText,
                              createdAt,
                              commentCreatedBy,
                            } = comment
                            return {
                              id: comment['@id'],
                              createdAt,
                              createdBy: commentCreatedBy,
                              commentText,
                            }
                          })
                          .sort(
                            (a, b) =>
                              new Date(a.createdAt) - new Date(b.createdAt)
                          )
                        break
                      case QuestionTypesEnums.open.id:
                        question.answers = [questionData.regexp]
                        break
                      case QuestionTypesEnums.essay.id:
                        break
                      default:
                        break
                    }
                    accumulator.push(question)
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
  }, [token, match.params.questionType, match.params.questionId, userId])

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
            />
          )}
          {questions.map(question => {
            const {
              id,
              title,
              questionText,
              topic,
              questionType,
              answers,
              comments,
              createdBy,
            } = question
            return (
              <React.Fragment key={id}>
                <QuestionNew
                  key={id}
                  title={title}
                  question={questionText}
                  topic={topic}
                  questionType={questionType}
                  answers={answers}
                  edit={changeShowEditQuestion}
                  disabled
                >
                  {createdBy === userId && (
                    <Button color="success" onClick={changeShowEditQuestion}>
                      {enText['edit-question']}
                    </Button>
                  )}
                </QuestionNew>
                <Comments
                  comments={comments}
                  token={token}
                  questionAddress={id.substring(
                    id.lastIndexOf('/', id.lastIndexOf('/') - 1)
                  )}
                  refetch={fetchQuestionChain}
                />
              </React.Fragment>
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

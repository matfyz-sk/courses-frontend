/* eslint-disable react/prefer-stateless-function */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import apiConfig from '../../../../configuration/api'
import QuestionNewData, {
  QuestionTypesEnums,
} from '../question/question-new-data'
import QuestionNew from '../question/question-new'

function QuestionOverview({
  match,
  courseInstanceId,
  isTeacher,
  token,
  userId,
  history,
}) {
  const [questions, setQuestions] = useState([])
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

  useEffect(() => {
    const questionTypeOld = match.params.questionType
    const questionIdOld = match.params.questionId
    if (questionTypeOld && questionIdOld) {
      const fetchData = async () => {
        return (
          axios
            // .get(`${apiConfig.API_URL}/${questionTypeOld}/${questionIdOld}?_join=hasAnswer`, {
            .get(`${apiConfig.API_URL}/question?_join=hasAnswer`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: token,
              },
            })
            .then(({ data }) => {
              console.log(data)
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
                      }
                      switch (question.questionType) {
                        case QuestionTypesEnums.multiple.id:
                          question.answers = questionData.hasAnswer.map(
                            answer => {
                              const { correct, text } = answer
                              return { id: answer['@id'], correct, text }
                            }
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
        )
      }
      fetchData()
    }
  }, [token, match.params.questionType, match.params.questionId])

  return (
    <>
      {/* <h1>{this.state.title}</h1>
        <Button onClick={() => this.setState({ isEdit: !this.state.isEdit })}>
          Edit question
        </Button>
        {this.state.isEdit && lastKnownQuestionVersion ? (
          <Question
            questionId={decodeURIComponent(this.props.match.params.id)}
            title={this.state.title}
            text={lastKnownQuestionVersion.text.value}
            answers={lastKnownQuestionVersion.answers}
            topic={this.state.selectedTopic.id}
            questionType={lastKnownQuestionVersion.questionType}
            history={this.props.history}
          />
        ) : null}
        {this.state.questionVersions.map(questionVersion => {
          return (
            <SavedQuestion
              key={questionVersion.id}
              id={questionVersion.id}
              title={this.state.title}
              text={questionVersion.text}
              answers={questionVersion.answers}
              topic={this.state.selectedTopic.name}
              questionType={this.state.allQuestionTypes.get(
                questionVersion.questionType
              )}
              comments={questionVersion.comments}
              onSendComment={this.onSendComment}
              isApprovedAsPublic={
                this.state.approvedAsPublicId === questionVersion.id
              }
              isApprovedAsPrivate={
                this.state.approvedAsPrivateId === questionVersion.id
              }
              isTeacher={!!isAdmin}
              history={this.props.history}
              isPreview
            />
          )
        })} */}
      {questions && questions.length > 0 && (
        <>
          <QuestionNewData
            courseInstanceId={courseInstanceId}
            isTeacher={isTeacher}
            token={token}
            userId={userId}
            history={history}
            question={questions[0]}
          />
          {questions.map(question => {
            const {
              id,
              title,
              questionText,
              topic,
              questionType,
              answers,
              // TODO get comments
            } = question
            return (
              <QuestionNew
                key={id}
                title={title}
                question={questionText}
                topic={topic}
                questionType={questionType}
                answers={answers}
                disabled
              />
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

import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { Button } from 'reactstrap'
import apiConfig from '../../../../configuration/api'
import QuestionNew from './question-new'

const enText = {
  'open-question': 'Open question',
  'essay-question': 'Essay question',
  'question-with-predefined-answer': 'Multiple answers question',
  create: 'Create',
}

export const QuestionTypesEnums = Object.freeze({
  multiple: {
    id: 'http://www.courses.matfyz.sk/ontology#QuestionWithPredefinedAnswer',
    name: enText['question-with-predefined-answer'],
  },
  essay: {
    id: 'http://www.courses.matfyz.sk/ontology#EssayQuestion',
    name: enText['essay-question'],
  },
  open: {
    id: 'http://www.courses.matfyz.sk/ontology#OpenQuestion',
    name: enText['open-question'],
  },
})

function QuestionNewData({
  userId,
  courseInstanceId,
  isTeacher,
  token,
  history,
  question,
}) {
  const [title, setTitle] = useState((question && question.title) || '')
  const [questionText, setQuestion] = useState(
    (question && question.questionText) || ''
  )
  const [topic, setTopic] = useState((question && question.topic) || '')
  const [topicOptions, setTopicOptions] = useState([])
  const [questionType, setQuestionType] = useState(
    (question && question.questionType) || ''
  )
  const [questionTypeOptions, setQuestionTypeOptions] = useState([])
  const [answers, setAnswers] = useState((question && question.answers) || [])
  const [answerId, setAnswerId] = useState(-2)

  const saveTopics = topicsMapped => {
    setTopicOptions(topicsMapped)
    if (
      topic === '' &&
      topicsMapped &&
      topicsMapped.length &&
      topicsMapped.length > 0
    ) {
      if (topicsMapped[0].id) {
        setTopic(topicsMapped[0].id)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!isTeacher) {
        return axios
          .get(
            `${
              apiConfig.API_URL
            }/questionAssignment?courseInstance=${courseInstanceId.substring(
              courseInstanceId.lastIndexOf('/') + 1
            )}${
              userId
                ? `&assignedTo=${userId.substring(userId.lastIndexOf('/') + 1)}`
                : ''
            }&_join=covers`,
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
              const topicsMapped = data['@graph'].reduce(
                (accumulator, questionAssignment) => {
                  if (questionAssignment) {
                    const { covers } = questionAssignment
                    if (covers && covers.length && covers.length > 0) {
                      accumulator.push({
                        id: covers[0]['@id'],
                        name: covers[0].name,
                      })
                    }
                  }
                  return accumulator
                }
              )
              saveTopics(topicsMapped)
            }
          })
          .catch(error => console.log(error))
      }

      return axios
        .get(`${apiConfig.API_URL}/topic?covers=${courseInstanceId}`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then(({ data }) => {
          if (
            data &&
            data['@graph'] &&
            data['@graph'].length &&
            data['@graph'].length > 0
          ) {
            const topicsMapped = data['@graph'].reduce(
              (accumulator, topicData) => {
                if (topicData && topicData['@id'] && topicData.name) {
                  accumulator.push({
                    id: topicData['@id'],
                    name: topicData.name,
                  })
                }
                return accumulator
              },
              []
            )
            saveTopics(topicsMapped)
          }
        })
        .catch(error => console.log(error))
    }
    if (courseInstanceId && isTeacher !== null && userId && token) {
      fetchData()
    }
  }, [courseInstanceId, isTeacher, userId, token])

  useEffect(() => {
    const fetchData = async () => {
      return axios
        .get(`${apiConfig.API_URL}/question?_subclasses=true`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then(({ data }) => {
          if (
            data &&
            data.value &&
            data.value.length &&
            data.value.length > 0
          ) {
            const questionTypesMapped = data.value.reduce(
              (accumulator, questionTypeData) => {
                if (questionTypeData) {
                  switch (questionTypeData) {
                    case QuestionTypesEnums.multiple.id:
                      accumulator.push(QuestionTypesEnums.multiple)
                      break
                    case QuestionTypesEnums.open.id:
                      accumulator.push(QuestionTypesEnums.open)
                      break
                    case QuestionTypesEnums.essay.id:
                      accumulator.push(QuestionTypesEnums.essay)
                      break
                    default:
                      break
                  }
                }
                return accumulator
              },
              []
            )
            setQuestionTypeOptions(questionTypesMapped)
            if (questionType === '') {
              setQuestionType(questionTypesMapped[2].id)
            }
          }
        })
        .catch(error => console.log(error))
    }
    if (token) {
      fetchData()
    }
  }, [token])

  const changeAnswerText = (id, text) =>
    setAnswers(prevState =>
      prevState.map(el => {
        return el.id === id ? { ...el, text } : el
      })
    )

  const changeAnswerChecked = (id, correct) =>
    setAnswers(prevState =>
      prevState.map(el => {
        return el.id === id ? { ...el, correct } : el
      })
    )

  useEffect(() => {
    if (answers === []) {
      const answer = {
        id: -1,
        text: '',
        correct: false,
        changeAnswerText: text => changeAnswerText(-1, text),
        changeAnswerChecked: changedChecked =>
          changeAnswerChecked(-1, changedChecked),
      }
      setAnswers([answer])
    } else {
      const answersMapped = answers.map((answer, index) => {
        const answerMapped = {
          ...answer,
          id: -Math.abs(index) - 1,
          changeAnswerText: text => changeAnswerText(-1, text),
          changeAnswerChecked: changedChecked =>
            changeAnswerChecked(-1, changedChecked),
        }
        return answerMapped
      })
      setAnswers(answersMapped)
    }
  }, [])

  const addNewAnswer = () => {
    const answer = {
      id: answerId,
      text: '',
      correct: false,
      changeAnswerText: text => changeAnswerText(answerId, text),
      changeAnswerChecked: changedChecked =>
        setAnswers(prevState =>
          prevState.map(el => {
            return el.id === answerId ? { ...el, correct: changedChecked } : el
          })
        ),
    }
    setAnswers(prevAnswers => prevAnswers.concat(answer))
    setAnswerId(prevAnswerId => prevAnswerId - 1)
  }

  const formSubmitHandler = () => {
    if (questionType === QuestionTypesEnums.multiple.id) {
      const hasAnswer = answers.reduce((accumulator, answer, answerIndex) => {
        const { correct, text } = answer
        if (
          Number.isInteger(answerIndex) &&
          (correct === true || correct === false) &&
          (typeof text === 'string' || text instanceof String)
        ) {
          const answerData = {
            type: 'predefinedAnswer',
            text,
            correct,
            position: answerIndex,
          }
          accumulator.push(answerData)
        }
        return accumulator
      }, [])
      const questionWithPredefinedAnswer = {
        name: title,
        text: questionText,
        ofTopic: topic ? [topic] : [],
        hasAnswer,
      }
      if (question && question.id) {
        questionWithPredefinedAnswer.next = question.id // TODO add link to previous
      }
      axios
        .post(
          `${apiConfig.API_URL}/questionWithPredefinedAnswer`,
          JSON.stringify(questionWithPredefinedAnswer),
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
            history.push(
              `/courses/:${courseInstanceId.substring(
                courseInstanceId.lastIndexOf('/') + 1
              )}/quiz/questionGroups}`
            )
          }
        })
        .catch(error => console.log(error))
    }
  }

  return (
    <QuestionNew
      title={title}
      setTitle={setTitle}
      question={questionText}
      setQuestion={setQuestion}
      topic={topic}
      setTopic={setTopic}
      topicOptions={topicOptions}
      questionType={questionType}
      questionTypeOptions={questionTypeOptions}
      setQuestionType={setQuestionType}
      answers={answers}
      addNewAnswer={addNewAnswer}
      formSubmitHandler={formSubmitHandler}
    >
      <div>
        <Button onClick={formSubmitHandler}>{enText.create}</Button>
      </div>
    </QuestionNew>
  )
}

export default QuestionNewData

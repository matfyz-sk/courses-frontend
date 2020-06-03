import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import { Button } from 'reactstrap'
import { API_URL } from '../../../../configuration/api'
import QuestionNew from './question-new'

const enText = {
  'open-question': 'Open question',
  'essay-question': 'Essay question',
  'question-with-predefined-answer': 'Multiple answers question',
  'create-question': 'Create question',
  'create-new-question-version': 'Create new version',
  'new-question': 'New question',
  'new-question-version': 'New question version',
}

export const QuestionTypesEnums = Object.freeze({
  multiple: {
    id: 'http://www.courses.matfyz.sk/ontology#QuestionWithPredefinedAnswer', // should change id for type
    entityName: 'questionWithPredefinedAnswer',
    name: enText['question-with-predefined-answer'],
  },
  essay: {
    id: 'http://www.courses.matfyz.sk/ontology#EssayQuestion', // should change id for type
    entityName: 'essayQuestion',
    name: enText['essay-question'],
  },
  open: {
    id: 'http://www.courses.matfyz.sk/ontology#OpenQuestion', // should change id for type
    entityName: 'openQuestion',
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
  creatingNewQuestionInChain,
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
  const [regexp, setRegexp] = useState((question && question.regexp) || '')
  const [regexpUserAnswer, setRegexpUserAnswer] = useState(
    (question && question.regexpUserAnswer !== undefined) || ''
  )
  const [answerId, setAnswerId] = useState(-2)
  const saveTopics = useCallback(
    topicsMapped => {
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
    },
    [topic]
  )

  useEffect(() => {
    const fetchData = async () => {
      if (!isTeacher) {
        return axios
          .get(
            `${API_URL}/questionAssignment?courseInstance=${courseInstanceId.substring(
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
                },
                []
              )
              saveTopics(topicsMapped)
            }
          })
          .catch(error => console.log(error))
      }

      return axios
        .get(`${API_URL}/topic?covers=${courseInstanceId}`, {
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
  }, [courseInstanceId, isTeacher, userId, token, saveTopics])

  useEffect(() => {
    const fetchData = async () => {
      return axios
        .get(`${API_URL}/question?_subclasses=true`, {
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
                      // accumulator.push(QuestionTypesEnums.essay)
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
              setQuestionType(questionTypesMapped[0].id)
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

  const deleteAnswer = id =>
    setAnswers(prevState => prevState.filter(el => el.id !== id))

  useEffect(() => {
    if (answers === []) {
      const answer = {
        id: -1,
        text: '',
        correct: false,
        changeAnswerText: text => changeAnswerText(-1, text),
        changeAnswerChecked: changedChecked =>
          changeAnswerChecked(-1, changedChecked),
        deleteAnswer: () => deleteAnswer(-1),
      }
      setAnswers([answer])
    } else {
      const answersMapped = answers.map((answer, index) => {
        const id = -Math.abs(index) - 1
        const answerMapped = {
          ...answer,
          id,
          changeAnswerText: text => changeAnswerText(id, text),
          changeAnswerChecked: changedChecked =>
            changeAnswerChecked(id, changedChecked),
          deleteAnswer: () => deleteAnswer(id),
        }
        return answerMapped
      })
      setAnswers(answersMapped)
      setAnswerId(-Math.abs(answersMapped.length) - 1)
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
      deleteAnswer: () => deleteAnswer(answerId),
    }
    setAnswers(prevAnswers => prevAnswers.concat(answer))
    setAnswerId(prevAnswerId => prevAnswerId - 1)
  }

  const formSubmitHandler = () => {
    const questionToSubmit = {
      name: title,
      text: `\"\"${questionText}\"\"`,
      ofTopic: topic ? [topic] : [],
      courseInstance: courseInstanceId,
    }
    if (question && question.id) {
      questionToSubmit.previous = question.id
    }
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
      questionToSubmit.hasAnswer = hasAnswer

      axios
        .post(
          `${API_URL}/questionWithPredefinedAnswer`,
          JSON.stringify(questionToSubmit),
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
              `/courses/${courseInstanceId.substring(
                courseInstanceId.lastIndexOf('/') + 1
              )}/quiz/questionGroups`
            )
          }
        })
        .catch(error => console.log(error))
    }
    if (questionType === QuestionTypesEnums.open.id) {
      questionToSubmit.regexp = regexp
      axios
        .post(`${API_URL}/openQuestion`, JSON.stringify(questionToSubmit), {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then(({ status: statusQuestionAssignment }) => {
          if (statusQuestionAssignment === 200) {
            history.push(
              `/courses/${courseInstanceId.substring(
                courseInstanceId.lastIndexOf('/') + 1
              )}/quiz/questionGroups`
            )
          }
        })
        .catch(error => console.log(error))
    }
  }
  return (
    <QuestionNew
      header={() => (
        <>
          {question ? (
            <h2>{enText['new-question-version']}</h2>
          ) : (
            <h2>{enText['new-question']}</h2>
          )}
        </>
      )}
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
      setRegexp={setRegexp}
      setRegexpUserAnswer={setRegexpUserAnswer}
      answers={answers}
      regexp={regexp}
      regexpUserAnswer={regexpUserAnswer}
      addNewAnswer={addNewAnswer}
      formSubmitHandler={formSubmitHandler}
    >
      <div>
        <Button color="success" onClick={formSubmitHandler}>
          {creatingNewQuestionInChain
            ? enText['create-new-question-version']
            : enText['create-question']}
        </Button>
      </div>
    </QuestionNew>
  )
}

export default QuestionNewData

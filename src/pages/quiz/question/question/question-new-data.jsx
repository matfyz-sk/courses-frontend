import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import QuestionNew from './question-new'
import { checkAnswers, checkPairs, checkTextNotEmpty } from '../../common/functions/validate-input'
import { WarningMessage } from '../../common/warning-message'
import { QuestionTypesEnums } from '../../common/functions/type-enums'
import { API_URL } from "../../../../constants";

const enText = {
  'open-question': 'Open question',
  'essay-question': 'Essay question',
  'question-with-predefined-answer': 'Multiple answers question',
  'ordering-question': 'Ordering question',
  'matching-question': 'Matching question',
  'create-question': 'Create question',
  'create-new-question-version': 'Create new version',
  'new-question': 'New question',
  'new-question-version': 'New question version',
}

function QuestionNewData({
                           userId,
                           courseInstanceId,
                           isTeacher,
                           token,
                           history,
                           question,
                           creatingNewQuestionInChain,
                         }) {
  const [ title, setTitleText ] = useState((question && question.title) || '')
  const [ questionText, setQuestionText ] = useState(
    (question && question.questionText) || ''
  )
  const [ topic, setTopic ] = useState((question && question.topic) || '')
  const [ topicOptions, setTopicOptions ] = useState([])
  const [ questionType, setType ] = useState((question && question.questionType) || '')
  const [ questionTypeOptions, setQuestionTypeOptions ] = useState([])

  const setTitle = (title) => {
    setShowWarning(prevState => {
      return ({...prevState, title: ''})
    })
    setTitleText(title)
  }

  const setQuestion = (question) => {
    setShowWarning(prevState => {
      return ({...prevState, question: ''})
    })
    setQuestionText(question)
  }

  const setQuestionType = (type) => {
    setShowWarning({
      title: '',
      question: '',
      answers: '',
    })
    setType(type)
  }

  //Validation
  const [ modal, setModal ] = useState(false)
  const toggleModal = () => setModal(!modal)
  const handleCloseModal = () => setModal(false)
  const [ showWarning, setShowWarning ] = useState({
    title: '',
    question: '',
    answers: '',
  })
  useEffect(() => {
    if(showWarning.title === 'ok' && showWarning.question === 'ok' && showWarning.answers === 'ok') {
      if(questionType === QuestionTypesEnums.multiple.id && answers.length > 0 && answers.filter(answer => answer.correct).length === 0) {
        setModal(true)
      } else {
        formSubmitHandler()
      }
    }
  }, [ showWarning ])

  //PredefinedAnswersQuestion
  const [ answers, setAnswers ] = useState((question && question.answers) || [])
  const [ answerId, setAnswerId ] = useState(-2)

  //OpenQuestion
  const [ regexp, setRegexpText ] = useState((question && question.regexp) || '')
  const [ regexpUserAnswer, setRegexpUserAnswer ] = useState(
    (question && question.regexpUserAnswer !== undefined) || '')

  const setRegexp = (text) => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setRegexpText(text)
  }

  //EssayQuestion

  //OrderQuestion
  const [ orderAnswers, setOrderAnswers ] = useState(question && question.orderAnswers || [])
  const [ orderAnswerPos, setOrderAnswerPos ] = useState(question && question.orderAnswers && question.orderAnswers.length || 0)
  const [ orderAnswersColumn, setOrderAnswersColumn ] = useState({
    id: "answerColumn",
    title: "Answers in correct order",
    answersPositions: question && question.orderAnswers && question.orderAnswers.map(answer => answer.position) || [],
  })

  //MatchQuestion
  const [ matchAnswers, setMatchAnswers ] = useState(question && question.matchPairs || [])
  const [ matchPairs, setMatchPairs ] = useState([])
  const [ matchAnswerId, setMatchAnswerId ] = useState(0)
  const [ matchPairPos, setMatchPairPos ] = useState(question && question.matchPairs && question.matchPairs.length || 0)

  const saveTopics = useCallback(
    topicsMapped => {
      setTopicOptions(topicsMapped)
      if(
        topic === '' &&
        topicsMapped &&
        topicsMapped.length &&
        topicsMapped.length > 0
      ) {
        if(topicsMapped[0].id) {
          setTopic(topicsMapped[0].id)
        }
      }
    },
    [ topic ]
  )

  useEffect(() => {
    const fetchData = async() => {
      if(!isTeacher) {
        return axios
          .get(
            `${ API_URL }/questionAssignment?courseInstance=${ courseInstanceId.substring(
              courseInstanceId.lastIndexOf('/') + 1
            ) }${
              userId
                ? `&assignedTo=${ userId.substring(userId.lastIndexOf('/') + 1) }`
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
          .then(({data}) => {
            if(
              data &&
              data['@graph'] &&
              data['@graph'].length &&
              data['@graph'].length > 0
            ) {
              const topicsMapped = data['@graph'].reduce(
                (accumulator, questionAssignment) => {
                  if(questionAssignment) {
                    const {covers} = questionAssignment
                    if(covers && covers.length && covers.length > 0) {
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
        .get(`${ API_URL }/topic?covers=${ courseInstanceId }`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then(({data}) => {
          if(
            data &&
            data['@graph'] &&
            data['@graph'].length &&
            data['@graph'].length > 0
          ) {
            const topicsMapped = data['@graph'].reduce(
              (accumulator, topicData) => {
                if(topicData && topicData['@id'] && topicData.name) {
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
    if(courseInstanceId && isTeacher !== null && userId && token) {
      fetchData()
    }
  }, [ courseInstanceId, isTeacher, userId, token, saveTopics ])

  useEffect(() => {
    const fetchData = async() => {
      return axios
        .get(`${ API_URL }/question?_subclasses=true`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then(({data}) => {
          if(
            data &&
            data.value &&
            data.value.length &&
            data.value.length > 0
          ) {
            const questionTypesMapped = data.value.reduce(
              (accumulator, questionTypeData) => {
                if(questionTypeData) {
                  switch(questionTypeData) {
                    case QuestionTypesEnums.multiple.id:
                      accumulator.push(QuestionTypesEnums.multiple)
                      break
                    case QuestionTypesEnums.open.id:
                      accumulator.push(QuestionTypesEnums.open)
                      break
                    case QuestionTypesEnums.essay.id:
                      accumulator.push(QuestionTypesEnums.essay)
                      break
                    case QuestionTypesEnums.ordering.id:
                      accumulator.push(QuestionTypesEnums.ordering)
                      break
                    case QuestionTypesEnums.matching.id:
                      accumulator.push(QuestionTypesEnums.matching)
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
            if(questionType === '') {
              setQuestionType(questionTypesMapped[0].id)
            }
          }
        })
        .catch(error => console.log(error))
    }
    if(token) {
      fetchData()
    }
  }, [ token ])

  //PredefinedAnswersQuestion functions
  useEffect(() => {
    if(answers === []) {
      const answer = {
        id: -1,
        text: '',
        correct: false,
        changeAnswerText: text => changeAnswerText(-1, text),
        changeAnswerChecked: changedChecked =>
          changeAnswerChecked(-1, changedChecked),
        deleteAnswer: () => deleteAnswer(-1),
      }
      setAnswers([ answer ])
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
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    const answer = {
      id: answerId,
      text: '',
      correct: false,
      changeAnswerText: text => changeAnswerText(answerId, text),
      changeAnswerChecked: changedChecked =>
        setAnswers(prevState =>
          prevState.map(el => {
            return el.id === answerId ? {...el, correct: changedChecked} : el
          })
        ),
      deleteAnswer: () => deleteAnswer(answerId),
    }
    setAnswers(prevAnswers => prevAnswers.concat(answer))
    setAnswerId(prevAnswerId => prevAnswerId - 1)
  }

  const changeAnswerText = (id, text) => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setAnswers(prevState =>
      prevState.map(el => {
        return el.id === id ? {...el, text} : el
      })
    )
  }

  const changeAnswerChecked = (id, correct) => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setAnswers(prevState =>
      prevState.map(el => {
        return el.id === id ? {...el, correct} : el
      })
    )
  }

  const deleteAnswer = id => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setAnswers(prevState => prevState.filter(el => el.id !== id))
  }

  //OrderQuestion function
  useEffect(() => {
    if(orderAnswers && orderAnswers.length > 0) {

      orderAnswers.sort((a, b) => a.position < b.position ? -1 : 1)

      const orderAnswersMapped = orderAnswers.reduce((acc, answer) => {
        const answerData = {
          ...answer,
          changeOrderAnswerText: text => changeOrderAnswerText(answer.position, text),
          deleteOrderAnswer: () => deleteOrderAnswer(answer.position),
        }
        acc.push(answerData)
        return acc
      }, [])
      setOrderAnswers(orderAnswersMapped)
    }
  }, [])

  const addNewOrderAnswer = () => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    const orderAnswer = {
      position: orderAnswerPos,
      text: '',
      changeOrderAnswerText: text => changeOrderAnswerText(orderAnswerPos, text),
      deleteOrderAnswer: () => deleteOrderAnswer(orderAnswerPos),
    }
    const positions = orderAnswersColumn.answersPositions
    const newPositions = positions.concat(orderAnswerPos)
    setOrderAnswersColumn(prevState => ({
      ...prevState,
      answersPositions: newPositions
    }))
    setOrderAnswers(prevOrderAnswers => prevOrderAnswers.concat(orderAnswer))
    setOrderAnswerPos(prevOrderAnswerPos => prevOrderAnswerPos + 1)
  }

  const changeOrderAnswerText = (position, text) => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setOrderAnswers(prevState =>
      prevState.map(el => {
        return el.position === position ? {...el, text} : el
      })
    )
  }

  const deleteOrderAnswer = position => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setOrderAnswersColumn(prevState => ({
      ...prevState,
      answersPositions: prevState.answersPositions.filter(el => el !== position)
    }))
    setOrderAnswers(prevState => prevState.filter(el => el.position !== position))
  }

  // const onDragEnd = result => {
  //   setShowWarning(prevState => {return ({...prevState, answers: ''})})
  //   const {destination, source, draggableId} = result;
  //   if (!destination) {
  //     return
  //   }
  //   if (destination.index === source.index) {
  //     return
  //   }
  //   const newAnswersPos = orderAnswersColumn.answersPositions
  //   newAnswersPos.splice(source.index, 1)
  //   newAnswersPos.splice(destination.index, 0,parseInt(draggableId))
  //   const newColumnData = {
  //     id: orderAnswersColumn.id,
  //     title: orderAnswersColumn.title,
  //     answersPositions: newAnswersPos,
  //   }
  //   setOrderAnswersColumn(newColumnData)
  // }

  //MatchQuestion function
  useEffect(() => {
    if(question && question.matchPairs) {
      question.matchPairs.sort((a, b) => a.position < b.position ? -1 : 1)
      const matchAnswersAdapted = question.matchPairs.reduce((acc, pair) => {
        const answer = {
          id: pair.position,
          text: pair.answer,
          changeMatchAnswerText: text => changeMatchAnswerText(pair.position, text)
        }
        acc.push(answer)
        return acc
      }, []).map(answer => answer.id === question.matchPairs.find(pair => pair.answer === answer.text).position ? answer : {
        ...answer,
        text: ''
      })

      const matchPairsAdapted = question.matchPairs.reduce((acc, pair) => {
        const pairAdapted = {
          position: pair.position,
          promptText: pair.prompt,
          answerId: matchAnswersAdapted.find(answer => answer.text === pair.answer).id,
          changePromptText: text => changePromptText(pair.position, text),
          changePairAnswer: answerId => changePairAnswer(pair.position, answerId),
          deletePair: () => deletePair(pair.position)
        }
        acc.push(pairAdapted)
        return acc
      }, [])

      setMatchAnswers(matchAnswersAdapted)
      setMatchPairs(matchPairsAdapted)
      setMatchAnswerId(matchAnswersAdapted.length)
      setMatchPairPos(matchPairsAdapted.length)
    }
  }, [])

  const addNewPair = () => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    const answer = {
      id: matchAnswerId,
      text: '',
      changeMatchAnswerText: text => changeMatchAnswerText(matchAnswerId, text),
    }
    setMatchAnswerId(prevVal => prevVal + 1)
    setMatchAnswers(prevState => prevState.concat(answer))

    const pair = {
      position: matchPairPos,
      promptText: '',
      answerId: matchAnswerId,
      changePromptText: text => changePromptText(matchPairPos, text),
      changePairAnswer: answerId => changePairAnswer(matchPairPos, answerId),
      deletePair: () => deletePair(matchPairPos)
    }
    setMatchPairPos(prevVal => prevVal + 1)
    setMatchPairs(prevState => prevState.concat(pair))
  }

  const changeMatchAnswerText = (id, text) => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setMatchAnswers(prevState =>
      prevState.map(answer => {
        return answer.id === id ? {...answer, text} : answer
      }))
  }

  const changePromptText = (position, promptText) => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setMatchPairs(prevState =>
      prevState.map(pair => {
        return pair.position === position ? {...pair, promptText} : pair
      }))
  }

  const changePairAnswer = (pairPos, answerId) => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setMatchPairs(prevState =>
      prevState.map(pair => {
        return pair.position === pairPos ? {...pair, answerId} : pair
      })
    )
  }

  const deletePair = (position) => {
    setShowWarning(prevState => {
      return ({...prevState, answers: ''})
    })
    setMatchAnswers(prevState => prevState.filter(answer => answer.position !== position))
    setMatchPairs(prevState => prevState.filter(pair => pair.position !== position))
  }

  const validateOnSubmit = () => {
    setShowWarning(prevState => {
      return ({...prevState, title: checkTextNotEmpty(title, 'Title')})
    })
    setShowWarning(prevState => {
      return ({...prevState, question: checkTextNotEmpty(questionText, 'Question')})
    })

    switch(questionType) {
      case QuestionTypesEnums.multiple.id:
        setShowWarning(prevState => {
          return ({...prevState, answers: checkAnswers(answers)})
        })
        break
      case QuestionTypesEnums.essay.id:
        setShowWarning(prevState => {
          return ({...prevState, answers: 'ok'})
        })
        break
      case QuestionTypesEnums.open.id:
        setShowWarning(prevState => {
          return ({...prevState, answers: checkTextNotEmpty(regexp, 'Answer')})
        })
        break
      case QuestionTypesEnums.ordering.id:
        setShowWarning(prevState => {
          return ({...prevState, answers: checkAnswers(orderAnswers)})
        })
        break
      case QuestionTypesEnums.matching.id:
        setShowWarning(prevState => {
          return ({...prevState, answers: checkPairs(matchPairs, matchAnswers)})
        })
        break
      default:
        break
    }
  }

  const formSubmitHandler = () => {
    const questionToSubmit = {
      name: title,
      text: `\"\"${ questionText }\"\"`,
      ofTopic: topic ? [ topic ] : [],
      courseInstance: courseInstanceId,
    }
    if(question && question.id) {
      questionToSubmit.previous = question.id
    }

    if(questionType === QuestionTypesEnums.multiple.id) {
      const hasAnswer = answers.reduce((accumulator, answer, answerIndex) => {
        const {correct, text} = answer
        if(
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
          `${ API_URL }/questionWithPredefinedAnswer`,
          {...questionToSubmit},
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
        )
        .then(({status: statusQuestionAssignment}) => {
          if(statusQuestionAssignment === 200) {
            history.push(
              `/courses/${ courseInstanceId.substring(
                courseInstanceId.lastIndexOf('/') + 1
              ) }/quiz/questionGroups`
            )
          }
        })
        .catch(error => console.log(error))
    }
    if(questionType === QuestionTypesEnums.open.id) {
      questionToSubmit.regexp = regexp
      axios
        .post(`${ API_URL }/openQuestion`, {...questionToSubmit}, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then(({status: statusQuestionAssignment}) => {
          if(statusQuestionAssignment === 200) {
            history.push(
              `/courses/${ courseInstanceId.substring(
                courseInstanceId.lastIndexOf('/') + 1
              ) }/quiz/questionGroups`
            )
          }
        })
        .catch(error => console.log(error))
    }
    if(questionType === QuestionTypesEnums.essay.id) {
      axios
        .post(`${ API_URL }/essayQuestion`, {...questionToSubmit}, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })
        .then(({status: statusQuestionAssignment}) => {
          if(statusQuestionAssignment === 200) {
            history.push(
              `/courses/${ courseInstanceId.substring(
                courseInstanceId.lastIndexOf('/') + 1
              ) }/quiz/questionGroups`
            )
          }
        })
        .catch(error => console.log(error))
    }
    if(questionType === QuestionTypesEnums.ordering.id) {
      const answersMapped = orderAnswersColumn.answersPositions.map(position => orderAnswers[position])
      let pos = 0
      questionToSubmit.hasAnswer = answersMapped.reduce((acc, answer) => {
        const answerData = {
          type: 'orderingAnswer',
          text: answer.text,
          position: pos,
        }
        pos++
        acc.push(answerData)
        return acc
      }, [])

      axios
        .post(
          `${ API_URL }/orderingQuestion`,
          {...questionToSubmit},
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
        )
        .then(({status: statusQuestionAssignment}) => {
          if(statusQuestionAssignment === 200) {
            history.push(
              `/courses/${ courseInstanceId.substring(
                courseInstanceId.lastIndexOf('/') + 1
              ) }/quiz/questionGroups`
            )
          }
        })
        .catch(error => console.log(error))
    }
    if(questionType === QuestionTypesEnums.matching.id) {
      let pos = 0
      questionToSubmit.hasAnswer = matchPairs.reduce((acc, pair) => {
        const pairData = {
          type: 'matchPair',
          position: pair.position,
          prompt: pair.promptText,
          answer: matchAnswers.find(a => a.position === pair.answerPos).text,
        }
        pos++
        acc.push(pairData)
        return acc
      }, [])

      axios
        .post(
          `${ API_URL }/matchQuestion`,
          {...questionToSubmit},
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: token,
            },
          }
        )
        .then(({status: statusQuestionAssignment}) => {
          if(statusQuestionAssignment === 200) {
            history.push(
              `/courses/${ courseInstanceId.substring(
                courseInstanceId.lastIndexOf('/') + 1
              ) }/quiz/questionGroups`
            )
          }
        })
        .catch(error => console.log(error))
    }
  }
  return (
    <QuestionNew
      header={ () => (
        <>
          { question ? (
            <h2>{ enText['new-question-version'] }</h2>
          ) : (
            <h2>{ enText['new-question'] }</h2>
          ) }
        </>
      ) }
      title={ title }
      setTitle={ setTitle }
      question={ questionText }
      setQuestion={ setQuestion }
      topic={ topic }
      setTopic={ setTopic }
      topicOptions={ topicOptions }
      questionType={ questionType }
      questionTypeOptions={ questionTypeOptions }
      setQuestionType={ setQuestionType }
      setRegexp={ setRegexp }
      setRegexpUserAnswer={ setRegexpUserAnswer }
      answers={ answers }
      regexp={ regexp }
      regexpUserAnswer={ regexpUserAnswer }
      addNewAnswer={ addNewAnswer }
      //OrderingQuestion
      orderAnswers={ orderAnswers }
      orderAnswersColumn={ orderAnswersColumn }
      addNewOrderAnswer={ addNewOrderAnswer }
      setShowWarning={ setShowWarning }
      setOrderAnswersColumn={ setOrderAnswersColumn }
      //MatchingQuestion
      matchAnswers={ matchAnswers }
      matchPairs={ matchPairs }
      addNewPair={ addNewPair }
      showWarning={ showWarning }
      formSubmitHandler={ formSubmitHandler }
    >
      <WarningMessage
        text={ showWarning.answers }
        isOpen={ showWarning.answers }
      />

      <Button
        className="mt-3"
        color="success"
        onClick={ validateOnSubmit }
      >
        { creatingNewQuestionInChain
          ? enText['create-new-question-version']
          : enText['create-question'] }
      </Button>

      <Modal isOpen={ modal } toggle={ toggleModal }>
        <ModalHeader>
          No correct answer
        </ModalHeader>
        <ModalBody>
          Do you want to create this question with no correct answer?
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={ formSubmitHandler }>
            Yes
          </Button>
          <Button color="danger" onClick={ handleCloseModal }>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </QuestionNew>
  )
}

export default QuestionNewData

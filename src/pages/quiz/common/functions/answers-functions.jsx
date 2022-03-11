import { QuestionTypesEnums } from './type-enums'
import { shuffle } from './generation_functions'
import { axiosGetEntities, getResponseBody, getShortID } from '../../../../helperFunctions'

export function setAnswers(question, questionData) {
  switch(question.questionType) {
    case QuestionTypesEnums.multiple.id:
      question.answers = questionData.hasAnswer.map(
        answer => {
          const {correct, text, position} = answer
          return {id: answer['@id'], correct, text, position}
        }
      )
      break
    case QuestionTypesEnums.open.id:
      question.regexp = questionData.regexp
      break
    case QuestionTypesEnums.essay.id:
      break
    case QuestionTypesEnums.ordering.id:
      question.orderAnswers = questionData.hasAnswer.map(
        answer => {
          const {text, position} =
            answer
          return {
            id: answer['@id'],
            text, position
          }
        }
      )
      break
    case QuestionTypesEnums.matching.id:
      question.matchPairs = questionData.hasAnswer.map(
        ans => {
          const {prompt, answer, position} = ans
          return {
            id: ans['@id'],
            prompt, answer, position
          }
        }
      )
      break
    default:
      break
  }
  return question
}

export function setUserAnswers(orderedQuestion) {
  switch(orderedQuestion.question.questionType) {
    case QuestionTypesEnums.multiple.id:
      orderedQuestion.userAnswer = orderedQuestion.question.answers.reduce((acc, answer) => {
        acc.push({
          position: answer.position,
          predefinedAnswer: answer.id,
          userChoice: false,
        })
        return acc
      }, [])
      orderedQuestion.answered = false
      break
    case QuestionTypesEnums.open.id:
      orderedQuestion.userAnswer = ''
      break
    case QuestionTypesEnums.essay.id:
      orderedQuestion.userAnswer = ''
      orderedQuestion.answered = false
      break
    case QuestionTypesEnums.ordering.id:
      let position = 0
      orderedQuestion.userAnswer = shuffle(orderedQuestion.question.orderAnswers).reduce((acc, answer) => {
        acc.push({
          orderingAnswer: answer.id,
          text: answer.text,
          userChoice: position,
        })
        position += 1
        return acc
      }, [])
      orderedQuestion.answered = false
      break
    case QuestionTypesEnums.matching.id:
      orderedQuestion.userAnswer = orderedQuestion.question.matchPairs.reduce((acc, pair) => {
        acc.push({
          position: pair.position,
          matchPair: pair.id,
          userChoice: "",
        })
        return acc
      }, [])
      orderedQuestion.answered = false
      break
    default:
      break
  }
  return orderedQuestion
}

async function getUserAnswer(uA) {
  const userAnswerId = getShortID(uA)
  let userAnswer
  await axiosGetEntities(`userAnswer/${ userAnswerId }`)
    .then(resp => userAnswer = getResponseBody(resp)[0])
    .catch(error => console.log(error))
  return userAnswer
}

export async function setExistingUserAnswers(orderedQuestion) {
  switch(orderedQuestion.question.questionType) {
    case QuestionTypesEnums.multiple.id:
      orderedQuestion.userAnswer = await orderedQuestion.userAnswer.reduce(async(acc, uA) => {
        const currentAcc = await acc
        const uAData = await getUserAnswer(uA)
        currentAcc.push({
          position: uAData.position,
          predefinedAnswer: uAData.predefinedAnswer[0]['@id'],
          userChoice: uAData.userChoice,
        })
        return currentAcc
      }, []).then(result => {
        return result
      })
      return await orderedQuestion
    case QuestionTypesEnums.open.id:
      orderedQuestion.userAnswer = (await getUserAnswer(orderedQuestion.userAnswer)).text
      return await orderedQuestion
    case QuestionTypesEnums.essay.id:
      orderedQuestion.userAnswer = (await getUserAnswer(orderedQuestion.userAnswer)).text
      return await orderedQuestion
    case QuestionTypesEnums.ordering.id:
      orderedQuestion.userAnswer = await orderedQuestion.userAnswer.reduce(async(acc, uA) => {
        const currentAcc = await acc
        const uAData = await getUserAnswer(uA)
        currentAcc.push({
          orderingAnswer: uAData.orderingAnswer[0]['@id'],
          text: orderedQuestion.question.orderAnswers.find(a => a.id === uAData.orderingAnswer[0]['@id']).text,
          userChoice: uAData.userChoice,
        })
        return currentAcc
      }, []).then(result => {
        return result
      })
      return await orderedQuestion
    case QuestionTypesEnums.matching.id:
      orderedQuestion.userAnswer = await orderedQuestion.userAnswer.reduce(async(acc, uA) => {
        const currentAcc = await acc
        const uAData = await getUserAnswer(uA)
        currentAcc.push({
          position: uAData.position,
          matchPair: uAData.matchPair[0]['@id'],
          userChoice: uAData.userChoice,
        })
        return currentAcc
      }, []).then(result => {
        return result
      })
      return await orderedQuestion
  }
}

export function createExportDataUserAnswer(question) {
  switch(question.question.questionType) {
    case QuestionTypesEnums.multiple.id:
      return question.userAnswer.reduce((acc, uA) => {
        acc.push({
          ...uA,
          _type: 'orderedAnswer',
        })
        return acc
      }, [])
    case QuestionTypesEnums.open.id:
      return [ {
        text: question.userAnswer,
        _type: 'directAnswer',
      } ]
    case QuestionTypesEnums.essay.id:
      return [ {
        text: question.userAnswer,
        _type: 'directAnswer',
        score: 0,

      } ]
    case QuestionTypesEnums.ordering.id:
      return question.userAnswer.reduce((acc, uA) => {
        acc.push({
          userChoice: uA.userChoice,
          orderingAnswer: uA.orderingAnswer,
          _type: 'orderingUserAnswer',
        })
        return acc
      }, [])
    case QuestionTypesEnums.matching.id:
      return question.userAnswer.reduce((acc, uA) => {
        acc.push({
          ...uA,
          _type: 'matchPairUserAnswer',
        })
        return acc
      }, [])
    default:
      return
  }
}

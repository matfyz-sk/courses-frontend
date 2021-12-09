import { setAnswers, setExistingUserAnswers } from './answers-functions'
import { QuestionTypesEnums, QuizAssignmentTypesEnums } from './type-enums'
import { axiosGetEntities, getResponseBody, getShortID } from '../../../../helperFunctions'

export async function getTopicsData (courseInstanceId) {
  let topics = {
    covered: [], mentioned: [], required: [],
  }

  const getTopicType = async (type) => {
    let topicsReduced = []
    await axiosGetEntities(`topic?${type}=${courseInstanceId}`)
      .then(response => {
        const topicsData = getResponseBody(response)
        if (topicsData.length > 0) {
          topicsReduced =  topicsData.reduce(
            (acc, topicData) => {
              if (topicData && topicData['@id'] && topicData.name) {
                acc.push({
                  id: topicData['@id'],
                  name: topicData.name,
                })
              }
              return acc
            }, []
          )
        }
      })
      .catch(err => console.log(err))
    return topicsReduced
  }

  await getTopicType('covers').then(resp => topics.covered = resp)
  await getTopicType('requires').then(resp => topics.required = resp)
  await getTopicType('mentions').then(resp => topics.mentioned = resp)

  return topics
}

export async function getQuestionsData (courseInstanceId, changePoints) {
  let questions = []
  await axiosGetEntities(`question?approver=iri&courseInstance=${courseInstanceId}`)
    .then( async (response) => {
      const questionsRawData = getResponseBody(response)
      if (questionsRawData.length > 0) {
        questions = await questionsRawData.reduce( async (acc, questionDataRaw) => {
          const currentAcc = await acc
          const questionData = {
            id: questionDataRaw['@id'],
            title: questionDataRaw.name,
            questionText: questionDataRaw.text,
            topic: questionDataRaw.ofTopic[0]['@id'],
            questionType: questionDataRaw['@type'],
            createdBy: questionDataRaw.createdBy['@id'],
            createdAt: new Date(questionDataRaw.createdAt),
            visibilityIsRestricted: questionDataRaw.visibilityIsRestricted,
          }

          questionDataRaw.hasAnswer = await questionDataRaw.hasAnswer.reduce( async (acc, hasAnswerItem) => {
            const currentAcc = await acc
            const hasAnswerId = getShortID(hasAnswerItem['@id'])
            const hasAnswerType = hasAnswerItem['@id'].substring(
              hasAnswerItem['@id'].lastIndexOf('/', hasAnswerItem['@id'].lastIndexOf('/') - 1) + 1,
              hasAnswerItem['@id'].lastIndexOf('/')
            )
            await axiosGetEntities(`${hasAnswerType}/${hasAnswerId}`)
              .then(response => {
                currentAcc.push(getResponseBody(response)[0])
              })
              .catch(err => console.log(err))
            return currentAcc
          },[])

          currentAcc.push({
            question: setAnswers(questionData, questionDataRaw),
            points: '1',
            position: -1,
            changePoints: newPoints => changePoints(questionData.id, newPoints)
          })

          return acc
        }, [])
      }
    })
    .catch(err => console.log(err))
  return questions
}

export async function getAgentsData (courseInstanceId) {
  let agents = {}
  const getAgentType = async (query, type) => {
    let agentsReduced = []
    await axiosGetEntities(query)
      .then(response => {
        const agentsData = getResponseBody(response)
        if (agentsData.length > 0) {
          agentsReduced =  agentsData.reduce((acc, user) => {
            if (user['@type'] === type) {
              acc.push({
                id: user['@id'],
                type: user['@type'],
                name: type === "http://www.courses.matfyz.sk/ontology#User" ?
                  `${user.firstName} ${user.lastName}` : user.name,
              })
            }
            return acc
          }, [])
        }
      })
      .catch(err => console.log(err))
    return agentsReduced
  }

  await getAgentType(`user?studentOf=${courseInstanceId}`, "http://www.courses.matfyz.sk/ontology#User")
    .then(resp => agents.users = resp)
  await getAgentType(`team?courseInstance=${courseInstanceId}`,"http://www.courses.matfyz.sk/ontology#Team")
    .then(resp => agents.teams = resp)
  return agents
}

function typeExistingData (typeApps, numAll) {
  return [{
    id: -1,
    number: numAll,
    name: "All types",
    all: typeApps.length === 0
  }].concat(
    Object.values(QuestionTypesEnums).reduce((acc, type) => {
      const typeIndex = typeApps.map(typeApp => typeApp.questionType).indexOf(type.id)
      if (typeIndex === -1) {
        acc.push({
          id: type.id,
          number: 0,
          name: type.name,
          all: false,
        })
      } else {
        acc.push({
          id: type.id,
          number: typeApps[typeIndex].questionsAmount,
          name: type.name,
          all: false,
        })
      }
      return acc
    },[])
  )
}
function topicExistingData (topicId, topicName, topicNumber, typeApps, all) {
  return {
    id: topicId,
    name: topicName,
    number: topicNumber,
    types: typeExistingData(typeApps, topicNumber),
    all: all
  }
}
async function getTopicAppearance(topicAppFullId) {
  const topicAppId = getShortID(topicAppFullId)
  let topicApp
  await axiosGetEntities(`topicAppearance/${topicAppId}?_join=topic,hasTypeAppearance`)
    .then(resp => topicApp = getResponseBody(resp)[0])
    .catch(error => console.log(error))
  return topicApp
}

async function createExistingGenerationData (quizAssignment) {
  let output
  if (quizAssignment.hasTopicAppearance.length === 0) {
    output = [topicExistingData(-1, "All topics", quizAssignment.questionsAmount, quizAssignment.hasTypeAppearance), true]
  } else {
    await quizAssignment.hasTopicAppearance.reduce(async (acc, topicApp) => {
      const currentAcc = await acc
      const topicAppData = await getTopicAppearance(topicApp['@id'])
      currentAcc.push(topicExistingData(topicAppData.topic[0]['@id'], topicAppData.topic[0].name, topicAppData.questionsAmount, topicAppData.hasTypeAppearance, topicAppData.hasTypeAppearance.length === 0))
      return currentAcc
    },[])
      .then(result => {
        output = [topicExistingData(-1, "All topics", quizAssignment.questionsAmount, quizAssignment.hasTypeAppearance, false)].concat(result)
      })
  }
  return output
}

export async function getQuizAssignmentInfo (quizAssignmentType, quizAssignmentId) {
  let quizInfo = {}
  let join = ''
  if (
    quizAssignmentType ===
    QuizAssignmentTypesEnums.manualQuizAssignment.middlename
  ) {
    join = 'hasQuizTakePrototype'
  } else if (
    quizAssignmentType ===
    QuizAssignmentTypesEnums.generatedQuizAssignment.middlename
  ) {
    join = 'hasTopicAppearance'
  }
    await axiosGetEntities(`${quizAssignmentType}/${quizAssignmentId}?_join=${join},assignedTo`)
    .then(async (response) => {
      const quizAssignment = getResponseBody(response)[0]
      if (
        quizAssignment
      ) {
        quizInfo.title = quizAssignment.name
        quizInfo.description = quizAssignment.description
        quizInfo.startDate = quizAssignment.startDate
        quizInfo.endDate = quizAssignment.endDate
        quizInfo.shuffleQuestion = quizAssignment.shuffleQuestion

        quizInfo.showResult = quizAssignment.showResult || false
        quizInfo.showQuestionResult = quizAssignment.showQuestionResult || false
        if (quizAssignment.timeLimit) {
          quizInfo.unlimitedTime = quizAssignment.timeLimit === -1
          quizInfo.timeLimit = quizAssignment.timeLimit === -1 ? '' : quizAssignment.timeLimit.toString()
        }
        else {
          quizInfo.unlimitedTime= true
          quizInfo.timeLimit = -1
        }

        quizInfo.covers = quizAssignment.covers
        quizInfo.requires = quizAssignment.requires
        quizInfo.mentions = quizAssignment.mentions

        quizInfo.agents = quizAssignment.assignedTo

        quizInfo.type = quizAssignment['@type']
        //MANUAL
        if (quizAssignment['@type'] === QuizAssignmentTypesEnums.manualQuizAssignment.id) {
          if (
            quizAssignment.hasQuizTakePrototype &&
            quizAssignment.hasQuizTakePrototype.length
          ) {
            quizInfo.quizTakePrototypeId = quizAssignment.hasQuizTakePrototype[0]['@id']
          }
          //GENERATED
        } else {
          quizInfo.pointsPerQuestion = quizAssignment.pointsPerQuestion
          quizInfo.excludeEssay = quizAssignment.excludeEssay || false
          await createExistingGenerationData(quizAssignment).then(result => quizInfo.generationData = result)
        }
      }
    })
    .catch(error => console.log(error))
  return quizInfo
}

export async function getQuizQuestions(orderedQuestionList) {
  const questionsRaw = await orderedQuestionList.reduce( async (acc, ordQuestionId) => {
    const currentAcc = await acc
    await axiosGetEntities(`orderedQuestion/${getShortID(ordQuestionId['@id'])}`)
      .then(response => currentAcc.push(getResponseBody(response)[0]))
      .catch(error => console.log(error))
    return currentAcc
  },[])

  return await questionsRaw.reduce(async (acc, orderedQuestion) => {
    const currentAcc = await acc
    await axiosGetEntities(`question/${getShortID(orderedQuestion.question[0]['@id'])}?_join=hasAnswer`)
      .then(async (response) => {
        const questionData = getResponseBody(response)[0]
        const question = {
          id: questionData['@id'],
          questionType: questionData['@type'],
          title: questionData.name,
          questionText: questionData.text,
          ofTopic: questionData.ofTopic[0],
        }
        const questionBase = {
          ...orderedQuestion,
          question: setAnswers(question, questionData),
        }
        if (questionBase.question.questionType === QuestionTypesEnums.open.id || questionBase.question.questionType === QuestionTypesEnums.essay.id) questionBase.userAnswer = questionBase.userAnswer[0]['@id']
        else questionBase.userAnswer = questionBase.userAnswer.map(uA => uA['@id'])
        currentAcc.push(await setExistingUserAnswers(questionBase))
      }).catch(error => console.log(error))
    return currentAcc
  }, [])
}

export function evaluate(question) {
  let points = question.points
  switch (question.question.questionType) {
    case QuestionTypesEnums.multiple.id:
      question.question.answers.map(answer => {
        if (question.userAnswer
          .find(uA => uA.predefinedAnswer === answer.id).userChoice !== answer.correct)
          points = 0
      })
      return points
    case QuestionTypesEnums.essay.id:
      return 0
    case QuestionTypesEnums.open.id:
      if (!RegExp(question.question.regexp).test(question.userAnswer))
        points = 0
      return points

    case QuestionTypesEnums.ordering.id:
      question.question.orderAnswers.map(answer => {
        const userAnswer = question.userAnswer.find(uA => uA.orderingAnswer === answer.id)
        if (answer.position !== userAnswer.userChoice) {
          points = 0
        }
      })
      return points

    case QuestionTypesEnums.matching.id:
      question.question.matchPairs.map(pair => {
        const userAnswer = question.userAnswer.find(uA => uA.matchPair === pair.id)
        if (pair.answer !== userAnswer.userChoice)
          points = 0
      })
      return points

    default:
      return 0
  }
}

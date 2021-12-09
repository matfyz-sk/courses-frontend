import { QuestionTypesEnums } from './type-enums'
import React from 'react'

export function typeData () {
  return [{id: -1, number: 0, name: "All types", all: true}].concat(
    Object.values(QuestionTypesEnums).reduce((acc, type) => {
      acc.push({
        id: type.id,
        number: 0,
        name: type.name,
        all: false
      })
      return acc
    },[])
  )
}
export function topicData (topicId, topicName) {
  return {
    id: topicId,
    name: topicName,
    number: 0,
    types: typeData(),
    all: true
  }
}

export function createGenerationData (topicsSelected, questions) {
  const topicsNotEmpty = topicsSelected.filter(topic =>
    questions.reduce((acc,question) => question.question.topic === topic.id ? ++acc : acc, 0) > 0 )
  return [topicData(-1, "All topics")].concat(
    topicsNotEmpty.reduce((acc,topic) => {
      acc.push(topicData(topic.id, topic.name))
      return acc
    }, []))
}

export function validateGenerationData  (
  generationData,
  setWarningGeneration,
)  {
  let invalidTopics = []
  if (generationData[0].number === 0) {
    setWarningGeneration('Number of questions has to be' +
      ' greater than 0')
    return false
  }
  if (generationData[0].all){
    if (!generationData[0].types[0].all && generationData[0].types[0].number < generationData[0].number) {
      setWarningGeneration('Not enough questions selected')
      return false
    }
  } else {
    generationData.map(topic => {
      if (topic.id !== -1 && !topic.types[0].all){
        if (topic.types[0].number < topic.number) invalidTopics.push(topic.name)
      }
    })
    if (invalidTopics.length > 0) {
      setWarningGeneration(`Not enough questions selected in topics:\n${invalidTopics.join("\n")}`)
      return false
    }
  }
  return true
}

export function shuffle(arr) {
  let i = arr.length;
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[ri]] = [arr[ri], arr[i]];
  }
  return arr;
}

export function getRandomQuestions(questions, count) {
  let shuffled = questions.slice(0), i = questions.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

export function generateQuestions(generationData, availableQuestions) {
  let generatedQuestions = []
  if (generationData[0].all){
    if (generationData[0].types[0].all){
      generatedQuestions = getRandomQuestions(availableQuestions, generationData[0].number)
    } else {
      generationData[0].types.map(type => {
        if (type.id !== -1) {
          const questionsOfType = availableQuestions.filter(question => question.question.questionType === type.id)
          if (type.number > 0) generatedQuestions = generatedQuestions.concat(getRandomQuestions(questionsOfType, type.number))
        }
      })
    }
  } else {
    generationData.map(topic => {
      const questionsOfTopic = availableQuestions.filter(question => question.question.topic === topic.id)
      if (topic.id !== -1 && topic.types[0].all){
        generatedQuestions = generatedQuestions.concat(getRandomQuestions(questionsOfTopic, topic.number))
      } else {
        topic.types.map(type => {
          if (type.id !== -1) {
            const questionsOfTopicAndType = questionsOfTopic.filter(question => question.question.questionType === type.id)
            generatedQuestions = generatedQuestions.concat(getRandomQuestions(questionsOfTopicAndType, type.number))
          }
        })
      }
    })
  }
  return shuffle(generatedQuestions)
}

export function generateQuestionsRaw(generationData, availableQuestions) {
  let generatedQuestions = []
  if (generationData[0].all){
    if (generationData[0].types[0].all){
      generatedQuestions = getRandomQuestions(availableQuestions, generationData[0].number)
    } else {
      generationData[0].types.map(type => {
        if (type.id !== -1) {
          const questionsOfType = availableQuestions.filter(question => question['@type'] === type.id)
          if (type.number > 0) generatedQuestions = generatedQuestions.concat(getRandomQuestions(questionsOfType, type.number))
        }
      })
    }
  } else {
    generationData.map(topic => {
      const questionsOfTopic = availableQuestions.filter(question => question.ofTopic[0]['@id'] === topic.id)
      if (topic.id !== -1 && topic.types[0].all){
        generatedQuestions = generatedQuestions.concat(getRandomQuestions(questionsOfTopic, topic.number))
      } else {
        topic.types.map(type => {
          if (type.id !== -1) {
            const questionsOfTopicAndType = questionsOfTopic.filter(question => question['@type'] === type.id)
            generatedQuestions = generatedQuestions.concat(getRandomQuestions(questionsOfTopicAndType, type.number))
          }
        })
      }
    })
  }
  return shuffle(generatedQuestions)
}


import { QuestionTypesEnums } from "../question/question/question-new-data"

function setAnswers (question, questionData) {
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
      question.regexp = questionData.regexp
      break
    case QuestionTypesEnums.essay.id:
      question.essay = questionData.essay
      break
    case QuestionTypesEnums.ordering.id:
      question.orderAnswers = questionData.hasAnswer.map (
        answer => {
          const { text, position } =
            answer
          return {id: answer['@id'],
            text, position }
        }
      )
      break
    case QuestionTypesEnums.matching.id:
      question.matchPairs = questionData.hasAnswer.map(
        ans => {
          const { prompt, answer, position } = ans
          return {id: ans['@id'],
            prompt, answer, position}
        }
      )
      break
    default:
      break
  }
  return question
}

export default setAnswers

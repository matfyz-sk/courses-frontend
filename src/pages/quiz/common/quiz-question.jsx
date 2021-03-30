import React from 'react'
import {Paper,Typography} from '@material-ui/core'
import { QuestionTypesEnums } from "../question/question/question-new-data"
import {useStyles} from './styles'
import QuestionAnswers from "../question/question/question-answers";
import AnswerComponentOpen from "../question/common/answer-component/answer-component-open";
import AnswerComponentOrder from "../question/common/answer-component/answer-component-order";
import {AnswerComponentMatch} from "../question/common/answer-component/answer-component-match";

function formatDate(date){
  const datetime = new Date(date)
  return `${datetime.getDate()}.${datetime.getMonth()+1}.${datetime.getFullYear()}`
}

function QuizQuestion({
                        question,
                        variant,
                      }) {

  const style = useStyles()

  function getAnswerContent(question) {
    switch (question.questionType) {
      case QuestionTypesEnums.multiple.id:
        return (
          <div>
            <QuestionAnswers
              answers={question.answers}
              quiz = {true}
            />
          </div>
        )
      case QuestionTypesEnums.open.id:
        return (
          <AnswerComponentOpen
            setRegexp={false}
            regexp={question.regexp}
            quiz = {true}
          />
        )
      case QuestionTypesEnums.ordering.id:
        question.orderAnswers && question.orderAnswers.sort((a,b) => a.position < b.position ? -1 : 1)
        return (
          <AnswerComponentOrder
            orderAnswers={question.orderAnswers}
            orderAnswersColumn={
              {
                id: "answerColumn",
                title: "Answers in correct order",
                answersPositions: question.orderAnswers.map(answer => answer.position),
              }
            }
            quiz={true}
          />
        )
      case QuestionTypesEnums.matching.id:
        question.matchPairs && question.matchPairs.sort((a,b) => a.position < b.position ? -1 : 1)
        const matchAnswersAdapted = question.matchPairs && question.matchPairs.reduce((acc,pair) => {
          const answer = {
            id: pair.position,
            text: pair.answer,
          }
          acc.push(answer)
          return acc
        },[]).map(answer => answer.id === question.matchPairs.find(pair => pair.answer === answer.text).position ? answer : {...answer,text:''})
        const matchPairsAdapted = question.matchPairs && question.matchPairs.reduce((acc,pair) => {
          const pairAdapted = {
            position: pair.position,
            promptText: pair.prompt,
            answerId: matchAnswersAdapted.find(answer => answer.text === pair.answer).id,
          }
          acc.push(pairAdapted)
          return acc
        },[])
        return (
          <AnswerComponentMatch
            matchAnswers = {matchAnswersAdapted}
            pairs = {matchPairsAdapted}
            quiz = {true}
          />
        )
      default:
        return null
    }
  }

  return (
    <Paper variant='outlined' className={style.QQ_root}>
      {variant === 'quizSelectionPreview' &&
      <div>
        <Typography variant="subtitle1" className={style.QQ_questionDate}>created {formatDate(question.question.createdAt)}</Typography>
        <Typography
          variant="subtitle1"
          className={style.QQ_questionText}
        >{question.question.questionText}</Typography>
      </div>
      }
      {variant === 'quizOverview' &&
      <div className={style.QQ_info}>
        <Typography
          variant="subtitle1"
          className={style.QQ_questionTextOverview}
        >{question.question.questionText}</Typography>
        <Typography variant="subtitle1" className={style.QQ_questionPoints}>
          {question.points} {question.points === '1' ? 'point' : 'points'}
        </Typography>
      </div>
      }
      {getAnswerContent(question.question)}
    </Paper>
  )
}

export default QuizQuestion

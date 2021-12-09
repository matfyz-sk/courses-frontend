import React from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import { QuestionTypesEnums } from './functions/type-enums'
import { customTheme, useStyles } from './style/styles'
import QuestionAnswers from '../question/question/question-answers'
import AnswerComponentOpen from '../question/common/answer-component/answer-component-open'
import AnswerComponentOrder from '../question/common/answer-component/answer-component-order'
import { AnswerComponentMatch } from '../question/common/answer-component/answer-component-match'
import AnswerComponentEssay from '../question/common/answer-component/answer-component-essay'
import { evaluate } from './functions/fetch-data-functions'
import { green, grey, red } from '@material-ui/core/colors'
import { FaCheckCircle, FaQuestionCircle, FaTimesCircle } from 'react-icons/all'
import { formatDate } from './functions/common-functions'

function QuizQuestion({
                        question,
                        index,
                        variant,
                        resetQuestion,
                      }) {

  const style = useStyles()

  function getAnswerContent() {
    const finalVariant = variant === 'quizReview' || variant === 'quizResult' || variant === 'quizGradedUser'
    switch (question.question.questionType) {
      case QuestionTypesEnums.multiple.id:
        return (
          <QuestionAnswers
            answers={question.question.answers}
            userAnswer={question.userAnswer}
            setUserAnswer={question.setUserAnswer}
            finalAnswer={finalVariant ? true : undefined}
          />
        )
      case QuestionTypesEnums.open.id:
        return (
          finalVariant && question.userAnswer === "" ?
            <Typography color='textSecondary'><em>No answer</em></Typography> :
            <AnswerComponentOpen
              regexp={question.question.regexp}
              userAnswer={question.userAnswer}
              setUserAnswer={question.setUserAnswer}
              finalAnswer={finalVariant ? true : undefined}
            />
        )
      case QuestionTypesEnums.essay.id:
        return (
          finalVariant && question.userAnswer === "" ?
            <Typography color='textSecondary'><em>No answer</em></Typography> :
            <AnswerComponentEssay
              userAnswer={question.userAnswer}
              setUserAnswer={finalVariant ? undefined : question.setUserAnswer}
            />
        )
      case QuestionTypesEnums.ordering.id:
        return (
          <AnswerComponentOrder
            orderAnswers={question.question.orderAnswers}
            userAnswer={question.userAnswer}
            setUserAnswer={question.setUserAnswer}
            finalAnswer={finalVariant ? true : undefined}
          />
        )
      case QuestionTypesEnums.matching.id:
        const matchAnswers = [...new Set(question.question.matchPairs.map(pair => pair.answer))]
        return (
          <AnswerComponentMatch
            matchAnswers={matchAnswers}
            pairs={question.question.matchPairs}
            userAnswer={question.userAnswer}
            setUserAnswer={question.setUserAnswer}
            finalAnswer={finalVariant ? true : undefined}
          />
        )
      default:
        return null
    }
  }

  const getQuestionItem = () => {
    switch (variant) {
      case "answersRaw":
        return (
          <Box
            key={question.question.id}
            padding={3}
            border={`1px solid ${grey[300]}`}
          >
            {getAnswerContent()}
          </Box>
        )
      //quizAssignment + question
      case "questionPreview":
        return (
          <Box padding={1} marginTop={1} marginBottom={1}>
            <Typography className={style.QO_infoText}>
              created {formatDate(question.question.createdAt)}
            </Typography>
            <Typography className={style.QQ_questionText}>
              {question.question.questionText}
            </Typography>
            <Box width='100%'>
              {getAnswerContent()}
            </Box>
          </Box>
        )
      //quizAssignment overview
      case "quizOverview":
        return (
          <Box padding={1} marginTop={1} marginBottom={1}>
            <Typography className={style.QO_infoText}>
              {question.points} {question.points === '1' ? 'point' : 'points'}
            </Typography>
            <Typography className={style.QQ_questionText}>
              {question.question.questionText}
            </Typography>
            <Box width='100%'>
              {getAnswerContent()}
            </Box>
          </Box>
        )
      //taking quiz
      case "selfQuizTake":
      case "quizTake":
        return (
          <Box>
            <Box
              padding={3}
              marginBottom={1}
              bgcolor={grey[100]}
            >
              <Box display='flex' width='100%' marginBottom={3}>
                <Box width='50%' display='flex' justifyContent='flex-start' alignItems='center'>
                  <Typography>Question {index + 1}</Typography>
                  {variant === "quizTake" &&
                  <Typography className={style.QO_infoText}
                              style={{ marginLeft: 5 }}>
                    | {question.points} {question.points === 1 ? 'point' : 'points'}</Typography>}
                </Box>
                <Box width='50%' display='flex' justifyContent='flex-end'>
                  <Button
                    size='small'
                    style={{
                      color: customTheme.palette.error.main,
                      borderColor: customTheme.palette.error.main,
                      height: 35
                    }}
                    variant='outlined'
                    onClick={e => resetQuestion(question)}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
              <Typography><b>{question.question.questionText}</b></Typography>
            </Box>
            <Box padding={3}>
              {getAnswerContent()}
            </Box>
          </Box>
        )
      //show userAnswers after quiz + teacher reviewing quiz
      case "quizResult":
      case "quizGradedUser":
      case "quizGradedCorrect":
      case "quizReview":
        const correct = variant === "quizReview" ? question.ogScore === question.points : evaluate(question)
        if (variant === 'quizGradedCorrect') question={ ...question, userAnswer: null }
        const borderStyle = "3px solid"
        return (
          <Box
            key={question.question.id}
            marginTop={3}
            marginBottom={variant === "quizResult" ? 6 : 0}
            border={`1px solid ${grey[300]}`}
            borderBottom={variant === "quizReview" ? 0 : `1px solid ${grey[300]}`}
          >
            <Box
              padding={2}
              paddingLeft={3}
              paddingRight={3}
              bgcolor={grey[100]}
              borderBottom={question.question.questionType === QuestionTypesEnums.essay.id ?
                `${borderStyle} ${grey[500]}` : correct ?
                  `${borderStyle} ${green[700]}` : `${borderStyle} ${red[500]}`}
            >
              {question.question.questionType === QuestionTypesEnums.essay.id ?
                variant!=='quizGraded' &&
                <Box display='flex' width='100%' alignItems='center'>
                  <FaQuestionCircle color={customTheme.palette.text.secondary} />
                  <Typography
                    variant='button'
                    style={{ color: customTheme.palette.text.secondary, marginLeft: 5 }}
                  >
                    {variant === "quizResult" ? "Question will be graded by the teacher" : variant === 'quizReview' ? "Requires grading" : "Graded by the teacher"}
                  </Typography>
                </Box>
                :
                <Box display='flex' width='100%' alignItems='flex-end'>
                  <Box width='50%' display='flex' justifyContent='flex-start' alignItems='center'>
                    {correct ?
                      <FaCheckCircle color={customTheme.palette.primary.main} /> :
                      <FaTimesCircle color={customTheme.palette.error.main} />}
                    <Typography
                      variant='button'
                      style={{
                        color: correct ? customTheme.palette.primary.main : customTheme.palette.error.main,
                        marginLeft: 5,
                      }}
                    >
                      {correct ? 'Correct' : 'Incorrect'}
                    </Typography>
                  </Box>
                </Box>}
              <Box marginTop={3}>
                <Typography className={style.QQR_questionText}>
                  {question.question.questionText}
                </Typography>
              </Box>
            </Box>
            <Box padding={3}>
              {getAnswerContent()}
            </Box>
          </Box>
        )
    }
  }

  return (
    <Box width='100%'>
      {getQuestionItem()}
    </Box>
  )
}

export default QuizQuestion

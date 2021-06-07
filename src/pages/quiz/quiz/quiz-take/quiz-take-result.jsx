import React from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import { customTheme, useStyles } from '../../common/style/styles'
import QuizQuestion from '../../common/quiz-question'
import { ThemeProvider } from '@material-ui/styles'
import { evaluate } from '../../common/functions/fetch-data-functions'

function QuizTakeResult({
                          match,
                          history,
                          quizQuestions,
                          showResult,
                          showQuestionResult,
                        }) {

  const style = useStyles()

  const handleExit = () => {
    history.push({pathname: `/courses/${match.params.courseId}/quiz/quizAssignmentsOverview`})
  }

  const getQuizResult = () => {
    return (
      <Box>
        <Box className={style.centeredSection}>
          <Typography variant='h5'>
            <b>Your score:</b>
          </Typography>
        </Box>
        <Box className={style.centeredSection} marginBottom={3}>
          <Typography variant='h4'>
            {quizQuestions.reduce((acc, question) => acc+evaluate(question), 0)}/{quizQuestions.reduce((acc, question) => acc+question.points, 0)}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        paddingTop={5}
        paddingBottom={5}
        marginBottom={5}
      >
        <Box className={style.centeredSection} marginBottom={3}>
          <Typography variant='h5'>
            Quiz successfully submitted
          </Typography>
        </Box>
        {showResult && getQuizResult()}
        {showQuestionResult && quizQuestions.map((question,index) => {
          return (
            <QuizQuestion
              index={index}
              correct={false}
              question={question}
              variant='quizResult'
            />
          )
        })
        }
        <Box className={style.centeredSection}>
          <Button
            variant='contained'
            color='primary'
            onClick={e => handleExit()}
          >
            <Typography variant='button' style={{ fontSize: 18 }}>
              Close quiz take
            </Typography>
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default QuizTakeResult

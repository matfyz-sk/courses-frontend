import React, { useEffect, useState } from 'react'
import { QuestionTypesEnums } from '../../common/functions/type-enums'
import { Box, Button, ButtonGroup, ThemeProvider, Typography } from '@material-ui/core'
import { useLocation } from 'react-router'
import QuizQuestion from '../../common/quiz-question'
import { customTheme, useStyles } from '../../common/style/styles'
import { grey } from '@material-ui/core/colors'
import { evaluate, getQuizQuestions } from '../../common/functions/fetch-data-functions'
import { Alert } from '@material-ui/lab'

function QuizTakeStudentResult ({courseInstanceId,
                                  userId,
                                  isTeacher,
                                  token,
                                  match,
                                  history,
                                }) {

  const style = useStyles()
  const location = useLocation()
  const [quizQuestions, setQuizQuestions] = useState(null)

  const [loading, setLoading] = useState(true)

  const [openedCorrect, setOpenedCorrect] = useState([])

  useEffect(() => {
    const fetchOrderedQuestions = async () => {
      return await getQuizQuestions(quizAssignment.quizTake.orderedQuestion)
    }

    const quizAssignment = location.state.quizAssignment

    if (quizAssignment.quizTake) {
      fetchOrderedQuestions().then(resp => {
        setQuizQuestions(resp)
        setLoading(false)
      })
    }

  },[location])

  const openCorrectAnswer = (questionId) => {
    const index = openedCorrect.indexOf(questionId)
    const newOpened = [...openedCorrect];
    if (index === -1) {
      newOpened.push(questionId);
    } else {
      newOpened.splice(index, 1);
    }
    setOpenedCorrect(newOpened);
  }

  function questionItem(question, index) {
    return (
      <Box key={question.question.id}>
        <QuizQuestion
          index={index}
          question={question}
          variant= {openedCorrect.indexOf(question.question.id) === -1 ? "quizGradedUser" : "quizGradedCorrect"}
        />
        <Box width='100%' padding={3} style={{ backgroundColor: grey[100] }} marginBottom={6}
             border={`1px solid ${grey[300]}`} borderTop={0}>
          <Box width='100%' display='flex' alignItems='center'>
            <Box display='flex' alignItems='center' paddingBottom={question.comment ? 3 : 0} width='50%'>
              <Typography style={{ fontSize: 19 }}> Score: </Typography>
              <Typography style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 16
              }}>{question.score} / {question.points}</Typography>
            </Box>
            <Box width='50%' display='flex' alignItems='center' justifyContent='flex-end' paddingBottom={question.comment ? 3 : 0}>
              {!evaluate(question) && question.question.questionType !== QuestionTypesEnums.essay.id &&
              <ButtonGroup color='primary' size='small' disableElevation onClick={e => openCorrectAnswer(question.question.id)}>
                <Button variant={openedCorrect.indexOf(question.question.id) === -1 ? 'contained' : 'outlined'}>Your answer</Button>
                <Button variant={openedCorrect.indexOf(question.question.id) !== -1 ? 'contained' : 'outlined'}>Correct answer</Button>
              </ButtonGroup>}
            </Box>
          </Box>
          {question.comment &&
          <Box display='flex' width='100%'>
            <Box width='18%'>
              <Typography style={{ fontSize: 18 }}> Teacher's comment: </Typography>
            </Box>
            <Box width='82%'>
              <Typography style={{ fontSize: 18 }}><em>{question.comment}</em></Typography>
            </Box>
          </Box>
          }
        </Box>
      </Box>
    )
  }

  const getResult = (quizQuestions) => {
    const maxScore = quizQuestions.reduce((acc, question) => acc + question.points, 0)
    const score = quizQuestions.reduce((acc, question) => acc + question.score, 0)
    const percentage = (score / maxScore) * 100
    return (
      <Box marginBottom={5} marginTop={5}>
        <Box className={style.centeredSection} marginBottom={1}>
          <h2>Result</h2>
        </Box>
        <Box className={style.centeredSection} marginBottom={3}>
          <Typography variant='h4'>
            {percentage.toFixed(1)}%
          </Typography>
        </Box>
      </Box>
    )
  }

  const handleExit = () => {
    history.push({pathname: `/courses/${match.params.courseId}/quiz/quizAssignmentsOverview`})
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box className={style.root}>
        {loading?
          <Alert severity='success' icon={false}>Loading...</Alert>
          :
          <Box>
            {quizQuestions && getResult(quizQuestions)}
            {quizQuestions && quizQuestions.map((question, index) => {
              return (
                questionItem(question, index)
              )
            })}
            <Box className={style.centeredSection}>
              <Button
                variant='outlined'
                color='primary'
                onClick={e => handleExit()}
              >
                <Typography variant='button' style={{ fontSize: 18 }}>
                  Close
                </Typography>
              </Button>
            </Box>
          </Box>}
      </Box>
    </ThemeProvider>
  )
}

export default QuizTakeStudentResult

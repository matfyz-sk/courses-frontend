import React, { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core'
import { customTheme, useStyles } from '../../common/style/styles'
import QuizQuestion from '../../common/quiz-question'
import { setUserAnswers } from '../../common/functions/answers-functions'
import { FaExclamationCircle } from 'react-icons/all'
import { grey } from '@material-ui/core/colors'
import { formatDateTime } from '../../common/functions/common-functions'

function QuizTakeQuiz({
                        quizQuestions,
                        setQuizQuestions,
                        timeLimit,
                        startTime,
                        endDate,
                        endQuiz,
                      }) {

  const style = useStyles()

  const [counter, setCounter] = useState(-1);
  const [expectedEndTime, setExpectedEndTime] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [forcedEndReason, setForcedEndReason] = useState("")
  const [forcedEndReasonDesc, setForcedEndReasonDesc] = useState("")

  useEffect(() => {
    let startTimeNew
    startTimeNew = new Date(startTime)
    startTimeNew.setMinutes(startTimeNew.getMinutes()+timeLimit)
    setExpectedEndTime(startTimeNew)
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      const newCounter = (expectedEndTime - new Date()) / 1000
      if (newCounter >= 0) setCounter(newCounter)

      const minutes = Math.floor(newCounter/60)
      const seconds = Math.floor(newCounter - minutes*60)

      if (timeLimit !== -1 && minutes === 0 && seconds === 0) {
        setForcedEndReason("Time limit exceeded")
        setForcedEndReasonDesc("You have reached the time limit set for this quiz.")
        handleOpen()
      }
      const endDateData = new Date(endDate)
      if (endDateData < new Date()) {
        setForcedEndReason("Quiz is no longer available")
        setForcedEndReasonDesc(`The deadline for the quiz was ${formatDateTime(endDate)}.`)
        handleOpen()
      }

    }, 1000 );

    return () => clearInterval(interval);
  }, [expectedEndTime])

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const timeColor = (minutes) => {
    if (minutes === 0) return `${customTheme.palette.error.main}`
    return `${customTheme.palette.text.primary}`
  }

  const getCountdown = () => {
    let minutes = Math.floor(counter/60)
    let seconds = Math.floor(counter - minutes*60)
    if (counter !== -1) return (
      <Box display='flex' alignItems='center'>
        {minutes === 0 && <FaExclamationCircle style={{ marginRight: 7 }} color={customTheme.palette.error.main} />}
        <Typography variant='subtitle1' style={{marginRight: 10, fontSize: 18}}>Time left:</Typography>
        <Typography variant='subtitle1' style={{fontWeight: 'bold', fontSize: 18, color: `${timeColor(minutes)}`}}>{String(minutes).padStart(2, "0")} min</Typography>
        <Typography variant='subtitle1' style={{fontSize: 18, marginLeft: 5, color: `${timeColor(minutes)}`}}>{String(seconds).padStart(2, '0')} sec</Typography>
      </Box>
    )
  }

  const resetQuestion = (question) => {
    let newQuestions = [...quizQuestions]
    const index = quizQuestions.map(q => q.question.id).indexOf(question.question.id)
    newQuestions[index] = setUserAnswers(question)
    setQuizQuestions(newQuestions)
  }

  return (
    <Box>
      {timeLimit !== -1 && <AppBar className={style.QT_appbar} elevation={0}>
        <Box display='flex' width='100%' alignItems='center'>
          <Box width='50%' display='flex' justifyContent='flex-start'>
          </Box>
          <Box width='50%' display='flex' justifyContent='flex-end'>
            {getCountdown()}
          </Box>
        </Box>
      </AppBar>}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openDialog}
      >
        <DialogTitle>{forcedEndReason}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {forcedEndReasonDesc} Quiz will be submitted now.
          </DialogContentText>
        </DialogContent>
        <DialogActions className={style.centeredSection}>
          <Button onClick={endQuiz} color="primary" variant='contained'>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Box marginBottom={5} borderTop={0}>
      {quizQuestions && quizQuestions.map((question,index) => {
          return (
            <Box key={question.question.id} marginTop={5} marginBottom={5} border={`1px solid ${grey[300]}`}>
              <QuizQuestion
                index={index}
                question={question}
                variant='quizTake'
                resetQuestion={resetQuestion}
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default QuizTakeQuiz

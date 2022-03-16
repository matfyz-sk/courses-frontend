import React, { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { customTheme, useStyles } from '../../common/style/styles'
import { grey } from '@material-ui/core/colors'
import {
  BiReset,
  BsDashSquareFill,
  BsPlusSquareFill,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
} from 'react-icons/all'
import { axiosUpdateEntity, getShortID } from '../../../../helperFunctions'
import { useLocation } from 'react-router'
import { ThemeProvider } from '@material-ui/styles'
import QuizQuestion from '../../common/quiz-question'
import { QuestionTypesEnums } from '../../common/functions/type-enums'

function QuizTakeReview({
                          courseInstanceId,
                          userId,
                          isTeacher,
                          token,
                          match,
                          history,
                        }) {

  const style = useStyles()

  const location = useLocation()
  const quizTake = location.state.quizTake
  const quizTakesData = location.state.quizTakesData

  const [quizQuestions, setQuizQuestions] = useState(quizTake.orderedQuestion)

  const [onlyForGrading, setOnlyForGrading] = useState(false)
  const [reviewState, setReviewState] = useState("")

  const [showConfirmNextQuiz, setShowConfirmNextQuiz] = useState(null)

  const questionsForGrading = quizQuestions ? quizQuestions.filter(q => q.question.questionType === QuestionTypesEnums.essay.id) : []

  const saveReview = async (publish) => {
    let quizQuestionsUpdated = [...quizQuestions]
    await quizQuestionsUpdated.map(async (orderedQuestion) => {
      const ordQData = {
        comment: orderedQuestion.comment,
        score: orderedQuestion.score,
      }
      const orderedQuestionId = getShortID(orderedQuestion['@id'])
      await axiosUpdateEntity(ordQData, `orderedQuestion/${orderedQuestionId}`)
        .then(response => console.log(response))
        .catch(error => console.log(error))
      orderedQuestion.ogComment = orderedQuestion.comment
      orderedQuestion.ogScore = orderedQuestion.score
    })
    const maxScore = quizQuestions.reduce((acc, question) => acc + question.points, 0)
    const score = quizQuestions.reduce((acc, question) => acc + question.score, 0)
    const percentage = ((score / maxScore) * 100).toFixed(1)
    setQuizQuestions(quizQuestionsUpdated)

    const reviewedDate = new Date()
    let qTData = { reviewedDate: reviewedDate, score: percentage }
    qTData.publishedReview = publish
    await axiosUpdateEntity(qTData, `quizTake/${getShortID(quizTake['@id'])}`)
      .then(response => console.log(response))
      .catch(error => console.log(error))
    quizTake.reviewedDate = reviewedDate
    quizTake.publishedReview = publish
    quizTake.score = percentage
    setReviewState(publish ? "published" : "saved")
  }

  const setComment = (text, index) => {
    setReviewState("")
    let newState = [...quizQuestions]
    newState[index].comment = text
    setQuizQuestions(newState)
  }

  const setScore = (val, index) => {
    setReviewState("")
    let newState = [...quizQuestions]
    newState[index].score = val
    setQuizQuestions(newState)
  }

  const handleBack = () => {
    const quizId = getShortID(location.state.quizAssignmentFullId)
    history.push({
      pathname: `/courses/${match.params.courseId}/quiz/quizTakesOverview/${quizId}`,
      state: {
        ...location.state,
      }
    })
  }

  const controlChangesMade = (quizTake) => {
    const changesMade = quizQuestions.some(question => question.ogComment !== question.comment || question.ogScore !== question.score)
    if (changesMade) setShowConfirmNextQuiz(quizTake)
    else handleOpenTake(quizTake)
  }

  const handleOpenTake = (quizTake) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (quizTake === -1) {
      handleBack()
      return
    }
    const quizTakeId = getShortID(quizTake['@id'])
    history.push({
      pathname: `/courses/${match.params.courseId}/quiz/quizTakeReview/${quizTakeId}`,
      state: {
        ...location.state,
        quizTake: quizTake,
      }
    })
  }

  const handleFocusComment = (index) => {
    let newState = [...quizQuestions]
    newState[index].focusComment = true
    setQuizQuestions(newState)
  }

  const handleBlurComment = (index) => {
    let newState = [...quizQuestions]
    newState[index].focusComment = false
    setQuizQuestions(newState)
  }

  const optimizeEmptyPoints = (event, index) => {
    const newValue = event.target.value
    if (newValue === '') setScore(0, index)
  }

  const handleInputPoints = (event, index) => {
    const newValue = event.target.value.replace(/^0+(?=\d)/, '')
    if (newValue === '' || newValue.match(/^\d+$/))
      setScore(newValue === '' ? '' : parseInt(newValue, 10), index)
  }
  const handlePlusPoints = (question, index) => setScore(question.score === '' ? 1 : question.score + 1, index)
  const handleMinusPoints = (question, index) => setScore(question.score === 0 ? 0 : question.score - 1, index)


  const pointsInput = (question, index) => {
    return (
      <Box className={style.centeredSection}>
        <IconButton
          size='medium'
          color='primary'
          style={{ padding: 3 }}
          onClick={e => handleMinusPoints(question, index)}
        >
          <BsDashSquareFill />
        </IconButton>
        <TextField
          size='small'
          variant='outlined'
          value={question.score}
          style={{
            width: 50,
            marginLeft: 3,
            marginRight: 3,
          }}
          onBlur={e => optimizeEmptyPoints(e, index)}
          onChange={e => handleInputPoints(e, index)}
          inputProps={{
            min: 0,
            maxLength: 3,
            style: { textAlign: 'center', padding: 8, fontSize: 19 }
          }}
        >

        </TextField>
        <IconButton
          size='medium'
          color='primary'
          style={{ padding: 3 }}
          onClick={e => handlePlusPoints(question, index)}
        >
          <BsPlusSquareFill />
        </IconButton>
      </Box>
    )
  }


  function questionItem(question, index) {
    return (
      <Box key = {question.question.id}>
        <QuizQuestion
          index={index}
          question={question}
          variant='quizReview'
        />
        <Box padding={3} style={{ backgroundColor: grey[100] }} marginBottom={6} border={`1px solid ${grey[300]}`} borderTop = {0}>
          <Box display='flex' alignItems='center' paddingBottom={3} overflow='hidden'>
            <Typography style={{ fontSize: 18, marginRight: 15 }}>POINTS:</Typography>
            <Box display='flex' alignItems='center'>
              {pointsInput(question, index)}
              <Typography variant='button' className={style.QO_infoText} style={{
                marginLeft: 10,
                fontSize: 19
              }}>/ {question.points}</Typography>
              <Tooltip
                title={
                  <Typography variant='body2'> Reset to calculated value </Typography>}
                placement='top' arrow enterDelay={2000}>
                <IconButton
                  style={{
                    color: customTheme.palette.error.main,
                    marginLeft: 5,
                    padding: 8,
                    borderRadius: 10,
                  }}
                  onClick={e => setScore(question.ogScore, index)}
                >
                  <BiReset size={27} />
                </IconButton>
              </Tooltip>
            </Box>

          </Box>
          <TextField
            fullWidth
            multiline
            placeholder="Write a comment"
            rows={question.focusComment ? 5 : 1}
            onFocus={e => handleFocusComment(index)}
            onBlur={e => handleBlurComment(index)}
            rowsMax={10}
            variant='outlined'
            size='small'
            value={question.comment}
            style={{ backgroundColor: grey[50] }}
            onChange={e => setComment(e.target.value, index)}
          />
        </Box>
      </Box>
    )
  }

  function quizTakesNav() {
    const currentIndex = quizTakesData.map(take => take['@id']).indexOf(quizTake['@id'])
    return (
      <Box display='flex' width='100%' border={`1px solid ${grey[300]}`}>
        <Box minWidth='20%' display='flex' justifyContent='flex-start'>
          <Button
            color='primary'
            variant='contained'
            fullWidth
            style={{ minHeight: 60 }}
            className={style.GS_topicItemButton}
            onClick={e => controlChangesMade(-1)}
          >
            <FaAngleDoubleLeft size={25} style={{ marginRight: 4 }} />
            All quiz takes
          </Button>
        </Box>
        <Box minWidth='40%' display='flex' justifyContent='flex-start'>
          {currentIndex > 0 &&
          <Button
            color='primary'
            variant='text'
            fullWidth
            className={style.GS_changeTopicButton}
            onClick={e => controlChangesMade(quizTakesData[currentIndex - 1])}
          >
            <FaAngleLeft size={25} />
            Previous quiz take
          </Button>}
        </Box>
        <Box minWidth='40%' display='flex' justifyContent='flex-end'>
          {currentIndex + 1 < quizTakesData.length &&
          <Button
            color='primary'
            variant='text'
            fullWidth
            className={style.GS_changeTopicButton}
            onClick={e => controlChangesMade(quizTakesData[currentIndex + 1])}
          >
            Next quiz take
            <FaAngleRight size={25} />
          </Button>}
        </Box>
      </Box>)
  }

  function getScoreAppBar() {
    const maxScore = quizQuestions.reduce((acc, question) => acc + question.points, 0)
    const score = quizQuestions.reduce((acc, question) => acc + question.score, 0)
    const percentage = (score / maxScore) * 100
    return (
      <Box display='flex'>
        <Typography variant='h6' style={{ fontWeight: 'normal' }}>
          Score:
        </Typography>
        <Typography variant='h6' style={{ marginRight: 10, marginLeft: 10 }}>
          {score} / {maxScore}
        </Typography>
        <Typography variant='h6' style={{ fontWeight: 'normal' }}>
          ({percentage.toFixed(1)}%)
        </Typography>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box marginBottom={5}>
        <AppBar className={style.QTR_appbar} elevation={1}>
          <Box display='flex' width='100%' alignItems='center'>
            <Box width='50%' display='flex' justifyContent='flex-start' alignItems='flex-end'>
              <Typography variant='h6' style={{ fontWeight: 'normal', fontSize: 18 }}>
                Student:
              </Typography>
              <Typography variant='h6' style={{ marginLeft: 10, fontSize: 18 }}>
                {quizTake.createdBy.firstName} {quizTake.createdBy.lastName}
              </Typography>
            </Box>
            <Box width='50%' display='flex' justifyContent='flex-end'>
              {getScoreAppBar()}
            </Box>
          </Box>
        </AppBar>
        <Box display='flex' alignItems='center' padding={3} paddingBottom={0}>
          <Typography>Show only questions that require grading</Typography>
          <Switch
            color='primary'
            onChange={e => setOnlyForGrading(prevState => !prevState)}
          />
        </Box>
        {onlyForGrading ?
          onlyForGrading.length > 0 ?
            onlyForGrading.map((question, index) => {
              return (
                questionItem(question, index)
              )
            })
            :
            <Box padding={3}>
              <em>No questions</em>
            </Box>
            :
            quizQuestions && quizQuestions.map((question, index) => {
              return (
                questionItem(question, index)
              )
            })
        }
        <Box width='100%' marginTop={8} marginBottom={8}>
          <Box className={style.centeredSection}>
            <Button
              variant='outlined'
              color='primary'
              size='large'
              style={{marginRight: 24}}
              onClick={e => saveReview(false)}
            >
              <Typography variant='button' style={{ fontSize: 18 }}>
                Save draft
              </Typography>
            </Button>
            <Button
              variant='contained'
              color='primary'
              size='large'
              onClick={e => saveReview(true)}
            >
              <Typography variant='button' style={{ fontSize: 18 }}>
                Publish review
              </Typography>
            </Button>
          </Box>
          <Collapse in={reviewState !== ""}>
            <Box className={style.centeredSection} marginTop={2}>
              <FaCheck color={customTheme.palette.primary.main} />
              <Typography style={{ fontSize: 17, marginLeft: 5 }}>
                Quiz review {reviewState}
              </Typography>
            </Box>
          </Collapse>
        </Box>

        {quizTakesNav()}
        <Dialog
          open={!!showConfirmNextQuiz}
          onClose={e => setShowConfirmNextQuiz(null)}
        >
          <DialogTitle>{"Do you want to save this review?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This review contains changes that were not saved.
            </DialogContentText>
          </DialogContent>
          <DialogActions className={style.centeredSection}>
            <Button onClick={e => handleOpenTake(showConfirmNextQuiz)} color="primary"
                    variant='outlined'>
              No
            </Button>
            <Button onClick={async e => {
              await saveReview(false)
              handleOpenTake(showConfirmNextQuiz)
            }} color="primary" variant='contained' autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

    </ThemeProvider>
  )
}

export default QuizTakeReview

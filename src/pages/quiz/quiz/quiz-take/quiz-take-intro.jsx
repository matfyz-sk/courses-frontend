import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Typography } from '@material-ui/core'
import { customTheme, useStyles } from '../../common/style/styles'
import { getQuizAssignmentInfo } from '../../common/functions/fetch-data-functions'
import { Alert, AlertTitle } from '@material-ui/lab'
import { ThemeProvider } from '@material-ui/styles'
import {
  axiosAddEntity,
  axiosGetEntities,
  getIRIFromAddResponse,
  getResponseBody,
  getShortID,
  shuffleArray,
} from '../../../../helperFunctions'
import { useLocation } from 'react-router'
import { generateQuestionsRaw } from '../../common/functions/generation_functions'
import { QuestionTypesEnums, QuizAssignmentTypesEnums } from '../../common/functions/type-enums'
import { formatDateTime, union } from '../../common/functions/common-functions'

function QuizTakeIntro({
                         courseInstanceId,
                         userId,
                         isTeacher,
                         token,
                         match,
                         history,
                       }) {

  const style = useStyles()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [timeLimit, setTimeLimit] = useState(0)
  const [shuffleQuiz, setShuffleQuiz] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showQuestionResult, setShowQuestionResult] = useState(false)


  const [numberOfQuestions, setNumberOfQuestions] = useState(0)
  const [pointsForQuiz, setPointsForQuiz] = useState(0)

  const [quizQuestions, setQuizQuestions] = useState( [])

  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const quizAssignmentId = match.params.quizAssignmentId
  const quizAssignmentType = location.state.quizAssignmentType
  const quizAssignmentFullId = location.state.quizAssignmentFullId

  const [quizTakenData, setQuizTakenData] = useState(undefined)

  useEffect(() => {
    const getData = async () => {
      const data = await getQuizAssignmentInfo(quizAssignmentType, quizAssignmentId)
      await getQuizInfo(data).then(result => setQuizQuestions(result))
    }
    userId && getData()
  },[userId])

  async function alreadyTaken () {
    const userIdShort = userId.substring(userId.lastIndexOf('/')+1)
    let takenQuizData = {}
    await axiosGetEntities(`quizTake?createdBy=${userIdShort}`)
      .then((response) => {
        const quizTaken = getResponseBody(response)
          .filter(take => take.quizAssignment.length > 0)
          .find(take => take.quizAssignment[0]['@id'] === quizAssignmentFullId)
        takenQuizData.started = !!quizTaken
        takenQuizData.submitted = quizTaken ? quizTaken.submittedDate : undefined;
        takenQuizData.id = quizTaken ? quizTaken['@id'] : undefined
      })
      .catch(error => console.log(error))
    return takenQuizData
  }

  async function getAllQuestions(topics) {
    let filteredQuestions
    await axiosGetEntities(`question?approver=iri&courseInstance=${getShortID(courseInstanceId)}`)
      .then(response =>{
        const allQuestions = getResponseBody(response)
        filteredQuestions = allQuestions.filter(question => topics.some(topic => topic['@id'] === question.ofTopic[0]['@id']))
      })
      .catch(error => console.log(error))
    return filteredQuestions
  }

  async function getQuizInfo (quizInfo) {

    setTitle(quizInfo.title)
    setDescription(quizInfo.description)
    setStartDate(quizInfo.startDate)
    setEndDate(quizInfo.endDate)
    setShuffleQuiz(quizInfo.shuffleQuestion)

    setShowResult(quizInfo.showResult)
    setShowQuestionResult(quizInfo.showQuestionResult)

    const alreadyTakenData = await alreadyTaken()
    setQuizTakenData(alreadyTakenData)

    //TODO
    if (quizInfo.unlimitedTime) setTimeLimit(-1)
    else setTimeLimit(parseInt(quizInfo.timeLimit,10))

    //MANUAL
    if (quizInfo.type === QuizAssignmentTypesEnums.manualQuizAssignment.id) {
      const quizTakePrototypeId = quizInfo.quizTakePrototypeId
      let questionsRaw
      await axiosGetEntities(`quizTakePrototype/${getShortID(quizTakePrototypeId)}?_join=orderedQuestion`)
        .then( (response) => {
          const quizTakePrototype = getResponseBody(response)[0]
          questionsRaw = quizTakePrototype.orderedQuestion
        })
        .catch(error => console.log(error))
      setNumberOfQuestions(questionsRaw.length)
      setPointsForQuiz(questionsRaw.reduce((acc,question) => acc+question.points,0))
      setLoading(false)

      return questionsRaw
    }
    //GENERATED
    else {
      const now = new Date().getTime()
      const generationData = quizInfo.generationData
      setNumberOfQuestions(quizInfo.generationData[0].number)
      setPointsForQuiz(quizInfo.pointsPerQuestion * quizInfo.generationData[0].number)

      if (!alreadyTakenData.started && new Date(quizInfo.startDate).getTime() <= now && new Date(quizInfo.endDate).getTime() >= now) {
        const topicsUsed = union(union(quizInfo.covers, quizInfo.requires), quizInfo.mentions)
        const allQuestions = await getAllQuestions(topicsUsed).then(response => {
          return quizInfo.excludeEssay ? response.filter(question => question['@type'] !== QuestionTypesEnums.essay.id) : response
        })
        const generatedQuestions = generateQuestionsRaw(generationData, allQuestions)
        setLoading(false)
        return generatedQuestions.reduce((acc, question, index) => {
          acc.push({
            question: question,
            points: quizInfo.pointsPerQuestion,
            position: index,
          })
          return acc
        }, [])
      }
      else setLoading(false)
    }
  }

  function generateQuizTake() {
    let questions
    if (shuffleQuiz) questions = shuffleArray(quizQuestions)
    else questions = quizQuestions

    const quizTakeData = {
      quizAssignment: quizAssignmentFullId,
      orderedQuestion: questions.reduce((acc, oQ) => {
        acc.push({
          points: oQ.points,
          position: oQ.position,
          question: oQ.question,
          _type: 'orderedQuestion',
        })
        return acc
      },[]),
      _type: 'quizTake',
    }
    axiosAddEntity(quizTakeData, 'quizTake')
      .then(response => {
        const iri = getIRIFromAddResponse(response)
        const quizTakeId = iri.substring(
          iri.lastIndexOf('/')+1
        )
        history.push({
          pathname: `/courses/${match.params.courseId}/quiz/quizTake/${quizTakeId}`,
          state: {
            endDate: endDate,
            timeLimit: timeLimit,
            showResult: showResult,
            showQuestionResult: showQuestionResult,
          }
        })
      })
      .catch(error => console.log(error))
  }

  const startQuiz = async () => {
    await generateQuizTake()
  }

  const continueQuiz = () => {
    history.push({
      pathname: `/courses/${match.params.courseId}/quiz/quizTake/${getShortID(quizTakenData.id)}`,
      state: {
        endDate: endDate,
        timeLimit: timeLimit,
        showResult: showResult,
        showQuestionResult: showQuestionResult,
      }
    })
  }

  function footer () {
    const now = new Date().getTime()
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()

    if (quizTakenData.started && !quizTakenData.submitted && end > now ) {
      return (
        <Button
          color='primary'
          variant='contained'
          style={{fontSize: 18, padding: 15}}
          onClick={e => continueQuiz()}
        >
          Continue
        </Button>
      )
    }
    if (quizTakenData.submitted) {
      return (
        <Alert severity='success'>
          <AlertTitle>Quiz submitted</AlertTitle>
          <Typography style={{fontSize: 17}}>{formatDateTime(quizTakenData.submitted)}</Typography>
        </Alert>
      )
    }
    if (start > now) {
      return (
        <Typography variant='h6' style={{fontSize: 19}}>Quiz will be available from {formatDateTime(startDate)}</Typography>
      )
    }
    if (end < now) {
      return (
        <Typography variant='h6' style={{fontSize: 19}}>Quiz is no longer available</Typography>
      )
    }
    return (
      <Button
        color='primary'
        variant='contained'
        style={{fontSize: 18, padding: 15}}
        onClick={e => startQuiz()}
      >
        Take quiz
      </Button>
    )
  }

  return (
    <ThemeProvider theme={customTheme}>
      <div>
        {loading ?
          <div style={{marginTop: 20}}>
            <Alert severity='success' icon={false}>
              Loading...
            </Alert>
          </div> :
          <div>
            <Box border={`1px solid ${customTheme.palette.primary.light}`} padding={5}>
              <Grid container direction='column' spacing={3}>
                <Grid item>
                  <h3>{title}</h3>
                </Grid>
                {/* desc */}
                {description.length > 0 && <Grid item container direction='column'>
                  <Grid item>
                    <h5>Description</h5>
                  </Grid>
                  <Grid item>
                    <Typography variant='subtitle1'
                                style={{ maxWidth: '100%' }}>{description}</Typography>
                  </Grid>
                </Grid>}
                <Grid item container direction='column' spacing={2}>
                  <Grid item container>
                    <Box display='flex' alignItems='flex-end'>
                      <Typography variant='h6' style={{fontSize: 19}}>Number of questions: </Typography>
                      <Typography
                        style={{fontSize: 18, marginLeft: 10}}
                      >{numberOfQuestions} {numberOfQuestions === 1 ? "question" : "questions"}</Typography>
                    </Box>
                  </Grid>
                  <Grid item container>
                    <Box display='flex' alignItems='flex-end'>
                      <Typography variant='h6' style={{fontSize: 19}}>Points for quiz: </Typography>
                      <Typography style={{fontSize: 18, marginLeft: 10}}>
                        {pointsForQuiz} {pointsForQuiz === 1 ? "point" : "points"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item container>
                    <Box display='flex' alignItems='flex-end'>
                      <Typography variant='h6' style={{fontSize: 19}}>Quiz open until: </Typography>
                      <Typography style={{fontSize: 18, marginLeft: 10}}>{formatDateTime(endDate)}</Typography>
                    </Box>
                  </Grid>
                  <Grid item container>
                    <Box display='flex' alignItems='flex-end'>
                      <Typography variant='h6' style={{fontSize: 19}}>Time limit: </Typography>
                      <Typography style={{fontSize: 19, marginLeft: 10}}>{timeLimit === -1 ? "No time" +
                        " limit" : `${timeLimit} minutes`}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Box className={style.centeredSection}  marginTop={5}>
                {footer()}
              </Box>
            </Box>
          </div>
        }
      </div>
    </ThemeProvider>
  )
}

export default QuizTakeIntro

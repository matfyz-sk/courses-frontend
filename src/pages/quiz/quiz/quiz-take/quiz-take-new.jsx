import React, { useEffect, useState } from 'react'
import {
  createExportDataUserAnswer,
  setAnswers,
  setExistingUserAnswers,
  setUserAnswers,
} from '../../common/functions/answers-functions'
import { ThemeProvider } from '@material-ui/styles'
import { customTheme, useStyles } from '../../common/style/styles'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from '@material-ui/core'
import QuizTakeQuiz from './quiz-take-quiz'
import QuizTakeResult from './quiz-take-result'
import { Alert } from '@material-ui/lab'
import { useLocation } from 'react-router'
import { axiosGetEntities, axiosUpdateEntity, getResponseBody } from '../../../../helperFunctions'
import { evaluate } from '../../common/functions/fetch-data-functions'


function QuizTakeNew({
                       courseInstanceId,
                       userId,
                       isTeacher,
                       token,
                       match,
                       history,
                     }) {

  const style = useStyles()

  const [ quizQuestions, setQuizQuestions ] = useState([])
  const [ startTime, setStartTime ] = useState(null);

  const [ activeStep, setActiveStep ] = useState(0);
  const [ loading, setLoading ] = useState(true)
  const [ openConfirmation, setOpenConfirmation ] = useState(false)

  const [ updatedQuestion, setUpdatedQuestion ] = useState("")

  const location = useLocation()

  useEffect(() => {
    const getTakeQuestions = async() => {
      return await getQuizTake(match.params.quizTakeId)
        .then(async(response) => {
          return await getQuizQuestions(response).then(response => response)
        })
    }
    getTakeQuestions().then(result => {
      setQuizQuestions(result)
    })
  }, [])

  useEffect(() => {
    const roll = async() => {
      await rollingSubmit()
    }
    roll()
  }, [ updatedQuestion ])

  async function getQuizTake(quizTakeId) {
    let questionsRaw
    await axiosGetEntities(`quizTake/${ quizTakeId }?_join=orderedQuestion`)
      .then(response => {
        const dataQuizTake = getResponseBody(response)[0]
        setStartTime(dataQuizTake.createdAt)
        questionsRaw = dataQuizTake.orderedQuestion
      })
      .catch(error => console.log(error))
    return questionsRaw
  }

  async function getQuizQuestions(questionsRaw) {
    const questions = await questionsRaw.reduce(async(acc, question) => {
      const currentAcc = await acc
      const orderedQuestionId = question['@id'].substring(question['@id'].lastIndexOf('/') + 1)
      const questionFullId = question.question
      const questionId = questionFullId.substr(
        questionFullId.lastIndexOf('/') + 1
      )
      const questionType = questionFullId.substring(
        questionFullId.lastIndexOf('/', questionFullId.lastIndexOf('/') - 1) + 1,
        questionFullId.lastIndexOf('/')
      )
      const alreadyTaken = question.userAnswer
      const questionData = await getQuestion(questionId, questionType).then(response => response)
      const questionBase = {
        question: questionData,
        points: question.points ? question.points : '1',
        position: question.position,
        userAnswer: question.userAnswer,
        orderedQuestionId: orderedQuestionId,
        setUserAnswer: userAnswer => setUserAnswer(orderedQuestionId, questionFullId, userAnswer),
      }
      currentAcc.push(!!alreadyTaken ?
        await setExistingUserAnswers(questionBase) :
        setUserAnswers(questionBase)
      )
      return currentAcc
    }, [])

    setLoading(false)
    return questions
  }

  async function getQuestion(questionId, questionType) {
    let questionComplete
    await axiosGetEntities(`${ questionType }/${ questionId }?_join=hasAnswer`)
      .then(response => {
        const questionData = getResponseBody(response)[0]
        const question = {
          id: questionData['@id'],
          questionType: questionData['@type'],
          title: questionData.name,
          questionText: questionData.text,
        }
        questionComplete = setAnswers(question, questionData, true)
      })
      .catch(error => console.log(error))
    return questionComplete
  }

  const setUserAnswer = async(orderedQuestionId, questionId, userAnswer) => {
    setQuizQuestions(prevState => prevState.map(q => {
      return q.question.id === questionId ?
        {...q, userAnswer: userAnswer} : q
    }))
    setUpdatedQuestion(orderedQuestionId)
  }

  const updateQuizStartedDate = async(startTimeData) => {
    setStartTime(startTimeData)
    const qTData = {startedDate: startTimeData.toISOString()}
    axiosUpdateEntity(qTData, `quizTake/${ match.params.quizTakeId }`)
      .then(response => {
        console.log(response)
      })
      .catch(error => console.log(error))
  }

  const rollingSubmit = async() => {
    if(updatedQuestion === "") return
    const updatedId = updatedQuestion
    const question = quizQuestions.find(q => q.orderedQuestionId === updatedId)
    const ordQData = {
      userAnswer: await createExportDataUserAnswer(question),
    }
    axiosUpdateEntity(ordQData, `orderedQuestion/${ updatedId }`)
      .then(response => {
        console.log(response)
      })
      .catch(error => console.log(error))
    setUpdatedQuestion("")
  }

  const quizTakeSubmit = async() => {
    await quizQuestions.map(async(question) => {
      const ordQData = {
        userAnswer: await createExportDataUserAnswer(question),
        score: evaluate(question),
      }
      const orderedQuestionId = question.orderedQuestionId
      axiosUpdateEntity(ordQData, `orderedQuestion/${ orderedQuestionId }`)
        .then(response => {
          console.log(response)
        })
        .catch(error => console.log(error))
    })
    const qTData = {submittedDate: new Date()}
    axiosUpdateEntity(qTData, `quizTake/${ match.params.quizTakeId }`)
      .then(response => {
        console.log(response)
      })
      .catch(error => console.log(error))
  }

  const handleOpen = () => {
    setOpenConfirmation(true);
  };

  const handleClose = () => {
    setOpenConfirmation(false);
  };


  const endQuiz = () => {
    quizTakeSubmit()
    window.scrollTo({top: 0})
    setActiveStep(prevState => prevState + 1)
  }

  const getContent = (stepIndex) => {
    switch(stepIndex) {
      case 0:
        return (
          <div>
            <QuizTakeQuiz
              quizQuestions={ quizQuestions }
              setQuizQuestions={ setQuizQuestions }
              timeLimit={ location.state.timeLimit }
              // FIXME dummy test
              // startTime={new Date()}
              startTime={ startTime }
              endDate={ location.state.endDate }
              endQuiz={ endQuiz }
            />
            <Dialog
              open={ openConfirmation }
              onClose={ handleClose }
            >
              <DialogTitle>{ "Submit quiz?" }</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Once you submit, you will no longer be able to change your answers
                </DialogContentText>
              </DialogContent>
              <DialogActions className={ style.centeredSection }>
                <Button onClick={ handleClose } color="primary" variant='outlined'>
                  Cancel
                </Button>
                <Button onClick={ endQuiz } color="primary" variant='contained' autoFocus>
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <Box className={ style.centeredSection } marginBottom={ 5 } marginTop={ 5 }>
              <Button
                color='primary'
                variant='contained'
                style={ {fontSize: 18, padding: 15} }
                onClick={ e => handleOpen() }
              >
                Submit quiz
              </Button>
            </Box>
          </div>
        )
      case 1:
        return (
          <QuizTakeResult
            history={ history }
            match={ match }
            quizQuestions={ quizQuestions }
            showResult={ location.state.showResult }
            showQuestionResult={ location.state.showQuestionResult }
          />
        )
    }
  }

  return (
    <ThemeProvider theme={ customTheme }>
      <div>
        { loading ?
          <div style={ {marginTop: 20} }>
            <Alert severity='success' icon={ false }>
              Loading...
            </Alert>
          </div> :
          getContent(activeStep)
        }
      </div>
    </ThemeProvider>
  )
}

export default QuizTakeNew

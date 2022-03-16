import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { customTheme } from '../../common/style/styles'
import { ThemeProvider } from '@material-ui/styles'
import { Box, Grid, Paper } from '@material-ui/core'
import QuizTakesOverview from './quiz-takes-overview'
import { getQuizAssignmentInfo } from '../../common/functions/fetch-data-functions'
import { axiosGetEntities, getResponseBody, getShortID } from '../../../../helperFunctions'
import { green } from '@material-ui/core/colors'
import { setAnswers, setExistingUserAnswers } from '../../common/functions/answers-functions'
import { Alert } from '@material-ui/lab'
import { QuestionTypesEnums } from '../../common/functions/type-enums'

function QuizTakesOverviewData({courseInstanceId,
                                 userId,
                                 isTeacher,
                                 token,
                                 match,
                                 history,
                               }) {

  const location = useLocation()
  const quizAssignmentId = match.params.quizAssignmentId
  const quizAssignmentType = location.state.quizAssignmentType
  const quizAssignmentFullId = location.state.quizAssignmentFullId
  const [loading, setLoading] = useState(true)

  const [quizTakesData, setQuizTakesData] = useState([])
  const [quizAssignmentData, setQuizAssignmentData] = useState({})

  useEffect(() => {

    const getData = async () => {
      return await getQuizAssignmentInfo(quizAssignmentType, quizAssignmentId)
    }


    if (location.state.quizTakesData === undefined) {
      getData().then(r => setQuizAssignmentData(r))
      getQuizTakes().then(result => {
        setQuizTakesData(result)
        setLoading(false)
      })
    } else {
      setQuizAssignmentData(location.state.quizAssignmentData)
      setQuizTakesData(location.state.quizTakesData)
      setLoading(false)
    }

  },[location])


  async function getQuizTakes() {
    return await axiosGetEntities(`quizTake/?_join=orderedQuestion,createdBy`)
      .then( async (response) => {
        const data = getResponseBody(response)
        const quizTakes = data
          .filter(qT => qT.quizAssignment.length > 0 &&
            qT.quizAssignment[0]['@id'] === quizAssignmentFullId &&
            qT.submittedDate
          )
        if (quizTakes.length > 0) return await quizTakes.reduce(async (acc, quizTake) => {
          const currentAcc = await acc
          const quizTakeCompleteQuestions = await getQuizQuestions(quizTake.orderedQuestion)
          currentAcc.push({
            ...quizTake,
            orderedQuestion: quizTakeCompleteQuestions,
          })
          return currentAcc
        }, [])
        else return []
      })
      .catch(error => console.log(error))
  }

  async function getQuizQuestions(questionsRaw) {
    return await questionsRaw.reduce(async (acc, orderedQuestion) => {
      const currentAcc = await acc
      await axiosGetEntities(`question/${getShortID(orderedQuestion.question)}?_join=hasAnswer`)
        .then(async (response) => {
          const questionData = getResponseBody(response)[0]
          const question = {
            id: questionData['@id'],
            questionType: questionData['@type'],
            title: questionData.name,
            questionText: questionData.text,
          }
          const questionBase = {
            ...orderedQuestion,
            question: setAnswers(question, questionData),
            ogScore: orderedQuestion.score,
            ogComment: orderedQuestion.comment ? orderedQuestion.comment : "",
            comment: orderedQuestion.comment ? orderedQuestion.comment : "",
            focusComment: false,
          }
          currentAcc.push(await setExistingUserAnswers(questionBase))
        }).catch(error => console.log(error))
      return currentAcc
    }, [])
  }

  const handleOpenQuizTake = (quizTake) => {
    const quizTakeId = getShortID(quizTake['@id'])
    history.push({
      pathname: `/courses/${match.params.courseId}/quiz/quizTakeReview/${quizTakeId}`,
      state: {
        quizTakesData: quizTakesData,
        quizTake: quizTake,
        quizAssignmentData: quizAssignmentData,
        quizAssignmentType: location.state.quizAssignmentType,
        quizAssignmentFullId: location.state.quizAssignmentFullId,
      }
    })
  }


  return (
    <ThemeProvider theme={customTheme}>
      <Box>
        {loading ?
          <div style={{ marginTop: 20 }}>
            <Alert severity='success' icon={false}>
              Loading...
            </Alert>
          </div>
          :
          quizTakesData && <Paper variant='outlined' style={{ border: `0px solid ${green[100]}`}}>
            <Grid container direction='column' spacing={1}>
              <Grid item>
                <h3 style={{ fontSize: 25 }}>Quiz assignment: </h3>
              </Grid>
              <Grid item>
                <h3 style={{ fontWeight: 'normal', fontSize: 25 }}>{quizAssignmentData.title}</h3>
              </Grid>
            </Grid>
            <QuizTakesOverview
              quizTakes={quizTakesData}
              handleOpenQuizTake={handleOpenQuizTake}
              containsEssay={quizTakesData.find(quizTake => !!quizTake.reviewedDate && quizTake.orderedQuestion
                .some(ordQuestion => ordQuestion.question.questionType === QuestionTypesEnums.essay.id))}
            />
          </Paper>}
      </Box>
    </ThemeProvider>
  )
}

export default QuizTakesOverviewData

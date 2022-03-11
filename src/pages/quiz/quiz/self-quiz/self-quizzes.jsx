import React, { useEffect, useState } from 'react'
import { Box, Button, ThemeProvider, Typography } from '@material-ui/core'
import { customTheme, useStyles } from '../../common/style/styles'
import SelfQuizNew from './self-quiz-new'
import { axiosGetEntities, getResponseBody, getShortID } from '../../../../helperFunctions'
import SelfQuizzesStudent from './self-quizzes-student'
import SelfQuizzesTeacher from './self-quizzes-teacher'
import { Alert } from '@material-ui/lab'
import SelfQuizResult from './self-quiz-result'
import { getQuizQuestions } from '../../common/functions/fetch-data-functions'

function SelfQuizzes({
                       courseInstanceId,
                       userId,
                       isTeacher,
                       token,
                       match,
                       history,
                     }) {

  const style = useStyles()

  const [ openedTab, setOpenedTab ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const [ quizQuestions, setQuizQuestions ] = useState([])
  const [ topics, setTopics ] = useState([])

  useEffect(() => {
    if(isTeacher !== null && isTeacher) setOpenedTab('teacher')
    else if((isTeacher !== null && !isTeacher)) setOpenedTab('studentOverview')
  }, [ isTeacher, userId ])

  const handleOpenQuiz = async(selfQuiz) => {
    setOpenedTab(selfQuiz['@id'])
    setLoading(true)
    await getQuizQuestions(selfQuiz.orderedQuestion).then(async(response) => {
      setQuizQuestions(response)
      let topicsIds = [ ...new Set(response.map(question => question.question.ofTopic['@id'])) ]
      const topicsData = await topicsIds.reduce(async(acc, topic) => {
        const currentAcc = await acc
        currentAcc.push(
          await axiosGetEntities(`topic/${ getShortID(topic) }`)
            .then(response => {
              return getResponseBody(response)[0]
            })
            .catch(error => console.log(error)))
        return currentAcc
      }, [])
      setTopics(topicsData)
    }).then(resp => setLoading(false))
  }

  const handleExit = () => {
    history.push({
      pathname: `/courses/${ match.params.courseId }/quiz/quizAssignmentsOverview`,
    })
  }

  const getContent = () => {
    switch(openedTab) {
      case 'studentOverview':
        return (
          <Box>
            <Box className={ style.centeredSection } marginBottom={ 3 }>
              <h2>Self quizzes</h2>
            </Box>
            <Box className={ style.centeredSection }>
              <Button
                color='primary'
                variant='contained'
                size='large'
                style={ {fontSize: 18} }
                onClick={ e => setOpenedTab('studentNewQuiz') }
              >
                New self quiz
              </Button>
            </Box>
            <SelfQuizzesStudent
              userId={ userId }
              courseInstance={ courseInstanceId }
              handleOpenQuiz={ handleOpenQuiz }
            />
            <Box className={ style.centeredSection }>
              <Button
                variant='outlined'
                color='primary'
                onClick={ e => handleExit() }
              >
                <Typography variant='button' style={ {fontSize: 18} }>
                  Close
                </Typography>
              </Button>
            </Box>
          </Box>
        )
      case 'studentNewQuiz':
        return (
          <Box>
            <SelfQuizNew
              courseInstanceId={ courseInstanceId }
              match={ match }
              history={ history }
            />
          </Box>
        )
      case 'teacher':
        return (
          <Box>
            <Box className={ style.centeredSection } marginBottom={ 2 }>
              <h2>Self quizzes</h2>
            </Box>
            <SelfQuizzesTeacher
              courseInstance={ courseInstanceId }
              handleOpenQuiz={ handleOpenQuiz }
            />
            <Box className={ style.centeredSection }>
              <Button
                variant='outlined'
                color='primary'
                onClick={ e => handleExit() }
              >
                <Typography variant='button' style={ {fontSize: 18} }>
                  Close
                </Typography>
              </Button>
            </Box>
          </Box>
        )
      case '':
        return (
          <Alert severity='success' icon={ false }>Loading...</Alert>
        )
      default:
        return (
          loading ?
            <Alert severity='success' icon={ false }>Loading...</Alert>
            :
            <Box
              paddingTop={ 5 }
              paddingBottom={ 5 }
              marginBottom={ 5 }
            >
              <SelfQuizResult
                questions={ quizQuestions }
                topics={ topics }
                showCorrect={ !isTeacher }
              />
              <Box className={ style.centeredSection }>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={ e => setOpenedTab(isTeacher ? 'teacher' : 'studentOverview') }
                >
                  <Typography variant='button' style={ {fontSize: 18} }>
                    Close
                  </Typography>
                </Button>
              </Box>
            </Box>
        )
    }
  }

  return (
    <ThemeProvider theme={ customTheme }>
      <Box className={ style.root }>
        { getContent() }
      </Box>
    </ThemeProvider>
  )

}

export default SelfQuizzes

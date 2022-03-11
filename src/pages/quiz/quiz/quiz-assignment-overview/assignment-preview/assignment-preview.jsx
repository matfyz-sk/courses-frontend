import React from 'react'

import QuizTakeTable from './quiz-take-table/quiz-take-table'
import { Box, Button, Divider, Grid } from '@material-ui/core'
import { customTheme } from '../../../common/style/styles'
import { formatDateTime } from '../../../common/functions/common-functions'

function AssignmentPreview({
                             quizAssignment,
                             isTeacher,
                             history,
                             match,
                             token,
                             userId,
                           }) {

  const generateQuizTake = quizAssignmentId => {
    const quizAssignmentIdParts = quizAssignmentId.split('/')
    const quizAssignmentType = quizAssignmentIdParts[quizAssignmentIdParts.length - 2]
    const quizAssignmentShortId = quizAssignmentIdParts[quizAssignmentIdParts.length - 1]

    history.push({
      pathname: `/courses/${ match.params.courseId }/quiz/quizTakeIntro/${ quizAssignmentShortId }`,
      state: {quizAssignmentType: quizAssignmentType, quizAssignmentFullId: quizAssignmentId}
    })
  }

  const goToQuizTakeOverview = quizAssignmentFullId => {
    const quizAssignmentType = quizAssignmentFullId.substring(
      quizAssignmentFullId.lastIndexOf('/', quizAssignmentFullId.lastIndexOf('/') - 1
      ) + 1, quizAssignmentFullId.lastIndexOf('/')
    )
    const quizAssignmentId = quizAssignmentFullId.substring(quizAssignmentFullId.lastIndexOf('/') + 1)
    history.push({
      pathname: `/courses/${ match.params.courseId }/quiz/quizTakesOverview/${ quizAssignmentId }`,
      state: {quizAssignmentType: quizAssignmentType, quizAssignmentFullId: quizAssignmentFullId}
    })
  }

  const goToEditQuiz = (quizAssignmentFullId) => {
    const quizAssignmentType = quizAssignmentFullId.substring(
      quizAssignmentFullId.lastIndexOf('/', quizAssignmentFullId.lastIndexOf('/') - 1
      ) + 1, quizAssignmentFullId.lastIndexOf('/')
    )
    const quizAssignmentId = quizAssignmentFullId.substring(quizAssignmentFullId.lastIndexOf('/') + 1)
    history.push({
      pathname: `/courses/${ match.params.courseId }/quiz/quizAssignmentEdit/${ quizAssignmentType }/${ quizAssignmentId }`,
    })
  }

  const getFooterContent = () => {
    const now = new Date().getTime()
    const start = new Date(quizAssignment.startDate).getTime()
    const end = new Date(quizAssignment.endDate).getTime()
    if(isTeacher) return (
      <Box width='100%' display='flex' alignItems='center'>
        <Box display='flex' width='50%'>
          <Button
            color='primary'
            variant='contained'
            style={ {marginRight: 16} }
            size='large'
            onClick={ e => goToEditQuiz(quizAssignment.id) }
          >
            Edit Assignment
          </Button>
          <Button
            color='primary'
            variant='contained'
            size='large'
            onClick={ e => goToQuizTakeOverview(quizAssignment.id) }
          >
            Quiz takes review
          </Button>
        </Box>
        { !(start <= now && end >= now) &&
          <Box display='flex' width='50%' justifyContent='flex-end'>
            <Button
              style={ {
                color: customTheme.palette.error.main,
                borderColor: customTheme.palette.error.main,
              } }
              variant='outlined'
              size='large'
              // onClick={e => goToQuizTakeOverview(quizAssignment.id)}
            >
              Delete assignment
            </Button>
          </Box> }
      </Box>
    )
    if(quizAssignment.quizTake) return (
      <QuizTakeTable
        match={ match }
        history={ history }
        userId={ userId }
        quizAssignment={ quizAssignment }
      />
    )
    if(start <= now && end >= now) return (
      <Button
        color='primary'
        variant='contained'
        size='large'
        onClick={ e => generateQuizTake(quizAssignment.id) }
      >
        Take quiz
      </Button>
    )

  }

  return (

    <>
      <Box padding={ 3 }>
        <Box marginBottom={ 2 }>
          <Grid container direction='column' spacing={ 3 }>
            <Grid item container direction='column' spacing={ 1 }>
              <Grid item container direction='row' spacing={ 1 }>
                <Grid item>
                  <b>Start date:</b>
                </Grid>
                <Grid item>
                  { formatDateTime(quizAssignment.startDate) }
                </Grid>
              </Grid>
              <Grid item container direction='row' spacing={ 1 }>
                <Grid item>
                  <b>End date:</b>
                </Grid>
                <Grid item>
                  { formatDateTime(quizAssignment.endDate) }
                </Grid>
              </Grid>
            </Grid>
            <Grid item container direction='column' spacing={ 1 }>
              <Grid item>
                <h4>Assignment</h4>
              </Grid>
              <Grid item>
                { quizAssignment.description ? quizAssignment.description : <em>No description</em> }
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Divider/>
        <Box display='flex' marginTop={ 2 }>
          { getFooterContent() }
        </Box>
      </Box>
    </>
  )
}

export default AssignmentPreview


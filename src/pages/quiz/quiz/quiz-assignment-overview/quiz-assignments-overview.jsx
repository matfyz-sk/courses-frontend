import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { axiosGetEntities, getResponseBody, getShortID } from '../../../../helperFunctions'
import {
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  List,
  ListItem,
  ThemeProvider,
  Typography,
} from '@material-ui/core'
import { customTheme, useStyles } from '../../common/style/styles'
import { Alert } from '@material-ui/lab'
import AssignmentPreview from './assignment-preview/assignment-preview'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { grey } from '@material-ui/core/colors'
import { FaAngleRight } from 'react-icons/all'

function QuizAssignmentsOverview ({
                                    courseInstanceId,
                                    userId,
                                    isTeacher,
                                    token,
                                    match,
                                    history,
                                  }) {

  const style = useStyles()

  const [quizAssignments, setQuizAssignments] = useState([])
  const [openAssignments, setOpenAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async() => {
      return await fetchQuizAssignments(courseInstanceId, userId)
    }
    if (isTeacher != null && (isTeacher || userId)) fetchData().then(response => {
      setQuizAssignments(response)
    })
  },[courseInstanceId, userId, isTeacher])

  const handleOpenAssignment = (assignmentId) => {
    const currentIndex = openAssignments.indexOf(assignmentId);
    const newOpen = [...openAssignments];
    if (currentIndex === -1) {
      newOpen.push(assignmentId);
    } else {
      newOpen.splice(currentIndex, 1);
    }
    setOpenAssignments(newOpen);
  }

  const goToSelfQuizzes = () => {
    history.push({
      pathname: `/courses/${match.params.courseId}/quiz/selfQuizzes`,
    })
  }

  const goToNewAssignment = () => {
    history.push({
      pathname: `/courses/${match.params.courseId}/quiz/quizAssignment`,
    })
  }

  const fetchQuizAssignments = async (courseInstanceId, userId) => {
    let quizAssignments = []
    await axiosGetEntities(`quizAssignment?courseInstance=${getShortID(courseInstanceId)}${isTeacher ? `` : `&assignedTo=${getShortID(userId)}`}`)
      .then( async (response) => {
        const quizAssignmentsData = getResponseBody(response).map(quizAssignment => {
          return { ...quizAssignment, id: quizAssignment['@id'] }
        }).filter(assignment => assignment['@id'].match('.*generatedQuizAssignment.*|.*manualQuizAssignment.*'))
        if (isTeacher) quizAssignments = quizAssignmentsData
        else {
          quizAssignments = await quizAssignmentsData.reduce( async (acc,quizAssignment) => {
            const currentAcc = await  acc
            await axiosGetEntities(`quizTake?createdBy=${getShortID(userId)}`)
              .then(response => {
                const quizTakesAll = getResponseBody(response)
                if (quizTakesAll.length > 0) {
                  const currentQuizTake = quizTakesAll.find(qA => qA.quizAssignment.length > 0 && qA.quizAssignment[0]['@id'] === quizAssignment.id)
                  if (currentQuizTake && currentQuizTake.submittedDate)
                    currentAcc.push({
                      ...quizAssignment,
                      quizTake: currentQuizTake,
                    })
                  else currentAcc.push(quizAssignment)
                }
                else currentAcc.push(quizAssignment)
              })
              .catch(error => console.log(error))
            return currentAcc
          }, [])
        }
      })
      .catch(error => console.log(error))
    setLoading(false)
    return quizAssignments.sort((qa1,qa2) => new Date(qa2.createdAt) - new Date(qa1.createdAt))
  }

  const assignmentItem = (quizAssignment) => {
    return (
      <Box key={quizAssignment.id} border={`1px solid ${grey[300]}`} marginBottom={2}>
        <ListItem button onClick={e => handleOpenAssignment(quizAssignment.id)}>
          <Box display='flex' padding={1} alignItems='center' width='100%'>
            <Box width='90%' display='flex'>
              {openAssignments.indexOf(quizAssignment.id) !== -1 ?
                <FaAngleUp color={customTheme.palette.primary.main} size={30}/>
                : <FaAngleDown color={customTheme.palette.primary.main} size={30}/>}
              <h5 style={{marginLeft: 16, marginBottom: 0, fontSize: 23}}>{quizAssignment.name}</h5>
            </Box>
            {!isTeacher && <Box width='10%' display='flex' justifyContent='flex-end' alignItems='center'>
              {quizAssignment.quizTake && quizAssignment.quizTake.submittedDate &&
              <Chip
                color={quizAssignment.quizTake.publishedReview ? "primary" : "default"}
                label={quizAssignment.quizTake.publishedReview ? "Graded" : "Submitted"}
              />}
            </Box>}
          </Box>
        </ListItem>
        <Collapse in={openAssignments.indexOf(quizAssignment.id) !== -1}>
          <AssignmentPreview
            quizAssignment={quizAssignment}
            isTeacher={isTeacher}
            history={history}
            match={match}
            token={token}
            userId={userId}
          />
        </Collapse>
      </Box>
    )
  }

  const now = new Date().getTime()
  const endedAssignments = quizAssignments
    .filter(quizAssignment => new Date(quizAssignment.endDate).getTime() < now)
  const upcomingAssignments = quizAssignments
    .filter(quizAssignment => new Date(quizAssignment.startDate).getTime() > now)
  const currentAssignments = quizAssignments
    .filter(quizAssignment => new Date(quizAssignment.startDate).getTime() <= now && new Date(quizAssignment.endDate).getTime() >= now)


  return (
    <ThemeProvider theme={customTheme}>
      <Box className={style.root}>
        <Box className={style.centeredSection} marginBottom={2}>
          <h2>Quizzes</h2>
        </Box>
        {loading ?
          <Alert severity='success' icon={false}>
            Loading...
          </Alert>
          :
          <List>
            <Box border={`1px solid ${grey[300]}`} marginBottom={3}>
              <ListItem button onClick={e => goToSelfQuizzes()}>
                <Box display='flex' padding={1} alignItems='center'>
                  <h5 style={{marginLeft: 16, fontSize: 23, marginBottom: 2}}>Self quizzes</h5>
                  <FaAngleRight color={customTheme.palette.primary.main} size={30}/>
                </Box>
              </ListItem>
            </Box>
            <Divider/>
            {isTeacher &&
            <Box className={style.centeredSection} marginBottom={3} marginTop={3}>
              <Button
                variant='contained'
                color='primary'
                style={{fontSize: 16}}
                onClick={e => goToNewAssignment()}
              >
                Create new quiz assignment
              </Button>
            </Box>}
            {currentAssignments.length > 0 &&
            <Box>
              <Box marginTop={3} padding={1}>
                <Typography style={{ fontSize: 25 }}>Assignments in progress</Typography>
              </Box>
              <Box marginTop={3} marginBottom={3}>
                {currentAssignments.map((quizAssignment, index) => {
                  return (assignmentItem(quizAssignment))
                })}
              </Box>
            </Box>
            }
            <Divider/>
            {upcomingAssignments.length > 0 &&
            <Box>
              <Box marginTop={3} padding={1}>
                <Typography style={{ fontSize: 25 }}>Upcoming assignments</Typography>
              </Box>
              <Box marginTop={3} marginBottom={3}>
                {upcomingAssignments.map((quizAssignment, index) => {
                  return (assignmentItem(quizAssignment))
                })}
              </Box>
            </Box>
            }
            <Divider/>
            {endedAssignments.length > 0 &&
            <Box>
              <Box marginTop={3} padding={1}>
                <Typography style={{ fontSize: 25 }}>Previous assignments</Typography>
              </Box>
              <Box marginTop={3} marginBottom={3}>
                {endedAssignments.map((quizAssignment, index) => {
                  return (assignmentItem(quizAssignment))
                })}
              </Box>
            </Box>
            }
          </List>
        }
      </Box>
    </ThemeProvider>
  )

}

const mapStateToProps = ({ userReducer }) => {
  const { isAdmin } = userReducer
  return {
    isAdmin,
  }
}

export default connect(mapStateToProps, {})(QuizAssignmentsOverview)

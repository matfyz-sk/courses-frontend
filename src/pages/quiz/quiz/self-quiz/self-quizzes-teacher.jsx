import React, { useEffect, useState } from 'react'
import { axiosGetEntities, getResponseBody, getShortID } from '../../../../helperFunctions'
import { Box, Button, TextField, Typography } from '@material-ui/core'
import { useStyles } from '../../common/style/styles'
import { grey } from '@material-ui/core/colors'
import { getAgentsData } from '../../common/functions/fetch-data-functions'
import { Alert, Autocomplete } from '@material-ui/lab'
import { formatDateTime } from '../../common/functions/common-functions'

function SelfQuizzesTeacher ({
                               courseInstance,
                               handleOpenQuiz,
                             }) {

  const style = useStyles()

  const [allSelfQuizzes, setAllSelfQuizzes] = useState([])
  const [selfQuizzes, setSelfQuizzes] = useState([])

  const [loading, setLoading] = useState(true)

  const [students, setStudents] = useState([])
  const [filteredStudent, setFilteredStudent] = useState(null)

  useEffect(() => {
    const getData = async () => {
      let data = {}
      data.selfQuizTakes = await getSelfQuizTakes()
      data.students = await getAgentsData(getShortID(courseInstance))
      setLoading(false)
      return data
    }
    getData().then(response => {
      setAllSelfQuizzes(response.selfQuizTakes)
      setSelfQuizzes(response.selfQuizTakes)
      setStudents(response.students.users)
    })

  }, [])

  useEffect(() => {
    if (!filteredStudent) setSelfQuizzes(allSelfQuizzes)
    else setSelfQuizzes(allSelfQuizzes.filter(selfQuiz => selfQuiz.createdBy['@id'] === filteredStudent.id))

  }, [filteredStudent])

  const getSelfQuizTakes = async () => {
    let selfQuizTakes = []
    await axiosGetEntities(`selfQuizTake?courseInstance=${getShortID(courseInstance)}&_join=createdBy`)
      .then(response => {
        selfQuizTakes = getResponseBody(response).filter(take => take['@id'].match('.*selfQuizTake.*'))
      })
      .catch(error => console.log(error))
    return selfQuizTakes.sort((qa1,qa2) => new Date(qa2.createdAt) - new Date(qa1.createdAt))

  }


  const getFilterRow = () => {
    return (
      <Box display='flex' width='100%' marginBottom={2} borderBottom={`1px solid ${grey[300]}`}
           alignItems='center' padding={1} paddingLeft={2}>
        <Typography>Filter by student: </Typography>
        <Autocomplete
          renderInput={
            (params) =>
              <TextField {...params} variant='outlined'/>
          }
          options={students}
          getOptionLabel={(option) => option.name}
          style={{ width: 400, border: 0, overflow: 'hidden'}}
          onChange={(e, newValue) => setFilteredStudent(newValue)}
        />
      </Box>
    )
  }

  return (
    <Box className={style.sectionRoot}>
      {loading ?
        <Alert severity='success' icon={false}>Loading...</Alert>
        :
        <Box>
          {students.length > 0 && getFilterRow()}
          <Box display='flex' width='100%'>
            <Box width='85%' display='flex' padding={1} minHeight='55px'>
              <Box display='flex' alignItems='center' width='45%' marginRight={2} marginLeft={1}>
                <Typography variant='h6'>Student</Typography>
              </Box>
              <Box display='flex' alignItems='center' width='25%' marginRight={2}>
                <Typography variant='h6'>Submitted</Typography>
              </Box>
              <Box display='flex' alignItems='center' width='25%' marginRight={2}>
                <Typography variant='h6'>Score</Typography>
              </Box>
            </Box>
            <Box display='flex' width='15%' padding={0} />
          </Box>
          {
            selfQuizzes.length > 0 ?
              selfQuizzes.map((selfQuiz, index) => {
                return (
                  <Box display='flex' width='100%' key={selfQuiz['@id']} marginBottom={2}>
                    <Box width='85%' display='flex' padding={1} border={`1px solid ${grey[300]}`}
                         minHeight='55px'>
                      <Box display='flex' alignItems='center' width='45%' marginRight={2}
                           marginLeft={1}>
                        <Typography>
                          {selfQuiz.createdBy.firstName} {selfQuiz.createdBy.lastName}
                        </Typography>
                      </Box>
                      <Box display='flex' alignItems='center' width='25%' marginRight={2}>
                        <Typography>
                          {formatDateTime(selfQuiz.createdAt)}
                        </Typography>
                      </Box>
                      <Box display='flex' alignItems='center' width='25%' marginRight={2}>
                        <Typography>{selfQuiz.score} %</Typography>
                      </Box>
                    </Box>
                    <Box display='flex' width='15%' padding={0}>
                      <Button
                        variant='outlined'
                        color='primary'
                        fullWidth
                        style={{ margin: 0, borderRadius: 0, boxShadow: 0, height: '100%' }}
                        onClick={e => handleOpenQuiz(selfQuiz)}
                      >
                        View Quiz
                      </Button>
                    </Box>
                  </Box>
                )
              })
              :
              <Box display='flex' width='100%' marginBottom={2} border={`1px solid ${grey[300]}`}
                   minHeight='55px' alignItems='center' padding={1} paddingLeft={2}>
                <em>No self quiz has been taken yet</em>
              </Box>
          }
        </Box>
      }
    </Box>
  )
}

export default SelfQuizzesTeacher

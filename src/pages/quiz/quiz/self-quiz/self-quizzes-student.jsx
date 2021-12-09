import React, { useEffect, useState } from 'react'
import { axiosGetEntities, getResponseBody, getShortID } from '../../../../helperFunctions'
import { Box, Button, Typography } from '@material-ui/core'
import { useStyles } from '../../common/style/styles'
import { grey } from '@material-ui/core/colors'
import { formatDateTime } from '../../common/functions/common-functions'

function SelfQuizzesStudent ({
                               userId,
                               courseInstance,
                               handleOpenQuiz,
                             }) {

  const style = useStyles()

  const [selfQuizzes, setSelfQuizzes] = useState([])

  useEffect(() => {
    const getData = async () => {
      return await getSelfQuizTakes()
    }

    if (userId) getData().then(response => setSelfQuizzes(response))

  }, [userId])

  const getSelfQuizTakes = async () => {
    let selfQuizTakes = []
    await axiosGetEntities(`selfQuizTake?courseInstance=${getShortID(courseInstance)}&createdBy=${getShortID(userId)}`)
      .then(response => {
        selfQuizTakes = getResponseBody(response)
      })
      .catch(error => console.log(error))
    return selfQuizTakes.sort((qa1,qa2) => new Date(qa2.createdAt) - new Date(qa1.createdAt))
  }

  return (
    <Box className={style.sectionRoot}>
      <Box display='flex' width='100%'>
        <Box width='85%' display='flex' padding={1} minHeight='55px' paddingLeft={2}>
          <Box display='flex' alignItems='center' width='50%' marginRight={2}>
            <Typography variant='h6'>Submitted</Typography>
          </Box>
          <Box display='flex' alignItems='center' width='50%' marginRight={2}>
            <Typography variant='h6'>Score</Typography>
          </Box>
        </Box>
        <Box display='flex' width='15%' padding={0} />
      </Box>
      {selfQuizzes.length > 0 ?
        selfQuizzes.map((selfQuiz, index) => {
          return (
            <Box display='flex' width='100%' key={selfQuiz['@id']} marginBottom={2}>
              <Box width='85%' display='flex' padding={1} border={`1px solid ${grey[300]}`}
                   minHeight='55px' paddingLeft={2}>
                <Box display='flex' alignItems='center' width='50%' marginRight={2}>
                  <Typography>{formatDateTime(selfQuiz.createdAt)}</Typography>
                </Box>
                <Box display='flex' alignItems='center' width='50%' marginRight={2}>
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
                  View quiz
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
  )
}

export default SelfQuizzesStudent

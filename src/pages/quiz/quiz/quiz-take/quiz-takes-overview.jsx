import React, { useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core'
import { customTheme, useStyles } from '../../common/style/styles'
import { grey } from '@material-ui/core/colors'
import { FaCheck } from 'react-icons/all'
import { axiosUpdateEntity, getShortID } from '../../../../helperFunctions'
import { formatDateTime } from '../../common/functions/common-functions'

function QuizTakesOverview({
                             quizTakes,
                             handleOpenQuizTake,
                             containsEssay,
                           }) {

  const style = useStyles()
  const [ allPublished, setAllPublished ] = useState(0)

  const [ openConfirmDialog, setOpenConfirmDialog ] = useState(false)

  const publishAllReviews = async(drafts_only) => {
    await quizTakes.map(async(quizTake) => {
      let qTData = {}
      if(!drafts_only && !quizTake.reviewedDate) {
        quizTake.reviewedDate = new Date()
        qTData.reviewedDate = quizTake.reviewedDate
      }
      if(quizTake.reviewedDate) {
        quizTake.publishedReview = true
        qTData.publishedReview = true
        await axiosUpdateEntity(qTData, `quizTake/${ getShortID(quizTake['@id']) }`)
          .then(response => console.log(response))
          .catch(error => console.log(error))
      }
    })
    setAllPublished(drafts_only ? 1 : 2)
  }

  function getScore(quizTake) {
    const maxScore = quizTake.orderedQuestion.reduce((acc, question) => acc + question.points, 0)
    const score = quizTake.orderedQuestion.reduce((acc, question) => acc + question.score, 0)
    const percentage = (score / maxScore) * 100
    return (
      <Box display='flex' width='100%'>
        <Box width='35%' display='flex' justifyContent='flex-start'>
          <Typography
            color={ quizTake.reviewedDate ? "textPrimary" : "textSecondary" }
            style={ {
              marginRight: 5,
            } }
          >
            { score }
          </Typography>
          <Typography>
            / { maxScore }
          </Typography>
        </Box>
        <Typography
          color={ quizTake.reviewedDate ? "textPrimary" : "textSecondary" }
          style={ {
            width: '65%',
            marginLeft: 5,
          } }
        >
          { percentage.toFixed(1) }%
        </Typography>
      </Box>
    )
  }

  function getQuizTakeRow(quizTake) {
    return (
      <Box display='flex' width='100%' key={ quizTake['@id'] } marginBottom={ 2 }>
        <Box width='92%' display='flex' padding={ 1 } border={ `1px solid ${ grey[300] }` }
             minHeight='55px'>
          <Box display='flex' alignItems='center' width='45%' marginRight={ 2 } marginLeft={ 1 }>
            <Typography>
              { quizTake.createdBy.firstName } { quizTake.createdBy.lastName }
            </Typography>
          </Box>
          <Box display='flex' alignItems='center' width='25%' marginRight={ 2 }>
            <Typography>
              { formatDateTime(quizTake.createdAt) }
            </Typography>
          </Box>
          <Box display='flex' alignItems='center' width='25%' marginRight={ 2 }>
            { getScore(quizTake) }
          </Box>
          <Box display='flex' alignItems='center' width='5%' marginRight={ 1 }
               justifyContent='flex-end'>
            { quizTake.reviewedDate &&
              <Chip
                color={ quizTake.publishedReview ? "primary" : "default" }
                label={ quizTake.publishedReview ? "Published" : "Draft" }
                size='small'
              /> }
          </Box>
        </Box>
        <Box display='flex' width='8%' padding={ 0 }>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            style={ {margin: 0, borderRadius: 0, boxShadow: 0, height: '100%'} }
            onClick={ e => handleOpenQuizTake(quizTake) }
          >
            Review
          </Button>
        </Box>
      </Box>)
  }

  const getConfirmDialogEssay = () => {
    return (
      <Dialog
        open={ openConfirmDialog }
        onClose={ e => setOpenConfirmDialog(false) }
      >
        <DialogTitle>{ "Publish all reviews?" }</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Some quiz takes contain essay questions that may not have been graded
          </DialogContentText>
        </DialogContent>
        <DialogActions className={ style.centeredSection }>
          <Button onClick={ e => setOpenConfirmDialog(false) } color="primary"
                  variant='outlined'>
            No
          </Button>
          <Button
            onClick={ e => {
              setOpenConfirmDialog(false)
              publishAllReviews(false)
            } }
            color="primary" variant='contained' autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Box className={ style.sectionRoot }>
      <Box marginBottom={ 2 }>
        <h3>Quiz takes</h3>
      </Box>
      { quizTakes.length > 0 ?
        <Box>
          <Box display='flex' width='100%'>
            <Box width='92%' display='flex' padding={ 1 } minHeight='55px'>
              <Box display='flex' alignItems='center' width='45%' marginRight={ 2 } marginLeft={ 1 }>
                <Typography variant='h6'>Student</Typography>
              </Box>
              <Box display='flex' alignItems='center' width='25%' marginRight={ 2 }>
                <Typography variant='h6'>Submitted</Typography>
              </Box>
              <Box display='flex' alignItems='center' width='25%' marginRight={ 2 }>
                <Typography variant='h6'>Score</Typography>
              </Box>
              <Box display='flex' alignItems='center' width='5%' marginRight={ 2 }
                   justifyContent='flex-end'/>
            </Box>
            <Box display='flex' width='8%' padding={ 0 }/>
          </Box>
          { quizTakes.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          ).map(quizTake => {
            return (
              getQuizTakeRow(quizTake)
            )
          }) }
          <Box className={ style.centeredSection } marginTop={ 5 }>
            <Button
              variant='outlined'
              color='primary'
              size='large'
              style={ {fontSize: 17, marginRight: 24} }
              onClick={ e => containsEssay ? setOpenConfirmDialog(true) : publishAllReviews(false) }
            >
              Publish all reviews
            </Button>
            <Button
              variant='contained'
              color='primary'
              size='large'
              style={ {fontSize: 17} }
              onClick={ e => publishAllReviews(true) }
            >
              Publish all drafts
            </Button>
          </Box>
          <Collapse in={ allPublished > 0 }>
            <Box className={ style.centeredSection } marginTop={ 2 }>
              <FaCheck color={ customTheme.palette.primary.main }/>
              <Typography style={ {fontSize: 17, marginLeft: 5} }>
                { allPublished === 1 ? 'All drafts were published' : 'All reviews were published' }
              </Typography>
            </Box>
          </Collapse>
          { getConfirmDialogEssay() }
        </Box>
        :
        <Box>
          <Typography><em>No quiz takes submitted</em></Typography>
        </Box>
      }
    </Box>
  )
}

export default QuizTakesOverview

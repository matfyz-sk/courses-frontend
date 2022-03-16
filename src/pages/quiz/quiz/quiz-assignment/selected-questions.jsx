import React, { useState } from 'react'
import { customTheme, useStyles } from '../../common/style/styles'
import {
  Box,
  Card,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core'
import { FaAngleDown, FaAngleUp, FaArrowDown, FaArrowUp, FaTrashAlt } from 'react-icons/fa'
import QuizQuestion from '../../common/quiz-question'

function SelectedQuestions({
                             selectedQuestions,
                             setSelectedQuestions,
                             pointsForAll,
                             pointsSameForAll,
                             setPointsSameForAll,
                             setPointsForAll,
                             shuffleQuizTake,
                             setShuffleQuizTake,
                             setMaxPositionSelected,
                           }) {

  const style = useStyles()

  const [openQuestions, setOpenQuestions] = useState([])

  const handlePointsModeChange = (event) => {
    setPointsSameForAll(event.target.checked)
    selectedQuestions.map(question => question.changePoints(pointsForAll))
  }

  const optimizeEmptyPointsForAll = (event) => {
    const newValue = event.target.value
    if (newValue === '') {
      selectedQuestions.map(question => question.changePoints(0))
      setPointsForAll(0)
    }
  }

  const optimizeEmptyPoints = (event, question) => {
    const newValue = event.target.value
    if (newValue === '') {
      question.changePoints(0)
    }
  }

  const handlePointsForAll = (event) => {
    const newValue = event.target.value.replace(/^0+(?=\d)/, '')
    if (newValue === '' || newValue.match(/^\d+$/)) {
      selectedQuestions.map(question => question.changePoints(newValue))
      setPointsForAll(newValue)
    }
  }

  const handlePointsForQuestion = (event, question) => {
    const newValue = event.target.value.replace(/^0+(?=\d)/, '')
    if (newValue === '' || newValue.match(/^\d+$/)) {
      question.changePoints(newValue)
    }
  }

  const handleOpenQuestion = (question) => {
    const currentIndex = openQuestions.indexOf(question)
    const newState = [...openQuestions]
    if (currentIndex === -1) {
      newState.push(question)
    } else {
      newState.splice(currentIndex, 1)
    }
    setOpenQuestions(newState)
  }

  const removeFromSelectedQuestions = (question) => {
    setSelectedQuestions(prevState => prevState.filter(
      (questionS) => questionS.question.id !== question.question.id
    ))
    setMaxPositionSelected(prevState => prevState - 1)
  }

  const handleMoveUp = (question) => {
    const index = selectedQuestions.indexOf(question)
    if (index > 0) {
      const neighbor = selectedQuestions[index - 1]
      let newSelectedQuestions = [...selectedQuestions]
      const selectedUpdated = newSelectedQuestions
        .map(qS => {
          if (qS.question.id === question.question.id) {
            return {...qS, position: neighbor.position}
          } else {
            return {...qS}
          }
        })
        .map(qS => {
          if (qS.question.id === neighbor.question.id) {
            return {...qS, position: question.position}
          } else {
            return {...qS}
          }
        })
      setSelectedQuestions(selectedUpdated.sort(
        (a, b) => {
          return a.position - b.position
        }
      ))
    }
  }

  const handleMoveDown = (question) => {
    const index = selectedQuestions.indexOf(question)
    if (index < selectedQuestions.length - 1) {
      const neighbor = selectedQuestions[index + 1]
      let newSelectedQuestions = [...selectedQuestions]
      const selectedUpdated = newSelectedQuestions
        .map(qS => {
          if (qS.question.id === question.question.id) {
            return {...qS, position: neighbor.position}
          } else {
            return {...qS}
          }
        })
        .map(qS => {
          if (qS.question.id === neighbor.question.id) {
            return {...qS, position: question.position}
          } else {
            return {...qS}
          }
        })
      setSelectedQuestions(selectedUpdated.sort(
        (a, b) => {
          return a.position - b.position
        }
      ))
    }
  }


  return (
    <div className={style.sectionRoot}>
      <Typography className={`${style.sectionHeader} ${style.startSection}`} variant='h6'>Selected questions</Typography>
      <Box
        className={style.sectionAppbar}
      >
        <Box className={style.SQ_toolbar} display='flex' justifyContent='flex-end' alignItems='center'>
          <Typography variant='button'>Points for all questions</Typography>
          <Switch
            checked={pointsSameForAll}
            onChange={handlePointsModeChange}
            color='primary'
          />
          <TextField
            size='small'
            variant='outlined'
            className={style.numberTextField}
            disabled={!pointsSameForAll}
            inputProps={{min: 0, maxLength: 3, style: {textAlign: 'center', padding: 8}}}
            value={pointsForAll}
            onChange={handlePointsForAll}
            onBlur={e => optimizeEmptyPointsForAll(e)}
          />
        </Box>
      </Box>

      <Card variant='outlined' className={style.MQA_questionList}>
        <List>
          {selectedQuestions.length === 0 ?
            <ListItem>
              <ListItemText
                secondary={`No questions selected`}
              />
            </ListItem>
            :
            selectedQuestions.map(question => {
              return (
                <div key={question.question.id} className={style.MQA_questionItem}
                >
                  <>
                    <ListItem
                      button
                      onClick={e => handleOpenQuestion(question)}
                    >
                      <ListItemIcon>
                        {openQuestions.indexOf(question) !== -1 ?
                          <FaAngleUp size={25}/> : <FaAngleDown size={25}/>}
                      </ListItemIcon>
                      <ListItemText
                        primary={question.question.title}
                      />
                      <Box
                        display='flex'
                        justifyContent='flex-end'
                        alignItems='center'
                      >
                        {!pointsSameForAll && <Typography variant='subtitle1'>points: </Typography>}
                        {!pointsSameForAll &&
                        <TextField
                          size='small'
                          variant='outlined'
                          className={style.numberTextField}
                          disabled={pointsSameForAll}
                          inputProps={{
                            min: 0,
                            maxLength: 3,
                            style: {textAlign: 'center', padding: 8}
                          }}
                          value={question.points}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handlePointsForQuestion(e, question)}
                          onBlur={e => optimizeEmptyPoints(e, question)}
                        />}
                        <IconButton
                          className={style.iconButton}
                          style={{color: customTheme.palette.error.main}}
                          onClick={e => {
                            e.stopPropagation();
                            removeFromSelectedQuestions(question)
                          }}
                        >
                          <FaTrashAlt/>
                        </IconButton>
                        {!shuffleQuizTake &&
                        <div>
                          <IconButton
                            className={style.iconButton}
                            color='primary'
                            onClick={e => {
                              e.stopPropagation();
                              handleMoveUp(question)
                            }}
                          >
                            <FaArrowUp/>
                          </IconButton>
                          <IconButton
                            className={style.iconButton}
                            color='primary'
                            onClick={e => {
                              e.stopPropagation();
                              handleMoveDown(question)
                            }}
                          >
                            <FaArrowDown/>
                          </IconButton>
                        </div>}
                      </Box>
                    </ListItem>
                  </>
                  <Collapse
                    in={openQuestions.indexOf(question) !== -1}
                  >
                    <ListItem component={"div"} style={{display: 'flex'}}>
                      <QuizQuestion
                        question={question}
                        variant='questionPreview'
                      />
                    </ListItem>
                  </Collapse>
                </div>
              )
            })}
        </List>
      </Card>
    </div>
  )

}

export default SelectedQuestions

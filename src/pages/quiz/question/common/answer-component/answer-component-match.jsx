import React, { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  ListGroupItem,
  Row,
  UncontrolledButtonDropdown,
} from 'reactstrap'
import { FaChevronDown, FaTrashAlt } from 'react-icons/fa'
import { FormControl, Grid, ListItem, ListItemText, MenuItem, Select } from '@material-ui/core'
import { customTheme, useStyles } from '../../../common/style/styles'

export function AnswerComponentMatch ({
                                        matchAnswers,
                                        pairs,
                                        addNewPair,
                                        userAnswer,
                                        setUserAnswer,
  finalAnswer,
                                      }) {

  const style = useStyles()
  const [showLabel, setShowLabel] = useState(new Array(pairs.length).fill(true))

  const changePairAnswerId = (event, answerId, pair) => {
    pairs.map(p => p.answerId === pair.answerId ? p.changePairAnswer(p.position) : null)
    matchAnswers.find(answer => answer.id === pair.position).changeMatchAnswerText('')
    pair.changePairAnswer(answerId)
  }

  const removeAnswer = (event, pair) => {
    pair.changePairAnswer(pair.position)
  }

  const deletePair = (event, pair) => {
    matchAnswers.find(answer => answer.id === pair.position).changeMatchAnswerText('')
    pairs.filter(p => p.answerId === pair.position).map(p => p.changePairAnswer(p.position))
    pair.deletePair()
  }

  function usedMatchAnswers () {
    return matchAnswers.filter(answer => answer.text !== '')
  }

  const handleUserAnswer = (e, index) => {
    let newUserAnswer = [...userAnswer]
    newUserAnswer[index] = {...userAnswer[index], userChoice: e.target.value}
    setUserAnswer(newUserAnswer)
  }

  function matchAnswerVariant (pair) {
    if (addNewPair) {
      const pairAnswer = matchAnswers.find(answer => answer.id === pair.answerId)
      return (
        <InputGroup key={pair.id}>
          <Input
            className='mr-2'
            type='text'
            value={pair.promptText}
            onChange={(e) => pair.changePromptText(e.target.value)}
          />
          <Input
            className='mr-2'
            type='text'
            value={pairAnswer.text}
            onChange={(e) => pairAnswer.changeMatchAnswerText(e.target.value)}
            disabled={pair.position !== pairAnswer.id}
          />
          <InputGroupAddon addonType={'append'}>
            <ButtonGroup>
              <UncontrolledButtonDropdown>
                <DropdownToggle color='success'>
                  <FaChevronDown />
                </DropdownToggle>
                <DropdownMenu right>
                  {pair.answerId !== pair.position &&
                  <div>
                    <DropdownItem
                      onClick={(e) => removeAnswer(e, pair)}
                    >
                      Remove answer
                    </DropdownItem>
                    <DropdownItem divider />
                  </div>}
                  <DropdownItem header> Available answers </DropdownItem>
                  {usedMatchAnswers().map(answer => {
                    return (
                      pair.answerId !== answer.id &&
                      <DropdownItem
                        className='word-wrapped-items'
                        key={answer.id}
                        style={{}}
                        onClick={(e) => changePairAnswerId(e, answer.id, pair)}
                      >
                        {answer.text}
                      </DropdownItem>
                    )
                  })
                  }
                </DropdownMenu>
              </UncontrolledButtonDropdown>
              <Button
                color='danger'
                onClick={(e) => deletePair(e, pair)}
              >
                <FaTrashAlt />
              </Button>
            </ButtonGroup>
          </InputGroupAddon>
        </InputGroup>
      )
    }
    if (setUserAnswer && !finalAnswer) {
      const pairIndex = userAnswer.map(ans => ans.matchPair).indexOf(pair.id)
      return (
        <Grid container direction='row' spacing={2} key={pair.id}>
          <Grid item container direction='column' xs={6}>
            <ListItem className={style.GS_topicItemCore}>
              <ListItemText
                primary={pair.prompt}
              />
            </ListItem>
          </Grid>
          <Grid item container direction='column' xs={6} >
            <FormControl variant="outlined" id="selectAnswer">
              <Select
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left"
                  },
                  getContentAnchorEl: null
                }}
                value={userAnswer[pairIndex].userChoice === '' ? 'none' : userAnswer[pairIndex].userChoice}
                onChange={(e) => handleUserAnswer(e, pairIndex)}
                onFocus={(e) => {
                  let newState = [...showLabel]
                  newState[pairIndex] = false
                  setShowLabel(newState)
                }}
                onClose={(e) => {
                  let newState = [...showLabel]
                  newState[pairIndex] = e.target.value === undefined
                  setShowLabel(newState)}}
                style={{color: `${userAnswer[pairIndex].userChoice === '' ? customTheme.palette.text.disabled : customTheme.palette.text.primary}`}}
              >
                <MenuItem value='none' key={-1} style={{display: `${showLabel[pairIndex] ? 'inline' : 'none'}`}}>
                  <em>Choose answer</em>
                </MenuItem>
                {matchAnswers.map(answer => {
                  return (
                    <MenuItem key={answer} value={answer}>{answer}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )
    }
    let answerText = finalAnswer ?
        userAnswer.find(uA => uA.matchPair === pair.id).userChoice
        :
        pair.answer
    return (
      <Container key = {pair.id} style={{ margin: '0px', padding: '0px' }}>
        <Row>
          <Col>
            <ListGroupItem>{pair.prompt}</ListGroupItem>
          </Col>
          {/*<Col style={{ maxWidth: 'fit-content', alignItems: 'center', display: 'flex' }}>*/}
          {/*  /!*<FaArrowsAltH color='green' size='2em' />*!/*/}
          {/*</Col>*/}
          <Col style={{ margin: '0px', padding: '0px' }}>
            {finalAnswer && answerText=== '' ?
              <ListGroupItem disabled>
                <em>Not answered</em>
              </ListGroupItem>
              :
              <ListGroupItem>
                {answerText}
              </ListGroupItem>
            }
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <div>
      {addNewPair && <legend>Pairs</legend>}
      {pairs.map(pair => {
        return (
          <div key = {pair.id} className = 'mb-2'>
            {matchAnswerVariant(pair)}
          </div>
        )
      })}
      {addNewPair &&
      <ButtonGroup className= 'mt-3'>
        <Button color="success" onClick={addNewPair}>
          Add pair
        </Button>
      </ButtonGroup>
      }
    </div>
  )
}

export default AnswerComponentMatch

import React from 'react'
import {
  Button,
  ButtonGroup,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  Container,
  Row,
  Col,
  ListGroupItem,
} from 'reactstrap'
import { FaTrashAlt, FaChevronDown, FaArrowsAltH } from 'react-icons/fa'

export function AnswerComponentMatch ({
 matchAnswers,
 pairs,
 addNewPair,
  quiz,
}) {
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

  const usedMatchAnswers = matchAnswers.filter(answer => answer.text !== '')

  return (
    <div>
      {!quiz && <legend>Pairs</legend>}
      {pairs.map(pair => {
        const pairAnswer = matchAnswers.find(answer => answer.id === pair.answerId)
        return (
          <div key={pair.position} className='mb-3'>
            {addNewPair ?
              //Creating question
              (<InputGroup key={pair.id}>
                <Input
                  className='mr-2'
                  type="text"
                  value={pair.promptText}
                  onChange={(e) => pair.changePromptText(e.target.value)}
                />
                <Input
                  className='mr-2'
                  type="text"
                  value={pairAnswer.text}
                  onChange={(e) => pairAnswer.changeMatchAnswerText(e.target.value)}
                  disabled={pair.position !== pairAnswer.id}
                />
                <InputGroupAddon addonType={'append'}>
                  <ButtonGroup>
                    <UncontrolledButtonDropdown>
                      <DropdownToggle color='success'>
                        <FaChevronDown/>
                      </DropdownToggle>
                      <DropdownMenu right>
                      {pair.answerId !== pair.position &&
                      <div>
                        <DropdownItem
                          onClick = {(e) => removeAnswer(e, pair)}
                        >
                          Remove answer
                        </DropdownItem>
                        <DropdownItem divider />
                      </div>}
                      <DropdownItem header> Available answers </DropdownItem>
                      {usedMatchAnswers.map(answer => {
                        return (
                          pair.answerId !== answer.id &&
                          <DropdownItem
                            className="word-wrapped-items"
                            key={answer.id}
                            style={{}}
                            onClick={(e) => changePairAnswerId(e, answer.id, pair)}
                          >
                            {answer.text}
                          </DropdownItem>
                        )})
                      }
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                    <Button
                      color="danger"
                      onClick={(e) => deletePair(e, pair)}
                    >
                      <FaTrashAlt/>
                    </Button>
                  </ButtonGroup>
                  </InputGroupAddon>
                </InputGroup>
              ) : (
                //Saved Question
                <Container style={{margin: "0px", padding: "0px"}}>
                  <Row>
                    <Col>
                      <ListGroupItem>{pair.promptText}</ListGroupItem>
                    </Col>
                    <Col style={{maxWidth: "fit-content", alignItems: "center", display: "flex"}}>
                      <FaArrowsAltH color= "green" size='2em'/>
                    </Col>
                    <Col style={{margin: "0px", padding: "0px"}}>
                      <ListGroupItem>{pairAnswer.text}</ListGroupItem>
                    </Col>
                  </Row>
                </Container>
              )}
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

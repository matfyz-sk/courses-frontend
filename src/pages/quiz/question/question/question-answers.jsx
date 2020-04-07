/* eslint-disable import/no-named-as-default */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'

import {
  Button,
  // Form,
  // Card,
  // CardBody,
  // Label,
  // FormGroup,
  // Input,
} from 'reactstrap'
// import validate from '../../validate'
// import api from '../../../../api'
import AnswerComponentNew from '../common/answer-component/answer-component-new'

const enText = {
  'answer-placeholder': 'Place text of your answer',
  'add-answer': 'Add new answer',
}

class QuestionAnswers extends Component {
  componentDidMount() {}

  changeInput = event => {
    const { name } = event.target
    const { value } = event.target
    this.setState({
      [name]: value,
    })
  }

  render() {
    const { answers, addNewAnswer } = this.props
    return (
      <>
        {answers.map(answer => {
          const {
            id,
            correct,
            text,
            changeAnswerText,
            changeAnswerChecked,
          } = answer
          return (
            <AnswerComponentNew
              key={id}
              placeholder={enText['answer-placeholder']}
              correct={correct}
              text={text}
              onChangeAnswerText={changeAnswerText}
              onChangeAnswerChecked={changeAnswerChecked}
            />
          )
        })}
        {addNewAnswer && (
          <Button color="success" onClick={addNewAnswer}>
            {enText['add-answer']}
          </Button>
        )}
      </>
    )
  }
}

export default QuestionAnswers

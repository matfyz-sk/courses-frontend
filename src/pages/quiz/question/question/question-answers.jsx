/* eslint-disable import/no-named-as-default */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'

import { Button } from 'reactstrap'

import AnswerComponentPredefined from '../common/answer-component/answer-component-predefined'

const enText = {
  'answer-placeholder': 'Place text of your answer',
  'add-answer': 'Add answer',
}

class QuestionAnswers extends Component {
  render() {
    const { answers, addNewAnswer } = this.props
    return (
      <>
        <fieldset className="mb-4">
          <legend>Answers</legend>
          {answers &&
            answers.map(answer => {
              const {
                id,
                correct,
                text,
                changeAnswerText,
                changeAnswerChecked,
                deleteAnswer,
              } = answer
              return (
                <AnswerComponentPredefined
                  key={id}
                  id={id}
                  placeholder={enText['answer-placeholder']}
                  correct={correct}
                  text={text}
                  onChangeAnswerText={changeAnswerText}
                  onChangeAnswerChecked={changeAnswerChecked}
                  deleteAnswer={deleteAnswer}
                  // color={id > -1 ? }
                />
              )
            })}
          {addNewAnswer && (
            <Button outline color="success" onClick={addNewAnswer}>
              {enText['add-answer']}
            </Button>
          )}
        </fieldset>
      </>
    )
  }
}

export default QuestionAnswers

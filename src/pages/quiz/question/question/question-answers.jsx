/* eslint-disable import/no-named-as-default */
/* eslint-disable react/prefer-stateless-function */
import React from 'react'

import { Button } from 'reactstrap'

import AnswerComponentPredefined from '../common/answer-component/answer-component-predefined'

const enText = {
  'answer-placeholder': 'Place text of your answer',
  'add-answer': 'Add answer',
}

function QuestionAnswers({
                           answers,
                           addNewAnswer,
                           userAnswer,
                           setUserAnswer,
                           finalAnswer,
                         }) {

  const handleUserAnswer = (id, answer) => {
    let newUserAnswer = [ ...userAnswer ]
    const index = userAnswer.map(ans => ans.predefinedAnswer).indexOf(id)
    newUserAnswer[index] = answer
    setUserAnswer(newUserAnswer)
  }

  return (
    <>
      <fieldset>
        { addNewAnswer && <legend>Answers</legend> }
        { answers &&
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
                key={ id }
                id={ id }
                placeholder={ enText['answer-placeholder'] }
                correct={ correct }
                text={ text }
                onChangeAnswerText={ changeAnswerText }
                onChangeAnswerChecked={ changeAnswerChecked }
                deleteAnswer={ deleteAnswer }
                userAnswer={ userAnswer && userAnswer.find(ans => ans.predefinedAnswer === id) }
                handleUserAnswer={ handleUserAnswer }
                finalAnswer={ finalAnswer }
                // color={id > -1 ? }
              />
            )
          }) }
        { addNewAnswer && (
          <Button color="success" className="mt-3" onClick={ addNewAnswer }>
            { enText['add-answer'] }
          </Button>
        ) }
      </fieldset>
    </>
  )
}

export default QuestionAnswers

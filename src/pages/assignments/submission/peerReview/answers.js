import React, { Component } from 'react'
import { Label, Table } from 'reactstrap'
import { Alert } from 'reactstrap'

export default class Answers extends Component {
  render() {
    if (this.props.questionsWithAnswers[0].answers.length === 0) {
      return <Alert color="danger">This submission was not reviewed.</Alert>
    }
    return (
      <>
        {console.log('QMs', this.props)}
        {this.props.questionsWithAnswers.map((question, index) => (
          <div key={question['@id']} style={{ marginTop: '30px' }}>
            <h6 style={{ fontWeight: 'bold' }}>{question.question}</h6>
            {question.answers.map((answerObject, index) => (
              <p key={index} style={{ marginBottom: '10px' }}>
                <strong>
                  {console.log('AWA', answerObject.review.createdBy)}
                  {this.props.nameVisible &&
                    `${answerObject.review.createdBy.firstName} ${answerObject.review.createdBy.lastName}`}
                </strong>
                <br />
                {answerObject.answer}
                <br />
                <em>{question.rated ? `${answerObject.score}/5` : ''}</em>
              </p>
            ))}
          </div>
        ))}
      </>
    )
  }
}

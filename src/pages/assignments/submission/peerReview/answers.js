import React, { Component } from 'react'
import { Label, Table } from 'reactstrap'
export default class Answers extends Component {
  render() {
    return (
      <>
        {this.props.questionsWithAnswers.map((question, index) => (
          <div key={question['@id']} style={{ marginTop: '30px' }}>
            <h6 style={{ fontWeight: 'bold' }}>{question.question}</h6>
            {question.answers.map((answerObject, index) => (
              <p key={index}>{`Review ${index + 1}: ${
                answerObject.answer
              }, score ${question.rated && answerObject.score}`}</p>
            ))}
          </div>
        ))}
      </>
    )
  }
}

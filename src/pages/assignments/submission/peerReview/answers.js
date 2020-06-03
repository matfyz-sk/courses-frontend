import React, { Component } from 'react';
import { Label, Table } from 'reactstrap';
export default class Answers extends Component {


  render(){
    return(
      <>
      {this.props.questionsWithAnswers.map((question, index) =>
        <div key={question['@id']}>
        <Label for="rating">Question:</Label>{' '+question.question}
          <Table borderless>
            <tbody>
              { question.answers.map((answer) =>
                <tr key={answer['@id']}>
                  <td
                    style={{
                        whiteSpace: 'nowrap',
                        width: '1%'
                    }}>
                    <Label className="no-m-p" for="rating">{ answer.review.team.name }</Label>
                    <br/>
                    <Label className="no-m-p" for="rating">Score:</Label> { answer.score }
                  </td>
                  <td>{ answer.answer }</td>
                </tr>
              )}
            </tbody>
          </Table>

      </div>
      )}
      </>
    )
  }
}

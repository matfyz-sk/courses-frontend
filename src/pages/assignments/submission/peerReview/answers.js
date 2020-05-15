import React, { Component } from 'react';
import { FormGroup, Label, Input, Button, Table } from 'reactstrap';
export default class Answers extends Component {


  render(){

    let answers = [
      {
        '@id': 444,
        answer: 'Answer my answer is no \n Aaaskljasdklasklsakasldsad klsadkjsadk sadlk sdakjaskl sajd klsan sklnskdl  klsnlska nsaklsanks nsa dlkdklnlsak nsalkndlkd nsad lsanls nsalk \n naslksandldkl',
        score: 4,
        review: {
          student: {
            firstName: 'Aka',
            lastName: 'fuka',
          },
          team: {
            name: 'Team Aka fuka'
          }
        },
      },
      {
        '@id': 446,
        answer: 'Answer my answer is no',
        score: 5,
        review: {
          student: {
            firstName: 'Aka',
            lastName: 'fuka',
          },
          team: {
            name: 'Team Aka fuka'
          }
        },
      },
      {
        '@id': 448,
        answer: 'Answer my answer is no',
        score: 6,
        review: {
          student: {
            firstName: 'Aka',
            lastName: 'fuka',
          },
          team: {
            name: 'Team Aka fuka'
          }
        },
      },
      {
        '@id': 449,
        answer: 'Answer my answer is no',
        score: 7,
        review: {
          student: {
            firstName: 'Aka',
            lastName: 'fuka',
          },
          team: {
            name: 'Team Aka fuka'
          }
        },
      },
  ]

    return(
      <>
      {this.props.questionsWithAnswers.map((question, index) =>
        <div key={question['@id']}>
        <Label for="rating">Question:</Label>{' '+question.question}
          <Table borderless>
            <tbody>
              { answers.map((answer) =>
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

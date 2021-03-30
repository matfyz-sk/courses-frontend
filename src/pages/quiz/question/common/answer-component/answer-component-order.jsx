import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { DragDropContext } from 'react-beautiful-dnd'
import AnswerOrderColumn from './answer-order-components/answer-order-column'


export class AnswerComponentOrder extends Component{

render() {
    const {
      orderAnswers,
      orderAnswersColumn,
      addNewOrderAnswer,
      onDragEnd,
      quiz,
    } = this.props
    const answersMapped = orderAnswersColumn.answersPositions.map(answerPos => orderAnswers.find(ans => ans.position === answerPos))
    return (
      <div>
        {!quiz && <legend>{orderAnswersColumn.title}</legend>}
        <DragDropContext onDragEnd={onDragEnd}>
          <AnswerOrderColumn
            key={orderAnswersColumn.id}
            orderAnswerColumn={orderAnswersColumn}
            answersMapped={answersMapped}
          />
          {addNewOrderAnswer &&
          (<Button className="mt-3" color="success" onClick={addNewOrderAnswer}>
            Add answer
          </Button>)}
        </DragDropContext>
      </div>
    )
  }
}

export default AnswerComponentOrder

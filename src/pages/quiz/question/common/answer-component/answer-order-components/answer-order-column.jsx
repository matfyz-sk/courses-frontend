import React, { Component } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import AnswerOrderRow from './answer-order-row'

export class AnswerOrderColumn extends Component {
  render() {
    const { orderAnswerColumn, answersMapped } = this.props
    return (
        <Droppable droppableId={orderAnswerColumn.id}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {answersMapped.map((orderAnswer,index) => {
                const {
                  position,
                  text,
                  changeOrderAnswerText,
                  deleteOrderAnswer,
                } = orderAnswer
                return (
                  <AnswerOrderRow
                    key = {position}
                    index={index}
                    position = {position}
                    text = {text}
                    changeOrderAnswerText={changeOrderAnswerText}
                    deleteOrderAnswer={deleteOrderAnswer}
                  />
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
    )
  }
}
export default AnswerOrderColumn;

import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import AnswerOrderRow from './answer-order-row'

export function AnswerOrderColumn ({
                                     orderAnswerColumn,
                                     orderAnswers,
                                     userAnswer,
                                   }) {

  function orderColumnVariant() {
    if(userAnswer) {
      return (
        <Droppable droppableId = {orderAnswerColumn.id}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {orderAnswers.map((answer, index) => {
                return (
                  <div key={index}>
                    <AnswerOrderRow
                      key={answer.id}
                      index={index}
                      position={answer.userChoice}
                      text={answer.text}
                    />
                  </div>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )
    }
    if (orderAnswers) {
      return (
        <Droppable droppableId={orderAnswerColumn.id}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {
                orderAnswers.map((orderAnswer, index) => {
                  const {
                    position,
                    text,
                    changeOrderAnswerText,
                    deleteOrderAnswer,
                  } = orderAnswer
                  return (
                    <AnswerOrderRow
                      key={position}
                      index={index}
                      position={position}
                      text={text}
                      changeOrderAnswerText={changeOrderAnswerText}
                      deleteOrderAnswer={deleteOrderAnswer}
                    />
                  )
                })
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )
    }
  }

  return (
    <div>
      {orderColumnVariant()}
    </div>
  )
}

export default AnswerOrderColumn;

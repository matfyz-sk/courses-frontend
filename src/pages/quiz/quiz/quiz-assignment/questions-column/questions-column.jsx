import React from 'react'
import { ListGroup } from 'reactstrap'
import { Droppable } from 'react-beautiful-dnd'
import QuestionRow from './question-row/question-row'

const style = {
  minHeight: '100px',
}
export default class QuestionsColumn extends React.Component {
  render() {
    const { column, questions } = this.props
    return (
      <>
        <h3>{column.title}</h3>
        <Droppable droppableId={column.id}>
          {provided => (
            <div
              style={style}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <ListGroup>
                {questions.map((question, index) => {
                  return (
                    <QuestionRow
                      question={question}
                      index={index}
                      key={index}
                    />
                  )
                })}
                {provided.placeholder}
              </ListGroup>
            </div>
          )}
        </Droppable>
      </>
    )
  }
}

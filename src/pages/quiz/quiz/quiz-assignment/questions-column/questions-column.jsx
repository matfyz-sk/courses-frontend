import React from 'react'

import { ListGroup, Label, Input, FormGroup } from 'reactstrap'
import { Droppable } from 'react-beautiful-dnd'
import QuestionRow from './question-row/question-row'

const style = {
  minHeight: '100px',
}
export default class QuestionsColumn extends React.Component {
  state={
    topic: "-1",
  }

  handleChange = e => {
    const { value } = e.target
    this.setState({
      topic: value,
    })
  }

  render() {
    const { column, questions, topics } = this.props
    const { topic } = this.state
  

    return (
      <>
        <h4>{column.title}</h4>
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

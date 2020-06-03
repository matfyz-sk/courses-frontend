import React from 'react'
import { ListGroupItem } from 'reactstrap'
import { Draggable } from 'react-beautiful-dnd'

export default class QuestionRow extends React.Component {
  render() {
    const { question, index } = this.props
    return (
      <Draggable draggableId={question.id} index={index} key={question.id}>
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <ListGroupItem key={question.id}>{question.name}</ListGroupItem>
          </div>
        )}
      </Draggable>
    )
  }
}

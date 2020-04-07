import React from "react";
import { ListGroupItem } from "reactstrap";
import { Draggable } from "react-beautiful-dnd";

export default class QuestionRow extends React.Component {
  render() {
    return (
      <Draggable
        draggableId={this.props.question.id}
        index={this.props.index}
        key={this.props.question.id}
      >
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <ListGroupItem key={this.props.question.id}>
              {this.props.question.title}
            </ListGroupItem>
          </div>
        )}
      </Draggable>
    );
  }
}

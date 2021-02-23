import React, { Component } from 'react'
import { Button, Input, InputGroup, InputGroupAddon, InputGroupText, ListGroupItem } from 'reactstrap'
import { Draggable } from 'react-beautiful-dnd'
import { GrDrag } from 'react-icons//gr'
import { FaTrashAlt } from 'react-icons/fa'
import { IconContext } from 'react-icons'

export class AnswerOrderRow extends Component {

  changeOrderAnswerText = event => {
    const { changeOrderAnswerText } = this.props
    changeOrderAnswerText(event.target.value)
  }

  render() {
    const {
      index,
      position,
      text,
      changeOrderAnswerText,
      deleteOrderAnswer,
    } = this.props
    return (
      <Draggable draggableId={position.toString()} index={index}>
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className = 'mb-2'
          >
            {changeOrderAnswerText ? (
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText {...provided.dragHandleProps} className="bg-success">
                    <GrDrag />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Write answer"
                  type="text"
                  value={text}
                  onChange={changeOrderAnswerText && this.changeOrderAnswerText}
                />
                <InputGroupAddon addonType="append">
                  <Button color="danger" onClick={deleteOrderAnswer}>
                    <FaTrashAlt/>
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            ) : (
              <ListGroupItem key={position}>{text}</ListGroupItem>
            )}
          </div>
        )}
      </Draggable>
    )
  }
}

export default AnswerOrderRow;

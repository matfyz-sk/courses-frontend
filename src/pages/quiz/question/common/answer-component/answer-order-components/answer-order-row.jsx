import React from 'react'
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ListGroupItem,
} from 'reactstrap'
import { Draggable } from 'react-beautiful-dnd'
import { GrDrag } from 'react-icons//gr'
import { FaTrashAlt } from 'react-icons/fa'

function AnswerOrderRow ({
                           index,
                           position,
                           text,
                           changeOrderAnswerText,
                           deleteOrderAnswer,
                         }) {

  const handleChangeOrderAnswerText = event => {
    changeOrderAnswerText(event.target.value)
  }

  function orderRowVariant(provided) {
    if (changeOrderAnswerText) {
      return (
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
            onChange={changeOrderAnswerText && handleChangeOrderAnswerText}
          />
          <InputGroupAddon addonType="append">
            <Button color="danger" onClick={deleteOrderAnswer}>
              <FaTrashAlt/>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      )
    } else {
      return (
        <ListGroupItem key={position}>{text}</ListGroupItem>
      )
    }
  }

  return (
    <Draggable draggableId={position.toString()} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className = 'mb-2'
        >
          {orderRowVariant(provided)}
        </div>
      )}
    </Draggable>
  )
}


export default AnswerOrderRow;

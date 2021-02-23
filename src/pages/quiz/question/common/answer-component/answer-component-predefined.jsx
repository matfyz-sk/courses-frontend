import React, { Component } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  CustomInput,
  Button,
} from 'reactstrap'
import { FaTrashAlt } from 'react-icons/fa'

const enText = {
  'is-correct': 'Is correct',
  delete: 'Delete',
}

export class AnswerComponentPredefined extends Component {
  onChangeAnswerText = event => {
    const { onChangeAnswerText } = this.props
    onChangeAnswerText(event.target.value)
  }

  onChangeAnswerChecked = event => {
    const { onChangeAnswerChecked } = this.props
    onChangeAnswerChecked(event.target.checked)
  }

  render() {
    const {
      id,
      text,
      correct,
      onChangeAnswerChecked,
      placeholder,
      onChangeAnswerText,
      deleteAnswer,
    } = this.props
    return (
      <InputGroup className="mb-2">
        {onChangeAnswerText ? (
          <>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <CustomInput
                  type="checkbox"
                  id={id}
                  label={enText['is-correct']}
                  checked={correct}
                  // TODO add color #1e7e34
                  onChange={onChangeAnswerChecked && this.onChangeAnswerChecked}
                />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              type="text"
              placeholder={placeholder}
              value={text}
              onChange={onChangeAnswerText && this.onChangeAnswerText}
              // disabled={!this.props.isTextEnabled}
            />
            <InputGroupAddon addonType="append">
              <Button color="danger" onClick={deleteAnswer}>
                <FaTrashAlt/>
              </Button>
            </InputGroupAddon>
          </>
        ) : (
          <>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <CustomInput
                  type="checkbox"
                  id={id}
                  label={enText['is-correct']}
                  checked={correct}
                  readOnly
                />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              type="text"
              placeholder={placeholder}
              value={text}
              readOnly
              // disabled={!this.props.isTextEnabled}
            />
          </>
        )}
      </InputGroup>
    )
  }
}

export default AnswerComponentPredefined

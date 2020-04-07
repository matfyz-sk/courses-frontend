/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Badge,
} from 'reactstrap'

export class AnswerComponentNew extends Component {
  onChangeAnswerText = event => {
    const { onChangeAnswerText } = this.props
    onChangeAnswerText(event.target.value)
  }

  render() {
    const {
      text,
      correct,
      onChangeAnswerChecked,
      placeholder,
      color,
      onChangeAnswerText,
    } = this.props
    return (
      <div className="inline">
        <Badge color={color}>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <Input
                  addon
                  type="checkbox"
                  checked={correct}
                  onChange={onChangeAnswerChecked}
                  // readOnly={!this.props.isCheckboxEnabled}
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
          </InputGroup>
        </Badge>
      </div>
    )
  }
}

export default AnswerComponentNew

import React, { Component } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Badge,
  Label,
} from 'reactstrap'

export class AnswerComponentNew extends Component {
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
            {onChangeAnswerText ? (
              <>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <Input
                      addon
                      type="checkbox"
                      checked={correct}
                      onChange={
                        onChangeAnswerChecked && this.onChangeAnswerChecked
                      }
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
              </>
            ) : (
              <Label check>
                <Input addon type="checkbox" checked={correct} readOnly />
                {text}
              </Label>
            )}
          </InputGroup>
        </Badge>
      </div>
    )
  }
}

export default AnswerComponentNew

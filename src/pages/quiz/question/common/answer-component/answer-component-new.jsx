import React, { Component } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Badge,
  Label,
  CustomInput,
  Button,
} from 'reactstrap'

const enText = {
  'is-correct': 'Is correct',
  delete: 'Delete',
}

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
      id,
      text,
      correct,
      onChangeAnswerChecked,
      placeholder,
      // color,
      onChangeAnswerText,
      deleteAnswer,
    } = this.props
    return (
      <InputGroup className="mb-3">
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
                {enText.delete}
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
                />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              type="text"
              placeholder={placeholder}
              value={text}
              // disabled={!this.props.isTextEnabled}
            />
          </>
        )}
      </InputGroup>
    )
  }
}

export default AnswerComponentNew

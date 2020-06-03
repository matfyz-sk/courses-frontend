import React, { Component } from 'react'
import { Input, Label } from 'reactstrap'

const enText = {
  regexpLabel: 'Regular expression',
}

export class AnswerComponentOpen extends Component {
  setRegexp = event => {
    const { setRegexp } = this.props
    setRegexp(event.target.value)
  }

  setRegexpUserAnswer = event => {
    const { setRegexpUserAnswer } = this.props
    setRegexpUserAnswer(event.target.value)
  }

  setUserAnswer = event => {
    const { setUserAnswer } = this.props
    setUserAnswer(event.target.value)
  }

  render() {
    const {
      setRegexp,
      regexp,
      setRegexpUserAnswer,
      regexpUserAnswer,
      setUserAnswer,
      userAnswer,
      placeholder,
      // color,
    } = this.props
    const regex = RegExp(regexp)
    return (
      <fieldset className="mb-4">
        <legend>Answer</legend>
        {setRegexp && (
          <div className="mb-3">
            <Label for="title">{enText.regexpLabel}</Label>
            <Input
              type="text"
              placeholder={placeholder}
              value={regexp}
              onChange={setRegexp && this.setRegexp}
            />
          </div>
        )}
        {!setRegexp && <div style={{ whiteSpace: 'pre-line' }}>{regexp}</div>}
        {setRegexpUserAnswer && (
          <div className="mb-3">
            <Input
              type="text"
              placeholder={placeholder}
              value={regexpUserAnswer}
              onChange={setRegexpUserAnswer && this.setRegexpUserAnswer}
              valid={regexpUserAnswer !== '' && regex.test(regexpUserAnswer)}
              invalid={regexpUserAnswer !== '' && !regex.test(regexpUserAnswer)}
            />
          </div>
        )}
        {userAnswer && (
          <Input
            type="text"
            placeholder={placeholder}
            value={userAnswer}
            onChange={setUserAnswer && this.setUserAnswer}
          />
        )}
      </fieldset>
    )
  }
}

export default AnswerComponentOpen

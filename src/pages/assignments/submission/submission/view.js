import React, { Component } from 'react'
import { Alert, Label } from 'reactstrap'

import { unixToString } from 'helperFunctions'
import { GenerateView } from './generateSubmission'

export default class SubmissionView extends Component {
  render() {
    const { assignment, improvedSubmission, initialSubmission, fields } =
      this.props
    console.log('assi:', assignment)
    console.log('ini:', initialSubmission.submittedField[0].value)
    console.log('fiel:', fields)
    return (
      <div>
        <Label className="mb-0">
          {this.props.isInitial ? 'Initial submission' : 'Improved submission'}
        </Label>
        <br />
        <Label className="mb-0">
          Deadline:{' '}
          {unixToString(
            this.props.isInitial
              ? assignment.initialSubmissionPeriod.deadline
              : assignment.improvedSubmissionPeriod.deadline
          )}
        </Label>
        {fields.map(field => (
          <GenerateView
            field={field}
            // value={initialSubmission.submittedField[0].value}
          />
        ))}
        <Alert
          color="warning"
          className="small-alert"
          isOpen={
            (this.props.isInitial && initialSubmission === null) ||
            (!this.props.isInitial && improvedSubmission === null)
          }
        >
          {`There was no ${
            this.props.isInitial ? 'initial' : 'improved'
          } submission.`}
        </Alert>
      </div>
    )
  }
}

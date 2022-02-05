import React, { Component } from 'react'
import { Alert, Button, Label } from 'reactstrap'

import { periodHappening, unixToString } from 'helperFunctions'
import { generateField } from './generateSubmission'

export default class SubmissionForm extends Component {
  render() {
    const {
      assignment,
      settings,
      improvedSubmission,
      initialSubmission,
      fields,
      onChange,
      saving,
      onSubmit,
    } = this.props
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
        {fields.map(field => generateField(field, onChange))}
        <Alert
          color="warning"
          isOpen={
            assignment.submissionImprovedSubmission &&
            periodHappening(assignment.improvedSubmissionPeriod) &&
            settings.myAssignment &&
            improvedSubmission === null &&
            initialSubmission !== null
          }
          className="mt-3 small-alert"
        >
          Form was loaded from initial submission as there is no submitted
          improved submission.
        </Alert>
        <Button color="primary" disabled={saving} onClick={onSubmit}>
          {saving ? 'Saving submission' : 'Save submission'}
        </Button>
      </div>
    )
  }
}

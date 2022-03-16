import React, { Component } from 'react';
import { Alert, Label } from 'reactstrap';

import { unixToString } from 'helperFunctions';
import { generateView } from './generateSubmission';

export default class SubmissionView extends Component {

  render(){
    const { assignment, improvedSubmission, initialSubmission, fields } = this.props;
    return(
      <div>
        <Label className="mb-0">{this.props.isInitial ? 'Initial submission' : 'Improved submission' }</Label>
        <br/>
        <Label className="mb-0">Deadline: { unixToString( (this.props.isInitial ? assignment.initialSubmissionPeriod.deadline : assignment.improvedSubmissionPeriod.deadline) ) }</Label>
        { fields.map((field) => generateView(field) )}
        <Alert
          color="warning"
          className="small-alert"
          isOpen={ ( this.props.isInitial && initialSubmission === null ) || ( !this.props.isInitial && improvedSubmission === null ) }
          >
          {`There was no ${this.props.isInitial ? 'initial' : 'improved' } submission.`}
        </Alert>
      </div>
    )
  }
}

import React, { Component } from 'react'
import { Table, Button, Label } from 'reactstrap';
import { getShortID, periodHappening } from '../../../helperFunctions';

export default class StudentTeamSubmissionsView extends Component {

  render() {
    const assignment = this.props.assignment;
    let initialSubmission = this.props.initialSubmissions.length === 0 ? null : this.props.initialSubmissions[0];
    let improvedSubmission = this.props.improvedSubmissions.length === 0 ? null : this.props.improvedSubmissions[0];
    let isOpened = (periodHappening(assignment.initialSubmissionPeriod) || (assignment.submissionImprovedSubmission && periodHappening(assignment.improvedSubmissionPeriod)));
    let canUpdate = ( initialSubmission !== null || improvedSubmission !== null ) && isOpened;

    return (
      <Table>
        <thead>
          <tr>
            <th className="center-cell">Initial</th>
            <th className="center-cell">Improved</th>
            <th width="80"></th>
          </tr>
        </thead>
      <tbody>
        <tr>
        <td className="center-cell">
        { initialSubmission ? <i className="fa fa-check green-color" /> : <i className="fa fa-times red-color" /> }
        </td>
        {
          <td className="center-cell">
          { improvedSubmission ? <i className="fa fa-check green-color" /> : <i className="fa fa-times red-color" /> }
          </td>
        }
        <td>
        <Button color={ !canUpdate && isOpened ? "success" : "primary"} onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(this.props.assignment['@id'])}/submission/0`)}>{canUpdate ? 'Update' : (isOpened? 'Submit' : 'View') }</Button>
      </td>
        </tr>
      </tbody>
    </Table>
    )
  }
}

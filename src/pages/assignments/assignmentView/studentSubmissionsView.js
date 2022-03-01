import React, { Component } from 'react'
import { Table, Button } from 'reactstrap'
import {
  getShortID,
  periodHappening,
  periodStarted,
  periodHasEnded,
} from '../../../helperFunctions'

export default class StudentTeamSubmissionsView extends Component {
  getButtonText(settings) {
    if (settings.canUpdate) return 'Update'
    if (settings.noInitialSubmission) return 'Submit'
    if (settings.noImprovedSubmission) return 'Submit improved'
    return 'View'
  }

  getButtonColor(settings) {
    if (settings.canUpdate) return 'primary'
    if (settings.noInitialSubmission || settings.noImprovedSubmission)
      return 'success'
    return 'primary'
  }

  render() {
    const assignment = this.props.assignment
    let initialSubmission =
      this.props.initialSubmissions.length === 0
        ? null
        : this.props.initialSubmissions[0]
    let improvedSubmission =
      this.props.improvedSubmissions.length === 0
        ? null
        : this.props.improvedSubmissions[0]
    const settings = {
      canUpdate:
        (periodHappening(assignment.initialSubmissionPeriod) &&
          initialSubmission !== null) ||
        (assignment.submissionImprovedSubmission &&
          periodHappening(assignment.improvedSubmissionPeriod) &&
          improvedSubmission !== null),
      noInitialSubmission:
        periodHappening(assignment.initialSubmissionPeriod) &&
        initialSubmission === null,
      noImprovedSubmission:
        assignment.submissionImprovedSubmission &&
        periodHappening(assignment.improvedSubmissionPeriod) &&
        improvedSubmission === null,
      peerReviewPeriod: periodHappening(this.props.assignment.peerReviewPeriod),
    }

    const canBeRated =
      (!assignment.submissionImprovedSubmission &&
        periodHasEnded(assignment.initialSubmissionPeriod)) ||
      (assignment.submissionImprovedSubmission &&
        periodHasEnded(assignment.improvedSubmissionPeriod))

    const scoredSubmission = [initialSubmission, improvedSubmission].find(
      submission =>
        submission !== null && submission.teacherRating !== undefined
    )
    const score =
      scoredSubmission !== undefined
        ? `${scoredSubmission.teacherRating} points`
        : `Not rated yet`

    return (
      <Table>
        <thead>
          <tr>
            <th className="center-cell">Initial</th>
            {periodHappening(assignment.improvedSubmissionPeriod) && (
              <th className="center-cell">Was Reviewed</th>
            )}
            {assignment.submissionImprovedSubmission &&
              periodStarted(assignment.improvedSubmissionPeriod) && (
                <th className="center-cell">Improved</th>
              )}
            {canBeRated && <th className="center-cell">Score</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="center-cell">
              {initialSubmission ? (
                <i className="fa fa-check green-color" />
              ) : (
                <i className="fa fa-times red-color" />
              )}
            </td>
            {periodHappening(assignment.improvedSubmissionPeriod) && (
              <td className="center-cell">
                {this.props.wasReviewed ? (
                  <i className="fa fa-check green-color" />
                ) : (
                  <i className="fa fa-times red-color" />
                )}
              </td>
            )}
            {assignment.submissionImprovedSubmission &&
              periodStarted(assignment.improvedSubmissionPeriod) && (
                <td className="center-cell">
                  {improvedSubmission ? (
                    <i className="fa fa-check green-color" />
                  ) : (
                    <i className="fa fa-times red-color" />
                  )}
                </td>
              )}
            {canBeRated && <td className="center-cell">{score}</td>}
            <td>
              {periodHappening(assignment.improvedSubmissionPeriod) &&
                this.props.wasReviewed && (
                  <Button
                    outline
                    color="primary"
                    onClick={() =>
                      this.props.history.push(
                        `./assignments/assignment/${getShortID(
                          this.props.assignment['@id']
                        )}/submission/reviews`
                      )
                    }
                    style={{ marginRight: '30px' }}
                  >
                    See Reviews
                  </Button>
                )}
              <Button
                color={this.getButtonColor(settings)}
                onClick={() =>
                  this.props.history.push(
                    `./assignments/assignment/${getShortID(
                      this.props.assignment['@id']
                    )}/submission/submission`
                  )
                }
              >
                {this.getButtonText(settings)}
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    )
  }
}

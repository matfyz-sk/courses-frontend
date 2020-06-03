import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import { getShortID, periodHappening, periodHasEnded, periodStarted } from '../../../helperFunctions';

export default class StudentTeamSubmissionsView extends Component {

  groupByTeam(initial, improved){
    let teams = [];
    initial.forEach((submission)=>{
      teams.push({...this.props.teams.find((team) => team['@id'] === submission.submittedByTeam[0]['@id'] ),initialSubmission: submission })
    })
    improved.forEach((submission)=>{
      let teamIndex = teams.findIndex((team)=> team['@id'] === submission.submittedByTeam[0]['@id'])
      if(teamIndex === -1){
        teams.push({...this.props.teams.find((team) => team['@id'] === submission.submittedByTeam[0]['@id'] ),improvedSubmission: submission })
      } else{
        teams[teamIndex] = { ...teams[teamIndex], improvedSubmission: submission }
      }
    })
    teams = teams.map( (team) => ({...team, settings: this.getTeamSettings( team, this.props.assignment ) }) )
    return teams;
  }

  getButtonText( teamSettings ){
    if(teamSettings.canUpdate) return 'Update';
    if(teamSettings.noInitialSubmission) return 'Submit';
    if(teamSettings.noImprovedSubmission) return 'Submit improved';
    return 'View';
  }

  getButtonColor( teamSettings ){
    if(teamSettings.canUpdate) return 'primary';
    if(teamSettings.noInitialSubmission || teamSettings.noImprovedSubmission) return 'success';
    return 'primary';
  }

  getTeamSettings( team, assignment ){
    const canUpdate = (periodHappening(assignment.initialSubmissionPeriod) && team.initialSubmission)||(assignment.submissionImprovedSubmission && periodHappening(assignment.improvedSubmissionPeriod) && team.improvedSubmission)
    const noInitialSubmission = periodHappening(assignment.initialSubmissionPeriod) && !team.initialSubmission
    const noImprovedSubmission = assignment.submissionImprovedSubmission && periodHappening(assignment.improvedSubmissionPeriod) && !team.improvedSubmission;
    return {
      canUpdate,
      noInitialSubmission,
      noImprovedSubmission,
    }
  }

  getScore(team){
    const scoredSubmission = [team.initialSubmission, team.improvedSubmission].find((submission) => submission !== undefined  && submission.teacherRating !== undefined );
    return scoredSubmission !== undefined ? `${scoredSubmission.teacherRating} points` : `Not rated yet`
  }

  render() {
    const assignment = this.props.assignment;
    const groupedSubmissions = this.groupByTeam(this.props.initialSubmissions, this.props.improvedSubmissions);
    const canBeRated = (
      (!assignment.submissionImprovedSubmission && periodHasEnded( assignment.initialSubmissionPeriod )) ||
      (assignment.submissionImprovedSubmission && periodHasEnded( assignment.improvedSubmissionPeriod ))
  );
    return (
      <Table>
        <thead>
          <tr>
            <th>Team</th>
            <th className="center-cell">Initial</th>
            { assignment.submissionImprovedSubmission && periodStarted( assignment.improvedSubmissionPeriod ) && <th className="center-cell">Improved</th>}
            { canBeRated && <th className="center-cell">Score</th>}
            { ( periodHappening(this.props.assignment.teamReviewPeriod) || periodHasEnded(this.props.assignment.teamReviewPeriod) ) && <th></th>}
            <th width="80"></th>
          </tr>
        </thead>
      <tbody>
      { groupedSubmissions.map((team,index)=>
        <tr key={team['@id']}>
        <td style={{
            whiteSpace: 'nowrap',
            width: '1%'
        }}>
        { team.name }
        </td>
        <td className="center-cell">
        { team.initialSubmission ? <i className="fa fa-check green-color" /> : <i className="fa fa-times red-color" /> }
        </td>
        { assignment.submissionImprovedSubmission && periodStarted( assignment.improvedSubmissionPeriod ) &&
          <td className="center-cell">
          { team.improvedSubmission ? <i className="fa fa-check green-color" /> : <i className="fa fa-times red-color" /> }
          </td>
        }
        { canBeRated &&
          <td style={{
              whiteSpace: 'nowrap',
              width: '1%'
          }}>
          {this.getScore(team)}
          </td>
        }
          <td className="center-cell">
            { periodHappening(this.props.assignment.teamReviewPeriod) &&
            <Button color="success" onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(this.props.assignment['@id'])}/team/${getShortID(team['@id'])}/submission/teamReview`)}>Review team</Button>
          }
          { periodHasEnded(this.props.assignment.teamReviewPeriod) &&
            <Button color="success" onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(this.props.assignment['@id'])}/team/${getShortID(team['@id'])}/submission/teamReview`)}>Team results</Button>
          }
          </td>
        <td>
        <Button color={this.getButtonColor(team.settings)} onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(this.props.assignment['@id'])}/team/${getShortID(team['@id'])}/submission/submission`)}>
          { this.getButtonText(team.settings ) }
        </Button>
        </td>
        </tr>
      )}
      </tbody>
    </Table>
    )
  }
}

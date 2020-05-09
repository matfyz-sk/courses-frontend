import React, { Component } from 'react'
import { Alert, Table, Button, Label } from 'reactstrap';
import { getShortID, periodHappening, periodHasEnded } from '../../../helperFunctions';

export default class StudentTeamSubmissionsView extends Component {

  groupByTeam(initial, improved){
    let teams = [];
    initial.forEach((submission)=>{
      teams.push({...this.props.teams.find((team) => team['@id'] === submission.submittedByTeam['@id'] ),initialSubmission: submission })
    })
    improved.forEach((submission)=>{
      let teamIndex = teams.findIndex((team)=> team['@id'] === submission.submittedByTeam['@id'])
      if(teamIndex === -1){
        teams.push({...this.props.teams.find((team) => team['@id'] === submission.submittedByTeam['@id'] ),improvedSubmission: submission })
      } else{
        teams[teamIndex] = { ...teams[teamIndex], improvedSubmission: submission }
      }
    })
    return teams;
  }

  render() {
    let groupedSubmissions = this.groupByTeam(this.props.initialSubmissions, this.props.improvedSubmissions);
    return (
      <Table>
        <thead>
          <tr>
            <th>Team</th>
            <th className="center-cell">Initial</th>
            <th className="center-cell">Improved</th>
            {periodHappening(this.props.assignment.teamReviewPeriod) && <th width="80"></th>}
            {periodHasEnded(this.props.assignment.teamReviewPeriod) && <th width="80"></th>}
            <th width="80"></th>
          </tr>
        </thead>
      <tbody>
      { groupedSubmissions.map((team,index)=>
        <tr key={team['@id']}>
        <td>
        { team.name }
        </td>
        <td className="center-cell">
        { team.initialSubmission ? <i className="fa fa-check green-color" /> : <i className="fa fa-times red-color" /> }
        </td>
        <td className="center-cell">
        { team.improvedSubmission ? <i className="fa fa-check green-color" /> : <i className="fa fa-times red-color" /> }
        </td>
        { periodHappening(this.props.assignment.teamReviewPeriod) &&
          <td className="center-cell">
            <Button color="success" onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(this.props.assignment['@id'])}/team/${getShortID(team['@id'])}/submission/3`)}>Review team</Button>
          </td>
        }
        { periodHasEnded(this.props.assignment.teamReviewPeriod) &&
          <td className="center-cell">
            <Button color="success" onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(this.props.assignment['@id'])}/team/${getShortID(team['@id'])}/submission/3`)}>Team results</Button>
          </td>
        }
        <td>
        <Button color="success" onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(this.props.assignment['@id'])}/team/${getShortID(team['@id'])}/submission/0`)}>Update</Button>
        </td>
        </tr>
      )}
      </tbody>
    </Table>
    )
  }
}

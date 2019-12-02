import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import moment from 'moment';
import ErrorMessage from '../../../../components/error';

export default class PeerReview extends Component {
  constructor(props){
    super(props);
    this.setData.bind(this);
  }

  setData(parameter,value){
    let newData={...this.props.data};
    newData[parameter]=value;
    this.props.setData(newData);
  }

  getRealCloseTime(data){
    let deadline = moment(data.deadline).unix();
    let realCloseTime = parseInt(data.extraTime);
    if(isNaN(realCloseTime)){
      realCloseTime=0;
    }
    realCloseTime = realCloseTime*60;
    if(!isNaN(deadline)){
      realCloseTime += deadline;
    }
    return realCloseTime;
  }

  render(){
    return(
      <div>
        <h3>Peer review</h3>
        <div>
          <FormGroup check>
          <Label check>
            <Input type="checkbox" id="checkbox2" checked={this.props.data.disabled} onChange={()=>this.setData('disabled',!this.props.data.disabled)} /> {' '}
            Disabled
          </Label>
        </FormGroup>
        <FormGroup check>
        <Label check>
          <Input type="checkbox" id="checkbox2" checked={this.props.data.anonymousSubmission} onChange={()=>this.setData('anonymousSubmission',!this.props.data.anonymousSubmission)} disabled={this.props.data.disabled}/> {' '}
          Anonymný submission
        </Label>
      </FormGroup>
        <hr/>
        <FormGroup>
          <Label htmlFor="submission-add-openTime">Open time</Label>
          <Input id="submission-add-openTime" type="datetime-local" disabled={this.props.data.disabled} value={this.props.data.openTime} onChange={(e)=>this.setData('openTime',e.target.value)}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.openTime===''} message="You must pick an open time!" />
        <FormGroup>
          <Label htmlFor="submission-add-deadline">Deadline</Label>
          <Input id="submission-add-deadline" type="datetime-local" disabled={this.props.data.disabled} value={this.props.data.deadline} onChange={(e)=>this.setData('deadline',e.target.value)}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.deadline === '' } message="You must pick the deadline!" />
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.openTime !== '' && this.props.data.deadline !== '' && moment(this.props.data.openTime).unix() > moment(this.props.data.deadline).unix() } message="Open time is later than deadline!" />
        <FormGroup>
          <Label htmlFor="submission-add-extraTime">Extra time (in minutes)</Label>
          <Input id="submission-add-extraTime" type="number" disabled={this.props.data.disabled} value={this.props.data.extraTime} onChange={(e)=>this.setData('extraTime',e.target.value)}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && (isNaN(parseInt(this.props.data.extraTime)) || parseInt(this.props.data.extraTime) < 0)} message="Extra time is not an number or negative!" />
        <hr/>
        <FormGroup check>
        <Label check>
          <Input type="checkbox" id="checkbox2" checked={this.props.data.improvedSubmission} onChange={()=>this.setData('improvedSubmission',!this.props.data.improvedSubmission)} disabled={this.props.data.disabled}/> {' '}
          Improved submission
        </Label>
      </FormGroup>

    {
      this.props.data.improvedSubmission &&
      <div>
        <hr/>
        <FormGroup>
          <Label htmlFor="submission-add-improvedOpenTime">Open time</Label>
          <Input id="submission-add-improvedOpenTime" type="datetime-local" disabled={this.props.data.disabled} value={this.props.data.improvedOpenTime} onChange={(e)=>this.setData('improvedOpenTime',e.target.value)}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.improvedOpenTime===''} message="You must pick an open time!" />
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.improvedOpenTime!=='' && this.getRealCloseTime(this.props.data) > moment(this.props.data.improvedOpenTime).unix()} message="Improved open time must be after deadline!" />
        <FormGroup>
          <Label htmlFor="submission-add-improvedDeadline">Deadline</Label>
          <Input id="submission-add-improvedDeadline" type="datetime-local" disabled={this.props.data.disabled} value={this.props.data.improvedDeadline} onChange={(e)=>this.setData('improvedDeadline',e.target.value)}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.improvedDeadline===''} message="You must pick the deadline!" />
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.improvedOpenTime !== '' && this.props.data.improvedDeadline !== '' && moment(this.props.data.improvedOpenTime).unix() > moment(this.props.data.improvedDeadline).unix() } message="Open time is later than deadline!" />
        <FormGroup>
          <Label htmlFor="submission-add-improvedExtraTime">Extra time (in minutes)</Label>
          <Input id="submission-add-improvedExtraTime" type="number" disabled={this.props.data.disabled} value={this.props.data.improvedExtraTime} onChange={(e)=>this.setData('improvedExtraTime',e.target.value)}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && (isNaN(parseInt(this.props.data.improvedExtraTime)) || parseInt(this.props.data.improvedExtraTime) < 0)} message="Extra time is not an number or negative!" />
        <hr/>
      </div>
    }
        </div>

      </div>
    )
  }
}

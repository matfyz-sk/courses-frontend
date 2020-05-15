import React, { Component } from 'react';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import moment from 'moment';
import { timestampToInput } from 'helperFunctions';
import { getRealDeadline } from './verify';
import ErrorMessage from 'components/error';

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

  render(){
    return(
      <div>
        <h3>Submission</h3>
        <div>
        <FormGroup check>
        <Label check>
          <Input type="checkbox" id="checkbox2" checked={this.props.data.anonymousSubmission} onChange={()=>this.props.setSubmissionAnonymous(!this.props.data.anonymousSubmission)} /> {' '}
          Anonymný submission
        </Label>
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input type="checkbox" id="checkbox2" checked={this.props.data.improvedSubmission} onChange={()=>this.setData('improvedSubmission',!this.props.data.improvedSubmission)} /> {' '}
            Improved submission
        </Label>
      </FormGroup>
      <div className="flex-row">
        <div className="flex-clumn mr-2" style={{width:'50%'}}>
          <FormGroup>
            <Label htmlFor="submission-add-openTime">Open time</Label>
            <Input id="submission-add-openTime" type="datetime-local" value={this.props.data.openTime} onChange={(e)=>this.setData('openTime',e.target.value)}/>
          </FormGroup>
          <ErrorMessage show={this.props.showErrors && this.props.data.openTime===''} message="You must pick an open time!" />
          <FormGroup>
            <Label htmlFor="submission-add-deadline">Deadline</Label>
            <Button className="ml-2 mb-2 p-1" color="primary" onClick={()=>{ this.setData('deadline', this.props.data.openTime ) }}><i className="fa fa-copy clickable" />Copy open time</Button>
            <Input id="submission-add-deadline" type="datetime-local" value={this.props.data.deadline} onChange={(e)=>this.setData('deadline',e.target.value)}/>
          </FormGroup>
          <ErrorMessage show={this.props.showErrors && this.props.data.deadline === '' } message="You must pick the deadline!" />
          <ErrorMessage show={this.props.showErrors && this.props.data.openTime !== '' && this.props.data.deadline !== '' && moment(this.props.data.openTime).unix() > moment(this.props.data.deadline).unix() } message="Open time is later than deadline!" />
          <FormGroup>
            <Label htmlFor="submission-add-extraTime">Extra time (in minutes)</Label>
            <Input id="submission-add-extraTime" type="number" value={this.props.data.extraTime} onChange={(e)=>this.setData('extraTime',e.target.value)}/>
          </FormGroup>
          <ErrorMessage show={this.props.showErrors && (isNaN(parseInt(this.props.data.extraTime)) || parseInt(this.props.data.extraTime) < 0)} message="Extra time is not an number or negative!" />
        </div>
        {this.props.data.improvedSubmission && <div className="flex-clumn ml-2" style={{width:'50%'}}>
          <FormGroup>
            <Label htmlFor="submission-add-improvedOpenTime">Open time</Label>
            <Button className="ml-2 mb-2 p-1" color="primary" disabled={ this.props.initialDeadline === null } onClick={()=>{ this.setData('improvedOpenTime', timestampToInput(this.props.initialDeadline) ) }}><i className="fa fa-copy clickable" />Copy initial deadline</Button>
            <Input id="submission-add-improvedOpenTime" type="datetime-local" value={this.props.data.improvedOpenTime} onChange={(e)=>this.setData('improvedOpenTime',e.target.value)}/>
          </FormGroup>
          <ErrorMessage show={this.props.showErrors && this.props.data.improvedOpenTime===''} message="You must pick an open time!" />
          <ErrorMessage show={this.props.showErrors && this.props.data.improvedOpenTime!=='' && this.props.initialDeadline !== null && this.props.initialDeadline > moment(this.props.data.improvedOpenTime).unix()} message="Improved open time must be after intial deadline!" />
          <FormGroup>
            <Label htmlFor="submission-add-improvedDeadline">Deadline</Label>
            <Button className="ml-2 mb-2 p-1" color="primary" onClick={()=>{ this.setData('improvedDeadline', this.props.data.improvedOpenTime ) }}><i className="fa fa-copy clickable" />Copy open time</Button>
            <Input id="submission-add-improvedDeadline" type="datetime-local" value={this.props.data.improvedDeadline} onChange={(e)=>this.setData('improvedDeadline',e.target.value)}/>
          </FormGroup>
          <ErrorMessage show={this.props.showErrors && this.props.data.improvedDeadline===''} message="You must pick the deadline!" />
          <ErrorMessage show={this.props.showErrors && this.props.data.improvedOpenTime !== '' && this.props.data.improvedDeadline !== '' && moment(this.props.data.improvedOpenTime).unix() > moment(this.props.data.improvedDeadline).unix() } message="Open time is later than deadline!" />
          <FormGroup>
            <Label htmlFor="submission-add-improvedExtraTime">Extra time (in minutes)</Label>
            <Input id="submission-add-improvedExtraTime" type="number" value={this.props.data.improvedExtraTime} onChange={(e)=>this.setData('improvedExtraTime',e.target.value)}/>
          </FormGroup>
          <ErrorMessage show={this.props.showErrors && (isNaN(parseInt(this.props.data.improvedExtraTime)) || parseInt(this.props.data.improvedExtraTime) < 0)} message="Extra time is not an number or negative!" />
        </div>}
      </div>
    </div>

  </div>
  )}
}

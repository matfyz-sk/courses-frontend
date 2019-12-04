import React, { Component } from 'react';
import { FormGroup, Label, Input, Button, Table } from 'reactstrap';
import moment from 'moment';

import ErrorMessage from '../../../../components/error';


export default class Reviews extends Component {
  constructor(props){
    super(props);
    this.setData.bind(this);
    this.removeQuestion.bind(this);
  }

  setData(parameter,value){
    let newData={...this.props.data};
    newData[parameter]=value;
    this.props.setData(newData);
  }

  removeQuestion(id){
    if(window.confirm('Are you sure you want to delete this question?')){
      let newQuestions=[...this.props.data.questions];
      newQuestions.splice(newQuestions.findIndex((question)=>question.id===id),1);
      this.setData('questions',newQuestions);
    }
  }

  render(){
    return(
      <div>
        <h3>Review</h3>
        <div>
          <FormGroup check>
          <Label check>
            <Input type="checkbox" checked={this.props.data.disabled} onChange={()=>this.setData('disabled',!this.props.data.disabled)} /> {' '}
            Disabled
          </Label>
        </FormGroup>
        <hr/>
        <FormGroup>
          <Label htmlFor="submission-add-openTime" >Open time</Label>
          <Input id="submission-add-openTime" type="datetime-local" value={this.props.data.openTime} onChange={(e)=>{this.setData('openTime',e.target.value)}} disabled={this.props.data.disabled}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.openTime===''} message="You must pick an open time!" />
        <FormGroup>
          <Label htmlFor="submission-add-deadline" >Deadline</Label>
          <Input id="submission-add-deadline" type="datetime-local" value={this.props.data.deadline} onChange={(e)=>{this.setData('deadline',e.target.value)}} disabled={this.props.data.disabled}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.deadline === '' } message="You must pick the deadline!" />
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.openTime !== '' && this.props.data.deadline !== '' && moment(this.props.data.openTime).unix() > moment(this.props.data.deadline).unix() } message="Open time is later than deadline!" />
        <FormGroup>
          <Label htmlFor="submission-add-extraTime" >Extra time (in minutes)</Label>
          <Input id="submission-add-extraTime" type="number" value={this.props.data.extraTime} onChange={(e)=>{this.setData('extraTime',e.target.value)}} disabled={this.props.data.disabled}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && (isNaN(parseInt(this.props.data.extraTime)) || parseInt(this.props.data.extraTime) < 0)} message="Extra time is not an number or negative!" />
        <FormGroup>
          <Label htmlFor="submission-add-reviewsPerSubmission">Number of reviews per submission</Label>
          <Input id="submission-add-reviewsPerSubmission" type="number" value={this.props.data.reviewsPerSubmission} onChange={(e)=>{this.setData('reviewsPerSubmission',e.target.value)}} disabled={this.props.data.disabled}/>
        </FormGroup>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && (isNaN(parseInt(this.props.data.reviewsPerSubmission)) || parseInt(this.props.data.reviewsPerSubmission) < 1)} message="Reviews per submission must be one or more!" />
        <hr/>

        <div className="row">
          <FormGroup tag="fieldset">
            <Label style={{paddingRight:5}}>Reviewed by:</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="reviewedByTeam" checked={this.props.data.reviewedByTeam===true} onChange={(e)=>{this.setData('reviewedByTeam',true)}} disabled={this.props.data.disabled}/>{' '}
                Team
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="reviewedByTeam" checked={this.props.data.reviewedByTeam===false} onChange={(e)=>{this.setData('reviewedByTeam',false)}} disabled={this.props.data.disabled}/>{' '}
                Individual
              </Label>
            </FormGroup>
          </FormGroup>
        </div>

        <div className="row">
          <FormGroup tag="fieldset">
            <Label style={{paddingRight:5}}>Visibility of review:</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="reviewVisibility" checked={this.props.data.visibility==='open'} onChange={(e)=>{this.setData('visibility','open');}} disabled={this.props.data.disabled || this.props.openDisabled}/>{' '}
                Open
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="reviewVisibility" checked={this.props.data.visibility==='blind'} onChange={(e)=>{this.setData('visibility','blind');}} disabled={this.props.data.disabled}/>{' '}
                Blind
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="reviewVisibility" checked={this.props.data.visibility==='doubleBlind'} onChange={(e)=>{this.setData('visibility','doubleBlind');}} disabled={this.props.data.disabled}/>{' '}
                Double blind
              </Label>
            </FormGroup>
          </FormGroup>
        </div>
        <Button size="sm" color="success">
          <i className="fa fa-plus clickable" />
          Add questions
        </Button>
        <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.questions.length < 1} message="There must be a review question!" />
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.data.questions.map((question)=>
              <tr key={question.id}>
                <th scope="row">{question.id}</th>
                <td>{question.name}</td>
                <td>
                  <Button size="sm" color="" onClick={()=>this.removeQuestion(question.id)}>
                    <i className="fa fa-times clickable" />
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        </div>

      </div>
    )
  }
}

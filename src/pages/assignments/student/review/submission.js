import React, { Component } from 'react';
import { FormGroup, Label, FormText } from 'reactstrap';
import {timestampToString} from '../../../../helperFunctions';
import {submissions, teams} from './data';


export default class Assignment extends Component{
  constructor(props){
    super(props);
    this.state={
      submission:submissions.find((item)=>item.id===parseInt(this.props.match.params.id))
    }
  }

  render(){
    return(
      <div className="row">
        <div className="submissionContainer bottomSeparator col-6">
          <h3>Zadanie úlohy</h3>
          <FormGroup>
            <Label className="bold">Deadline: </Label>  {timestampToString(this.state.submission.deadline)}
            </FormGroup>
            <div className="bottomSeparator">
              {this.state.submission.description}
            </div>
            <div className="bottomSeparator">
              {this.state.submission.body}
            </div>
            <h4>Odovzdané</h4>
          <FormGroup>
            <Label className="bold">Text area</Label>
            <div>Here will be the submitted multiple line text</div>
          </FormGroup>
          <FormGroup>
            <Label className="bold mr-2">File</Label>
            <a href="https://www.google.com">Google</a>
            <FormText color="muted">
              This is some placeholder block-level help text for the above input.
              It's a bit lighter and easily wraps to a new line.
            </FormText>
          </FormGroup>
          <FormGroup>
            <Label className="bold mr-2">Team:</Label>
            {teams[0].label}
          </FormGroup>
          </div>
          <div className="submissionContainer bottomSeparator col-6">
            <h3>Staršie odovzdanie</h3>
            <FormGroup>
              <Label className="bold">Deadline: </Label>  {timestampToString(this.state.submission.deadline)}
              </FormGroup>
              <h4>Odovzdané</h4>
              <FormGroup>
                <Label className="bold">Text area</Label>
                <div>Here will be the submitted multiple line text</div>
              </FormGroup>
              <FormGroup>
                <Label className="bold mr-2">File</Label>
                <a href="https://www.google.com">Google</a>
                <FormText color="muted">
                  This is some placeholder block-level help text for the above input.
                  It's a bit lighter and easily wraps to a new line.
                </FormText>
              </FormGroup>
              <FormGroup>
                <Label className="bold mr-2">Team:</Label>
                {teams[0].label}
              </FormGroup>
            </div>
          </div>
        )
      }
    }

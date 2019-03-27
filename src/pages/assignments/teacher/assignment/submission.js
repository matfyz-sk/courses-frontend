import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, FormGroup, Label, Input, FormText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

import {timestampToString} from '../../../../helperFunctions';

const submissions = [
  {id:1,title:'Assignment 2',active:false, deadline:1549788300, body:'BBB this will be full body of assignment', description:'Short description of assignment'},
  {id:0,title:'Assignment 1',active:false, deadline:1547109900, body:'CCC this will be full body of assignment',description:'Short description of assignment' },
]

const teams = [
  {value:0,label:'Jarovice',members:[{id:1,name:'Jaroslav',surname:'Matejovic'},{id:2,name:'Jaroslav',surname:'Biely'},{id:0,name:'Juraj',surname:'Macek'}]},
  {value:1,label:'Failures',members:[{id:4,name:'Barbora',surname:'Severna'},{id:5,name:'Martin',surname:'Juzny'},{id:0,name:'Juraj',surname:'Macek'}]}
]

const selectStyle = {
  control: base => ({
    ...base,
    minWidth: 250,
  })
};

export default class Assignment extends Component{
  constructor(props){
    super(props);
    this.state={
      submission:submissions.find((item)=>item.id===parseInt(this.props.match.params.id))
    }
  }

  render(){
    return(
      <div>
        <div className="submissionContainer bottomSeparator">
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
            <h3>Odovzdanie úlohy</h3>
            <FormGroup>
              <Label for="exampleText">Text Area</Label>
              <Input type="textarea" name="text" id="exampleText" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleFile">File</Label>
              <Input type="file" name="file" id="exampleFile" />
              <FormText color="muted">
                This is some placeholder block-level help text for the above input.
                It's a bit lighter and easily wraps to a new line.
              </FormText>
            </FormGroup>
            <div className="row">
              <Select
                styles={selectStyle}
                options={teams}
                />
              <Button color="success">Save</Button>
            </div>
          </div>
          <h3>
            Old submission
          </h3>
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
      )
    }
  }

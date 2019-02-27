import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, FormGroup, Label, Input, FormText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

import {timestampToString} from '../../../../../helperFunctions';

const submissions = [
  {id:2,title:'Submission 3',active:true, deadline:1604047500,body:'AAH' },
  {id:1,title:'Submission 2',active:false, deadline:1549788300, body:'BBB' },
  {id:0,title:'Submission 1',active:false, deadline:1547109900, body:'CCC' },
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

export default class ViewReview extends Component{
  constructor(props){
    super(props);
    this.state={
      open:false,
      submission:submissions.find((item)=>item.id===parseInt(this.props.match.params.id))
    }
    console.log(this.props.match.params);
  }

  toggle(){
    this.setState({open:!this.state.open})
  }

  render(){
    return(
      <Card className="assignmentsContainer center-ver">
        <CardHeader>
          <FontAwesomeIcon
            icon="envelope"
            className="clickable"
            onClick={()=>this.props.history.goBack()}
          />
          {this.state.submission.active?' Editing':' Viewing'} submission
        </CardHeader>
          <CardBody>
            <h2>Zadanie úlohy</h2>
            <FormGroup>
              <Label>Deadline: </Label>  {timestampToString(this.state.submission.deadline)}
            </FormGroup>
            {this.state.submission.body}
            <h2>Odovzdanie úlohy</h2>
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
            <Button color="success" onClick={this.toggle.bind(this)}>Save</Button>
            <Button color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
            </div>
          </CardBody>
      </Card>
    )
  }
}
